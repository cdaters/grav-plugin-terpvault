<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;

class PackageStoryService
{
    private const EXTENSIONS = [
        'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb',
        'ulx', 'gblorb', 'glb', 'gam', 't3', 'taf',
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

    public function story(string $slug): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $relative = $this->storyRelativePath($metadata);
        $file = $relative !== '' ? $this->resolvePackageFile($paths['package'], $relative, false) : '';
        $exists = $file !== '' && is_file($file);
        $extension = $relative !== '' ? strtolower(pathinfo($relative, PATHINFO_EXTENSION)) : '';

        return [
            'slug' => $paths['slug'],
            'story_file' => $relative,
            'relative_path' => $relative,
            'path' => $file,
            'exists' => $exists,
            'extension' => $extension,
            'size' => $exists ? (int) filesize($file) : 0,
            'allowed_extensions' => self::EXTENSIONS,
        ];
    }

    public function upload(string $slug, UploadedFileInterface $upload): array
    {
        if ($upload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Uploaded story file is not available.');
        }

        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $extension = $this->validateUpload($upload);
        $relative = $this->targetRelativePath($upload, $extension);
        $target = $this->resolvePackageFile($paths['package'], $relative, true);
        $currentRelative = $this->storyRelativePath($metadata);
        $current = $currentRelative !== '' ? $this->resolvePackageFile($paths['package'], $currentRelative, false) : '';
        $storyBackup = $current !== '' && $current !== $target && is_file($current) ? $this->backupExistingStory($current) : '';

        $writeBackup = $this->writeUploadAtomically($upload, $target);

        $updated = $metadata;
        if (!isset($updated['resources']) || !is_array($updated['resources'])) {
            $updated['resources'] = [];
        }
        $updated['resources']['story_file'] = $relative;

        $metadataBackup = $this->writeYamlAtomically($paths['yaml'], $updated);
        $result = $this->story($paths['slug']);
        $result['uploaded'] = [
            'relative_path' => $relative,
            'filename' => basename($relative),
            'extension' => $extension,
            'previous_story_backup' => $storyBackup,
            'replaced_target_backup' => $writeBackup,
            'metadata_backup' => $metadataBackup,
        ];

        return $result;
    }

    private function validateUpload(UploadedFileInterface $upload): string
    {
        $clientName = (string) $upload->getClientFilename();
        $extension = strtolower(pathinfo($clientName, PATHINFO_EXTENSION));
        if (!in_array($extension, self::EXTENSIONS, true)) {
            throw new InvalidArgumentException('Unsupported story file extension.');
        }

        return $extension;
    }

    private function targetRelativePath(UploadedFileInterface $upload, string $extension): string
    {
        $name = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_FILENAME));
        $name = preg_replace('/[^a-z0-9_-]+/', '-', $name) ?: '';
        $name = trim($name, '-_');
        if ($name === '') {
            $name = 'story';
        }

        return $name . '.' . $extension;
    }

    private function storyRelativePath(array $metadata): string
    {
        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];
        return isset($resources['story_file']) ? $this->normalizeRelativePath((string) $resources['story_file']) : '';
    }

    private function writeUploadAtomically(UploadedFileInterface $upload, string $target): string
    {
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create story file directory.');
        }

        $lockPath = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.lock';
        $lock = fopen($lockPath, 'c');
        if ($lock === false) {
            throw new RuntimeException('Unable to open story file lock.');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Unable to lock story file.');
            }

            $backup = '';
            if (is_file($target)) {
                $backup = $this->backupPath($target);
                if (!copy($target, $backup)) {
                    throw new RuntimeException('Unable to create story file backup.');
                }
            }

            $temp = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
            $stream = $upload->getStream();
            if ($stream->isSeekable()) {
                $stream->rewind();
            }

            if (file_put_contents($temp, (string) $stream) === false) {
                throw new RuntimeException('Unable to write story file temp file.');
            }

            $mode = is_file($target) ? @fileperms($target) : false;
            if ($mode !== false) {
                @chmod($temp, $mode & 0777);
            }

            if (!rename($temp, $target)) {
                @unlink($temp);
                throw new RuntimeException('Unable to replace story file.');
            }

            flock($lock, LOCK_UN);
            fclose($lock);
            @unlink($lockPath);

            return $backup;
        } catch (\Throwable $e) {
            if (isset($temp) && is_file($temp)) {
                @unlink($temp);
            }
            flock($lock, LOCK_UN);
            fclose($lock);
            @unlink($lockPath);
            throw $e;
        }
    }

    private function backupExistingStory(string $file): string
    {
        $backup = $this->backupPath($file);
        if (!copy($file, $backup)) {
            throw new RuntimeException('Unable to back up current story file.');
        }

        return $backup;
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

    private function resolvePackageFile(string $package, string $relative, bool $createDir): string
    {
        $relative = $this->normalizeRelativePath($relative);
        $this->assertStoryExtension($relative);

        $file = $package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        $dir = dirname($file);
        if ($createDir && !is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create story file directory.');
        }

        $dirReal = realpath($dir);
        if ($dirReal === false && !$createDir) {
            return $file;
        }

        if ($dirReal === false || !$this->isPathInside($dirReal, $package)) {
            throw new InvalidArgumentException('Story file path is outside the package directory.');
        }

        return $file;
    }

    private function normalizeRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $relative)) {
            throw new InvalidArgumentException('Invalid story file path.');
        }

        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid story file path.');
        }

        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));
        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException('Story file path cannot contain traversal segments.');
            }
        }

        return implode('/', $segments);
    }

    private function assertStoryExtension(string $path): void
    {
        if (!in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), self::EXTENSIONS, true)) {
            throw new InvalidArgumentException('Unsupported story file extension.');
        }
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

    private function writeYamlAtomically(string $yaml, array $metadata): string
    {
        $dir = dirname($yaml);
        $lockPath = $dir . DIRECTORY_SEPARATOR . '.game.yaml.lock';
        $lock = fopen($lockPath, 'c');
        if ($lock === false) {
            throw new RuntimeException('Unable to open metadata lock file.');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Unable to lock metadata file.');
            }

            $backup = $this->backupPath($yaml);
            if (!copy($yaml, $backup)) {
                throw new RuntimeException('Unable to create metadata backup.');
            }

            $temp = $dir . DIRECTORY_SEPARATOR . '.game.yaml.tmp-' . bin2hex(random_bytes(8));
            if (file_put_contents($temp, $this->dumpYaml($metadata)) === false) {
                throw new RuntimeException('Unable to write metadata temp file.');
            }

            $mode = @fileperms($yaml);
            if ($mode !== false) {
                @chmod($temp, $mode & 0777);
            }

            if (!rename($temp, $yaml)) {
                @unlink($temp);
                throw new RuntimeException('Unable to replace metadata file.');
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

    private function dumpYaml(array $data): string
    {
        if (method_exists(Yaml::class, 'dump')) {
            return rtrim((string) Yaml::dump($data, 10, 2)) . "\n";
        }

        if (class_exists('\Symfony\Component\Yaml\Yaml')) {
            return rtrim((string) \Symfony\Component\Yaml\Yaml::dump($data, 10, 2)) . "\n";
        }

        throw new RuntimeException('YAML dumping is not available.');
    }
}
