<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use RuntimeException;

class PackageMarkdownService
{
    private const TYPES = [
        'how-to-play' => [
            'resource' => 'how_to_play',
            'filename' => 'how-to-play.md',
            'label' => 'How to Play',
        ],
        'hints' => [
            'resource' => 'hints',
            'filename' => 'hints.md',
            'label' => 'Hints',
        ],
        'walkthrough' => [
            'resource' => 'walkthrough',
            'filename' => 'walkthrough.md',
            'label' => 'Walkthrough',
        ],
    ];

    /** @var Grav */
    private $grav;

    /** @var array */
    private $config;

    /** @var string */
    private $basePath;

    public function __construct()
    {
        $this->grav = Grav::instance();
        $this->config = (array) $this->grav['config']->get('plugins.terpvault', []);

        $stream = (string)($this->config['storage']['games_path'] ?? 'user://data/terpvault/games');
        $this->basePath = $this->grav['locator']->findResource($stream, true, true) ?: '';
    }

    public function markdown(string $slug, string $type): array
    {
        $paths = $this->markdownPaths($slug, $type);

        $content = '';
        if (is_file($paths['file'])) {
            $content = file_get_contents($paths['file']);
            if ($content === false) {
                throw new RuntimeException('Unable to read helper Markdown file.');
            }
        }

        return [
            'slug' => $paths['slug'],
            'type' => $paths['type'],
            'label' => self::TYPES[$paths['type']]['label'],
            'resource_field' => 'resources.' . self::TYPES[$paths['type']]['resource'],
            'relative_path' => $paths['relative'],
            'path' => $paths['file'],
            'exists' => is_file($paths['file']),
            'content' => $content,
        ];
    }

    public function updateMarkdown(string $slug, string $type, string $content): array
    {
        $paths = $this->markdownPaths($slug, $type);
        $backup = $this->writeMarkdownAtomically($paths['file'], $content);
        $result = $this->markdown($paths['slug'], $paths['type']);
        $result['backup'] = $backup;

        return $result;
    }

    private function markdownPaths(string $slug, string $type): array
    {
        $type = trim($type);
        if (!array_key_exists($type, self::TYPES)) {
            throw new InvalidArgumentException('Invalid helper Markdown type.');
        }

        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $resourceKey = self::TYPES[$type]['resource'];
        $relative = $metadata['resources'][$resourceKey] ?? self::TYPES[$type]['filename'];
        $relative = trim((string) $relative);
        if ($relative === '') {
            $relative = self::TYPES[$type]['filename'];
        }

        $file = $this->resolvePackageFile($paths['package'], $relative);

        return [
            'slug' => $paths['slug'],
            'type' => $type,
            'base' => $paths['base'],
            'package' => $paths['package'],
            'yaml' => $paths['yaml'],
            'relative' => $relative,
            'file' => $file,
        ];
    }

    private function packagePaths(string $slug): array
    {
        $slug = trim($slug);
        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }

        if ($this->basePath === '' || !is_dir($this->basePath)) {
            throw new RuntimeException('TerpVault games directory is not available.');
        }

        $base = realpath($this->basePath);
        if ($base === false) {
            throw new RuntimeException('Unable to resolve TerpVault games directory.');
        }

        $package = $this->basePath . DIRECTORY_SEPARATOR . $slug;
        if (!is_dir($package)) {
            throw new InvalidArgumentException('Package not found: ' . $slug);
        }

        $packageReal = realpath($package);
        if ($packageReal === false || !$this->isPathInside($packageReal, $base)) {
            throw new InvalidArgumentException('Package path is outside the TerpVault games directory.');
        }

        $yaml = $packageReal . DIRECTORY_SEPARATOR . 'game.yaml';
        if (!is_file($yaml)) {
            throw new InvalidArgumentException('Package game.yaml not found: ' . $slug);
        }

        return [
            'slug' => $slug,
            'base' => $base,
            'package' => $packageReal,
            'yaml' => $yaml,
        ];
    }

    private function resolvePackageFile(string $package, string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $relative)) {
            throw new InvalidArgumentException('Invalid helper Markdown path.');
        }

        $relative = str_replace('\\', '/', $relative);
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid helper Markdown path.');
        }

        $segments = array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        });
        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException('Helper Markdown path cannot contain traversal segments.');
            }
        }

        $file = $package . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $segments);
        $dir = dirname($file);
        $dirReal = realpath($dir);
        if ($dirReal === false || !$this->isPathInside($dirReal, $package)) {
            throw new InvalidArgumentException('Helper Markdown path is outside the package directory.');
        }

        if (is_file($file)) {
            $fileReal = realpath($file);
            if ($fileReal === false || !$this->isPathInside($fileReal, $package)) {
                throw new InvalidArgumentException('Helper Markdown file is outside the package directory.');
            }
            $file = $fileReal;
        }

        if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) !== 'md') {
            throw new InvalidArgumentException('Only Markdown .md helper files can be edited.');
        }

        return $file;
    }

    private function isPathInside(string $path, string $base): bool
    {
        $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos(rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, $base) === 0;
    }

    private function loadYaml(string $path): array
    {
        $data = Yaml::parse(file_get_contents($path) ?: '') ?: [];
        if (!is_array($data)) {
            throw new RuntimeException('Invalid game.yaml structure.');
        }

        return $data;
    }

    private function writeMarkdownAtomically(string $file, string $content): string
    {
        $dir = dirname($file);
        $name = basename($file);
        $lockPath = $dir . DIRECTORY_SEPARATOR . '.' . $name . '.lock';
        $lock = fopen($lockPath, 'c');
        if ($lock === false) {
            throw new RuntimeException('Unable to open helper Markdown lock file.');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Unable to lock helper Markdown file.');
            }

            $backup = '';
            if (is_file($file)) {
                $backup = $this->backupPath($file);
                if (!copy($file, $backup)) {
                    throw new RuntimeException('Unable to create helper Markdown backup.');
                }
            }

            $temp = $dir . DIRECTORY_SEPARATOR . '.' . $name . '.tmp-' . bin2hex(random_bytes(8));
            if (file_put_contents($temp, $content) === false) {
                throw new RuntimeException('Unable to write helper Markdown temp file.');
            }

            $mode = is_file($file) ? @fileperms($file) : false;
            if ($mode !== false) {
                @chmod($temp, $mode & 0777);
            }

            if (!rename($temp, $file)) {
                @unlink($temp);
                throw new RuntimeException('Unable to replace helper Markdown file.');
            }

            flock($lock, LOCK_UN);
            fclose($lock);
            @unlink($lockPath);

            return $backup;
        } catch (\Throwable $e) {
            flock($lock, LOCK_UN);
            fclose($lock);
            @unlink($lockPath);
            throw $e;
        }
    }

    private function backupPath(string $file): string
    {
        $base = $file . '.bak-' . date('Ymd-His');
        $candidate = $base;
        $index = 1;
        while (file_exists($candidate)) {
            $candidate = $base . '-' . $index;
            $index++;
        }

        return $candidate;
    }
}
