<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;

class PackageMediaService
{
    private const TYPES = ['cover', 'small-cover', 'hero', 'screenshot'];

    private const EXTENSIONS = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
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

    public function media(string $slug): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];

        return [
            'slug' => $paths['slug'],
            'package_path' => $paths['package'],
            'resources' => [
                'cover' => (string)($resources['cover'] ?? ''),
                'small_cover' => (string)($resources['small_cover'] ?? ''),
                'hero' => $this->resourcePath($resources['hero'] ?? ''),
                'screenshots' => array_values(array_filter(array_map('strval', is_array($resources['screenshots'] ?? null) ? $resources['screenshots'] : []))),
            ],
            'allowed_types' => self::TYPES,
            'allowed_extensions' => array_keys(self::EXTENSIONS),
        ];
    }

    public function upload(string $slug, string $type, UploadedFileInterface $upload, array $options = []): array
    {
        $type = trim($type);
        if (!in_array($type, self::TYPES, true)) {
            throw new InvalidArgumentException('Invalid media type.');
        }

        if ($upload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Uploaded media file is not available.');
        }

        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $extension = $this->validateUpload($upload);
        $relative = $this->targetRelativePath($type, $upload, $extension, $metadata, $options);
        $target = $this->resolvePackageFile($paths['package'], $relative);
        $backup = $this->writeUploadAtomically($upload, $target, $extension);

        $updated = $metadata;
        if (!isset($updated['resources']) || !is_array($updated['resources'])) {
            $updated['resources'] = [];
        }

        if ($type === 'cover') {
            $updated['resources']['cover'] = $relative;
        } elseif ($type === 'small-cover') {
            $updated['resources']['small_cover'] = $relative;
        } elseif ($type === 'hero') {
            if (is_array($updated['resources']['hero'] ?? null)) {
                $updated['resources']['hero']['path'] = $relative;
            } else {
                $updated['resources']['hero'] = $relative;
            }
        } else {
            $screenshots = $updated['resources']['screenshots'] ?? [];
            if (!is_array($screenshots)) {
                $screenshots = [];
            }
            $screenshots = array_values(array_unique(array_merge(array_map('strval', $screenshots), [$relative])));
            $updated['resources']['screenshots'] = $screenshots;
        }

        $yamlBackup = $this->writeYamlAtomically($paths['yaml'], $updated);
        $result = $this->media($paths['slug']);
        $result['uploaded'] = [
            'type' => $type,
            'relative_path' => $relative,
            'filename' => basename($relative),
            'extension' => $extension,
            'backup' => $backup,
            'metadata_backup' => $yamlBackup,
        ];

        return $result;
    }

    public function updateScreenshots(string $slug, array $screenshots): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $current = $this->screenshotList($metadata);
        $currentLookup = array_fill_keys($current, true);
        $updatedScreenshots = [];

        foreach ($screenshots as $path) {
            $path = $this->normalizeRelativePath((string) $path);
            if (!isset($currentLookup[$path])) {
                throw new InvalidArgumentException('Screenshot entry is not currently registered: ' . $path);
            }
            $this->assertMediaExtension($path);
            if (!in_array($path, $updatedScreenshots, true)) {
                $updatedScreenshots[] = $path;
            }
        }

        $updated = $metadata;
        if (!isset($updated['resources']) || !is_array($updated['resources'])) {
            $updated['resources'] = [];
        }
        $updated['resources']['screenshots'] = $updatedScreenshots;

        $backup = $this->writeYamlAtomically($paths['yaml'], $updated);
        $result = $this->media($paths['slug']);
        $result['metadata_backup'] = $backup;
        $result['updated'] = ['resources.screenshots'];

        return $result;
    }

    private function validateUpload(UploadedFileInterface $upload): string
    {
        $clientName = (string) $upload->getClientFilename();
        $extension = strtolower(pathinfo($clientName, PATHINFO_EXTENSION));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        if (!array_key_exists($extension, self::EXTENSIONS)) {
            throw new InvalidArgumentException('Only jpg, jpeg, png, webp, and gif images can be uploaded.');
        }

        $clientType = strtolower((string) $upload->getClientMediaType());
        if ($clientType !== '' && $clientType !== self::EXTENSIONS[$extension]) {
            throw new InvalidArgumentException('Uploaded media content type does not match the file extension.');
        }

        return $extension;
    }

    private function targetRelativePath(string $type, UploadedFileInterface $upload, string $extension, array $metadata, array $options): string
    {
        if ($type === 'cover') {
            return 'cover.' . $extension;
        }

        if ($type === 'small-cover') {
            return 'small-cover.' . $extension;
        }

        if ($type === 'hero') {
            return 'hero.' . $extension;
        }

        $replacePath = $this->replacementScreenshotPath($metadata, $options);
        if ($replacePath !== '') {
            $this->assertMediaExtension($replacePath);
            $replaceExtension = strtolower(pathinfo($replacePath, PATHINFO_EXTENSION));
            if ($replaceExtension === 'jpeg') {
                $replaceExtension = 'jpg';
            }
            if ($replaceExtension !== $extension) {
                throw new InvalidArgumentException('Replacement screenshot must use the same image extension as the existing screenshot entry.');
            }
            return $replacePath;
        }

        $name = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_FILENAME));
        $name = preg_replace('/[^a-z0-9_-]+/', '-', $name) ?: '';
        $name = trim($name, '-_');
        if ($name === '') {
            $name = 'screenshot-' . date('Ymd-His');
        }

        return 'screenshots/' . $name . '.' . $extension;
    }

    private function replacementScreenshotPath(array $metadata, array $options): string
    {
        $screenshots = $this->screenshotList($metadata);
        if (!$screenshots) {
            return '';
        }

        if (isset($options['replace_path'])) {
            $path = $this->normalizeRelativePath((string) $options['replace_path']);
            if (!in_array($path, $screenshots, true)) {
                throw new InvalidArgumentException('Replacement screenshot path is not registered in resources.screenshots.');
            }
            return $path;
        }

        if (isset($options['replace_index']) && $options['replace_index'] !== '') {
            $index = filter_var($options['replace_index'], FILTER_VALIDATE_INT);
            if ($index === false || !array_key_exists($index, $screenshots)) {
                throw new InvalidArgumentException('Replacement screenshot index is not registered in resources.screenshots.');
            }
            return $screenshots[$index];
        }

        return '';
    }

    private function screenshotList(array $metadata): array
    {
        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];
        $screenshots = is_array($resources['screenshots'] ?? null) ? $resources['screenshots'] : [];
        $normalized = [];
        foreach ($screenshots as $path) {
            $path = $this->normalizeRelativePath((string) $path);
            if ($path !== '' && !in_array($path, $normalized, true)) {
                $normalized[] = $path;
            }
        }

        return $normalized;
    }

    private function writeUploadAtomically(UploadedFileInterface $upload, string $target, string $extension): string
    {
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create media directory.');
        }

        $lockPath = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.lock';
        $lock = fopen($lockPath, 'c');
        if ($lock === false) {
            throw new RuntimeException('Unable to open media lock file.');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Unable to lock media file.');
            }

            $backup = '';
            if (is_file($target)) {
                $backup = $this->backupPath($target);
                if (!copy($target, $backup)) {
                    throw new RuntimeException('Unable to create media backup.');
                }
            }

            $temp = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
            $stream = $upload->getStream();
            if ($stream->isSeekable()) {
                $stream->rewind();
            }

            if (file_put_contents($temp, (string) $stream) === false) {
                throw new RuntimeException('Unable to write media temp file.');
            }

            $this->validateImageFile($temp, $extension);

            $mode = is_file($target) ? @fileperms($target) : false;
            if ($mode !== false) {
                @chmod($temp, $mode & 0777);
            }

            if (!rename($temp, $target)) {
                @unlink($temp);
                throw new RuntimeException('Unable to replace media file.');
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

    private function validateImageFile(string $path, string $extension): void
    {
        $info = @getimagesize($path);
        if (!is_array($info) || empty($info['mime'])) {
            throw new InvalidArgumentException('Uploaded file is not a readable image.');
        }

        if ($info['mime'] !== self::EXTENSIONS[$extension]) {
            throw new InvalidArgumentException('Uploaded image data does not match the file extension.');
        }
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
        $dir = dirname($file);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create media directory.');
        }

        $dirReal = realpath($dir);
        if ($dirReal === false || !$this->isPathInside($dirReal, $package)) {
            throw new InvalidArgumentException('Media path is outside the package directory.');
        }

        $this->assertMediaExtension($file);

        return $file;
    }

    private function normalizeRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $relative)) {
            throw new InvalidArgumentException('Invalid media path.');
        }

        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid media path.');
        }

        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));
        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException('Media path cannot contain traversal segments.');
            }
        }

        return implode('/', $segments);
    }

    private function assertMediaExtension(string $path): void
    {
        if (!in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), array_keys(self::EXTENSIONS), true)) {
            throw new InvalidArgumentException('Only jpg, jpeg, png, webp, and gif images can be written.');
        }
    }

    private function resourcePath($value): string
    {
        if (is_array($value)) {
            return trim((string)($value['path'] ?? ''));
        }

        return is_string($value) ? trim($value) : '';
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
