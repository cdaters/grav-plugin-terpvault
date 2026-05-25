<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;

class PackageFeeliesService
{
    private const EXTENSIONS = [
        'pdf' => 'application/pdf',
        'txt' => 'text/plain',
        'md' => 'text/markdown',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'mp3' => 'audio/mpeg',
        'ogg' => 'audio/ogg',
        'wav' => 'audio/wav',
        'm4a' => 'audio/mp4',
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

    public function feelies(string $slug): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);

        return [
            'slug' => $paths['slug'],
            'package_path' => $paths['package'],
            'feelies' => $this->feelieList($metadata, $paths['package'], $paths['slug']),
            'allowed_extensions' => array_keys(self::EXTENSIONS),
            'remove_note' => 'Removing a feelie from the manifest does not delete the physical file.',
        ];
    }

    public function updateFeelies(string $slug, array $feelies): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $updatedFeelies = [];

        foreach ($feelies as $item) {
            if (!is_array($item)) {
                throw new InvalidArgumentException('Each feelie entry must be an object.');
            }

            $path = $this->validatedRelativePath((string)($item['path'] ?? ''));
            $updatedFeelies[] = [
                'title' => $this->cleanText((string)($item['title'] ?? '')),
                'path' => $path,
                'type' => $this->cleanText((string)($item['type'] ?? '')),
                'description' => $this->cleanText((string)($item['description'] ?? '')),
            ];
        }

        if (!isset($metadata['resources']) || !is_array($metadata['resources'])) {
            $metadata['resources'] = [];
        }
        $metadata['resources']['feelies'] = $updatedFeelies;

        $backup = $this->writeYamlAtomically($paths['yaml'], $metadata);
        $result = $this->feelies($paths['slug']);
        $result['metadata_backup'] = $backup;
        $result['updated'] = ['resources.feelies'];

        return $result;
    }

    public function upload(string $slug, UploadedFileInterface $upload, array $fields = []): array
    {
        if ($upload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Uploaded feelie file is not available.');
        }

        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $extension = $this->validateUpload($upload);
        $relative = $this->nextUploadPath($paths['package'], $upload, $extension);
        $target = $this->resolvePackageFile($paths['package'], $relative);
        $backup = $this->writeUploadAtomically($upload, $target, $extension);

        if (!isset($metadata['resources']) || !is_array($metadata['resources'])) {
            $metadata['resources'] = [];
        }
        if (!isset($metadata['resources']['feelies']) || !is_array($metadata['resources']['feelies'])) {
            $metadata['resources']['feelies'] = [];
        }

        $metadata['resources']['feelies'][] = [
            'title' => $this->cleanText((string)($fields['title'] ?? '')) ?: $this->titleFromFilename($relative),
            'path' => $relative,
            'type' => $this->cleanText((string)($fields['type'] ?? '')) ?: $this->typeFromExtension($extension),
            'description' => $this->cleanText((string)($fields['description'] ?? '')),
        ];

        $yamlBackup = $this->writeYamlAtomically($paths['yaml'], $metadata);
        $result = $this->feelies($paths['slug']);
        $result['uploaded'] = [
            'relative_path' => $relative,
            'filename' => basename($relative),
            'extension' => $extension,
            'backup' => $backup,
            'metadata_backup' => $yamlBackup,
        ];

        return $result;
    }

    private function feelieList(array $metadata, string $package, string $slug): array
    {
        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];
        $feelies = is_array($resources['feelies'] ?? null) ? $resources['feelies'] : [];
        $items = [];

        foreach ($feelies as $index => $item) {
            $data = is_array($item) ? $item : ['path' => (string) $item];
            $path = trim((string)($data['path'] ?? ''));
            $error = '';
            $exists = false;
            $url = '';
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

            try {
                $safePath = $this->validatedRelativePath($path);
                $file = $package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $safePath);
                $exists = is_file($file);
                $path = $safePath;
                if ($exists) {
                    $url = $this->assetUrl($slug, $path);
                }
            } catch (InvalidArgumentException $e) {
                $error = $e->getMessage();
            }

            $items[] = [
                'index' => $index,
                'title' => $this->cleanText((string)($data['title'] ?? '')) ?: ($path !== '' ? basename(str_replace('\\', '/', $path)) : 'Untitled feelie'),
                'path' => $path,
                'type' => $this->cleanText((string)($data['type'] ?? $data['category'] ?? '')),
                'description' => $this->cleanText((string)($data['description'] ?? '')),
                'extension' => $extension,
                'exists' => $exists,
                'url' => $url,
                'valid' => $error === '',
                'error' => $error,
            ];
        }

        return $items;
    }

    private function validateUpload(UploadedFileInterface $upload): string
    {
        $clientName = (string) $upload->getClientFilename();
        $extension = strtolower(pathinfo($clientName, PATHINFO_EXTENSION));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        if (!array_key_exists($extension, self::EXTENSIONS)) {
            throw new InvalidArgumentException('Only pdf, txt, md, jpg, jpeg, png, webp, gif, mp3, ogg, wav, and m4a feelies can be uploaded.');
        }

        return $extension;
    }

    private function nextUploadPath(string $package, UploadedFileInterface $upload, string $extension): string
    {
        $name = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_FILENAME));
        $name = preg_replace('/[^a-z0-9_-]+/', '-', $name) ?: '';
        $name = trim($name, '-_');
        if ($name === '') {
            $name = 'feelie-' . date('Ymd-His');
        }

        $candidate = 'feelies/' . $name . '.' . $extension;
        $index = 1;
        while (is_file($package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $candidate))) {
            $candidate = 'feelies/' . $name . '-' . $index . '.' . $extension;
            $index++;
        }

        return $candidate;
    }

    private function writeUploadAtomically(UploadedFileInterface $upload, string $target, string $extension): string
    {
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create feelies directory.');
        }

        $lockPath = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.lock';
        $lock = fopen($lockPath, 'c');
        if ($lock === false) {
            throw new RuntimeException('Unable to open feelie lock file.');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Unable to lock feelie file.');
            }

            $backup = '';
            if (is_file($target)) {
                $backup = $this->backupPath($target);
                if (!copy($target, $backup)) {
                    throw new RuntimeException('Unable to create feelie backup.');
                }
            }

            $temp = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
            $stream = $upload->getStream();
            if ($stream->isSeekable()) {
                $stream->rewind();
            }

            if (file_put_contents($temp, (string) $stream) === false) {
                throw new RuntimeException('Unable to write feelie temp file.');
            }

            $this->validateWrittenFile($temp, $extension);

            $mode = is_file($target) ? @fileperms($target) : false;
            if ($mode !== false) {
                @chmod($temp, $mode & 0777);
            }

            if (!rename($temp, $target)) {
                @unlink($temp);
                throw new RuntimeException('Unable to replace feelie file.');
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

    private function validateWrittenFile(string $path, string $extension): void
    {
        if (in_array($extension, ['jpg', 'png', 'webp', 'gif'], true)) {
            $info = @getimagesize($path);
            if (!is_array($info) || empty($info['mime']) || $info['mime'] !== self::EXTENSIONS[$extension]) {
                throw new InvalidArgumentException('Uploaded image data does not match the feelie file extension.');
            }
            return;
        }

        if ($extension === 'pdf') {
            $handle = fopen($path, 'rb');
            $header = $handle ? fread($handle, 5) : '';
            if ($handle) {
                fclose($handle);
            }
            if ($header !== '%PDF-') {
                throw new InvalidArgumentException('Uploaded PDF data does not match the feelie file extension.');
            }
        }
    }

    private function resolvePackageFile(string $package, string $relative): string
    {
        $relative = $this->validatedRelativePath($relative);
        $file = $package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        $dir = dirname($file);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create feelies directory.');
        }

        $dirReal = realpath($dir);
        if ($dirReal === false || !$this->isPathInside($dirReal, $package)) {
            throw new InvalidArgumentException('Feelie path is outside the package directory.');
        }

        return $file;
    }

    private function validatedRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*:#i', $relative)) {
            throw new InvalidArgumentException('Invalid feelie path.');
        }

        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid feelie path.');
        }

        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));
        foreach ($segments as $segment) {
            $lower = strtolower($segment);
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException('Feelie path cannot contain traversal segments.');
            }
            if ($segment[0] === '.' || in_array($lower, ['__macosx', 'thumbs.db', 'desktop.ini'], true)) {
                throw new InvalidArgumentException('Feelie path cannot reference hidden or system files.');
            }
        }

        $path = implode('/', $segments);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }
        if (!array_key_exists($extension, self::EXTENSIONS)) {
            throw new InvalidArgumentException('resources.feelies must reference pdf, txt, md, image, or audio files. SVG is not allowed.');
        }

        return $path;
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

    private function assetUrl(string $slug, string $relative): string
    {
        $route = '/' . trim((string)($this->config['route'] ?? '/if'), '/');
        return $route . '/_asset/' . rawurlencode($slug) . '/' . str_replace('%2F', '/', rawurlencode($relative));
    }

    private function cleanText(string $value): string
    {
        return trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]+/', '', $value) ?: '');
    }

    private function titleFromFilename(string $relative): string
    {
        $name = pathinfo($relative, PATHINFO_FILENAME);
        $name = trim(str_replace(['-', '_'], ' ', $name));
        return $name !== '' ? ucwords($name) : basename($relative);
    }

    private function typeFromExtension(string $extension): string
    {
        if ($extension === 'pdf' || $extension === 'txt' || $extension === 'md') {
            return 'document';
        }
        if (in_array($extension, ['jpg', 'png', 'webp', 'gif'], true)) {
            return 'image';
        }
        if (in_array($extension, ['mp3', 'ogg', 'wav', 'm4a'], true)) {
            return 'audio';
        }

        return 'other';
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
