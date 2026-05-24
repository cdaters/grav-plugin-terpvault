<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use RuntimeException;
use ZipArchive;

class PackageArchiveService
{
    private const CONVENTIONAL_FILES = [
        'cover.jpg',
        'cover.jpeg',
        'cover.png',
        'cover.webp',
        'cover.gif',
        'hero.jpg',
        'hero.jpeg',
        'hero.png',
        'hero.webp',
        'hero.gif',
        'small-cover.jpg',
        'small-cover.jpeg',
        'small-cover.png',
        'small-cover.webp',
        'small-cover.gif',
        'how-to-play.md',
        'hints.md',
        'walkthrough.md',
        'metadata.iFiction.xml',
    ];

    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    private const FEELIE_EXTENSIONS = ['pdf', 'txt', 'md', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'ogg', 'wav', 'm4a'];

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

    public function export(string $slug): array
    {
        if (!class_exists(ZipArchive::class)) {
            throw new RuntimeException('PHP ZipArchive is required to export TerpVault packages.');
        }

        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $files = $this->collectFiles($paths['package'], $metadata);

        if (!isset($files['game.yaml'])) {
            throw new RuntimeException('Package game.yaml could not be added to the export.');
        }

        $zipPath = $this->temporaryZipPath($paths['slug']);
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('Unable to create package export zip.');
        }

        try {
            $zip->addEmptyDir($paths['slug']);
            ksort($files);
            foreach ($files as $relative => $source) {
                $archivePath = $paths['slug'] . '/' . $this->normalizeRelativePath($relative);
                if (!$zip->addFile($source, $archivePath)) {
                    throw new RuntimeException('Unable to add file to package export: ' . $relative);
                }
            }
        } catch (\Throwable $e) {
            $zip->close();
            @unlink($zipPath);
            throw $e;
        }

        if (!$zip->close()) {
            @unlink($zipPath);
            throw new RuntimeException('Unable to finalize package export zip.');
        }

        return [
            'slug' => $paths['slug'],
            'path' => $zipPath,
            'filename' => $paths['slug'] . '.terpvault.zip',
            'size' => (int) filesize($zipPath),
            'files' => array_keys($files),
        ];
    }

    private function collectFiles(string $package, array $metadata): array
    {
        $files = [];
        $this->addFile($files, $package, 'game.yaml', true);

        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];
        foreach (['story_file', 'cover', 'small_cover', 'how_to_play', 'hints', 'walkthrough'] as $key) {
            $relative = isset($resources[$key]) ? (string) $resources[$key] : '';
            if ($relative !== '') {
                $this->addFile($files, $package, $relative, $key === 'story_file');
            }
        }

        $hero = $this->resourcePath($resources['hero'] ?? '');
        if ($hero !== '') {
            $this->addFile($files, $package, $hero, false, self::IMAGE_EXTENSIONS);
        }

        $screenshots = is_array($resources['screenshots'] ?? null) ? $resources['screenshots'] : [];
        foreach ($screenshots as $screenshot) {
            $relative = (string) $screenshot;
            if ($relative !== '') {
                $this->addFile($files, $package, $relative);
            }
        }

        $feelies = is_array($resources['feelies'] ?? null) ? $resources['feelies'] : [];
        foreach ($feelies as $feelie) {
            $relative = $this->resourcePath($feelie);
            if ($relative !== '') {
                $this->addFile($files, $package, $relative, false, self::FEELIE_EXTENSIONS);
            }
        }

        foreach (self::CONVENTIONAL_FILES as $relative) {
            $this->addFile($files, $package, $relative);
        }

        $screenshotsDir = $package . DIRECTORY_SEPARATOR . 'screenshots';
        if (is_dir($screenshotsDir)) {
            foreach (new \DirectoryIterator($screenshotsDir) as $fileinfo) {
                if (!$fileinfo->isFile()) {
                    continue;
                }
                $name = $fileinfo->getFilename();
                $relative = 'screenshots/' . $name;
                if ($this->allowedExtension($relative, self::IMAGE_EXTENSIONS)) {
                    $this->addFile($files, $package, $relative, false, self::IMAGE_EXTENSIONS);
                }
            }
        }

        $feeliesDir = $package . DIRECTORY_SEPARATOR . 'feelies';
        if (is_dir($feeliesDir)) {
            foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($feeliesDir, \FilesystemIterator::SKIP_DOTS)) as $fileinfo) {
                if (!$fileinfo->isFile()) {
                    continue;
                }
                $relative = str_replace(DIRECTORY_SEPARATOR, '/', substr($fileinfo->getPathname(), strlen($package) + 1));
                if ($this->allowedExtension($relative, self::FEELIE_EXTENSIONS)) {
                    $this->addFile($files, $package, $relative, false, self::FEELIE_EXTENSIONS);
                }
            }
        }

        return $files;
    }

    private function resourcePath($value): string
    {
        if (is_array($value)) {
            return trim((string)($value['path'] ?? ''));
        }

        return is_string($value) ? trim($value) : '';
    }

    private function addFile(array &$files, string $package, string $relative, bool $required = false, array $allowedExtensions = []): void
    {
        $relative = $this->normalizeRelativePath($relative);
        if ($this->excludedRelativePath($relative)) {
            if ($required) {
                throw new InvalidArgumentException('Required package file is excluded from export: ' . $relative);
            }
            return;
        }

        if ($allowedExtensions && !$this->allowedExtension($relative, $allowedExtensions)) {
            if ($required) {
                throw new InvalidArgumentException('Required package file extension is not allowed: ' . $relative);
            }
            return;
        }

        $source = $this->resolvePackageFile($package, $relative);
        if (!$source || !is_file($source)) {
            if ($required) {
                throw new InvalidArgumentException('Required package file not found: ' . $relative);
            }
            return;
        }

        $files[$relative] = $source;
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
        $relative = $this->normalizeRelativePath($relative);
        $file = $package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);

        $real = realpath($file);
        if ($real === false) {
            return '';
        }

        if (!$this->isPathInside($real, $package)) {
            throw new InvalidArgumentException('Package file path is outside the package directory: ' . $relative);
        }

        return $real;
    }

    private function normalizeRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $relative)) {
            throw new InvalidArgumentException('Invalid package file path.');
        }

        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid package file path.');
        }

        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));

        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException('Package file path cannot contain traversal segments.');
            }
        }

        return implode('/', $segments);
    }

    private function excludedRelativePath(string $relative): bool
    {
        $segments = explode('/', $relative);
        foreach ($segments as $segment) {
            if ($segment === '__MACOSX' || $segment === '.DS_Store' || $segment === 'Thumbs.db' || $segment === 'desktop.ini') {
                return true;
            }
            if (strpos($segment, '._') === 0) {
                return true;
            }
            if ($segment !== 'metadata.iFiction.xml' && strpos($segment, '.') === 0) {
                return true;
            }
            if (strpos($segment, '.bak-') !== false || substr($segment, -5) === '.lock' || strpos($segment, '.tmp-') !== false) {
                return true;
            }
        }

        return false;
    }

    private function allowedExtension(string $relative, array $allowed): bool
    {
        return in_array(strtolower(pathinfo($relative, PATHINFO_EXTENSION)), $allowed, true);
    }

    private function loadYaml(string $path): array
    {
        $data = Yaml::parse(file_get_contents($path) ?: '') ?: [];
        if (!is_array($data)) {
            throw new RuntimeException('Invalid game.yaml structure.');
        }

        return $data;
    }

    private function temporaryZipPath(string $slug): string
    {
        $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
        $path = tempnam($dir, 'terpvault-export-' . $slug . '-');
        if ($path === false) {
            throw new RuntimeException('Unable to create temporary export file.');
        }

        $zipPath = $path . '.zip';
        if (!rename($path, $zipPath)) {
            @unlink($path);
            throw new RuntimeException('Unable to prepare temporary export zip.');
        }

        return $zipPath;
    }

    private function isPathInside(string $path, string $base): bool
    {
        $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos(rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, $base) === 0;
    }
}
