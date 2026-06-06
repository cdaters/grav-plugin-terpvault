<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use DOMDocument;
use Grav\Common\Grav;
use Grav\Common\Yaml;
use Grav\Plugin\TerpVault\GameRepository;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;
use Symfony\Component\Yaml\Yaml as SymfonyYaml;

class PackageCreationService
{
    private const STORY_EXTENSIONS = [
        'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb',
        'ulx', 'gblorb', 'glb', 'blorb', 'hex', 'gam', 't3', 'taf',
    ];

    private const IMAGE_EXTENSIONS = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
    ];

    private const FEELIE_EXTENSIONS = [
        'pdf', 'txt', 'md', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'ogg', 'wav', 'm4a',
    ];

    private const MARKDOWN_RESOURCES = [
        'how_to_play' => 'how-to-play.md',
        'hints' => 'hints.md',
        'walkthrough' => 'walkthrough.md',
        'known_differences' => 'known-differences.md',
        'provenance' => 'provenance.md',
    ];

    /** @var Grav */
    private $grav;

    /** @var array */
    private $config;

    /** @var string */
    private $basePath;

    /** @var array */
    private $created = [];

    public function __construct()
    {
        $this->grav = Grav::instance();
        $this->config = (array) $this->grav['config']->get('plugins.terpvault', []);

        $stream = (string)($this->config['storage']['games_path'] ?? 'user://data/terpvault/games');
        $this->basePath = $this->grav['locator']->findResource($stream, true, true) ?: '';
    }

    public function create(array $fields, UploadedFileInterface $storyUpload, array $uploads = []): array
    {
        $slug = $this->slug((string)($fields['slug'] ?? ''));
        $title = trim((string)($fields['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('Title is required.');
        }
        if ($storyUpload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Initial story file is required.');
        }

        $base = $this->basePath();
        $package = $base . DIRECTORY_SEPARATOR . $slug;
        if (file_exists($package)) {
            throw new InvalidArgumentException('Package folder already exists: ' . $slug);
        }

        $this->created = [];
        try {
            if (!mkdir($package, 0775, true) && !is_dir($package)) {
                throw new RuntimeException('Unable to create package folder.');
            }
            $this->created[] = $package;

            $packageReal = realpath($package);
            if ($packageReal === false || !$this->isPathInside($packageReal, $base)) {
                throw new RuntimeException('Created package folder is outside the games directory.');
            }

            $storyFile = $this->safeFilename($storyUpload, self::STORY_EXTENSIONS, 'story');
            $storyTarget = $this->packageFilePath($packageReal, $storyFile);
            $this->writeUploadAtomically($storyUpload, $storyTarget);
            $storySha256 = hash_file('sha256', $storyTarget) ?: '';

            $manifest = $this->manifest($slug, $storyFile, $storySha256, $fields);
            $this->writeOptionalResources($packageReal, $manifest, $uploads);
            $this->writeTextAtomically($packageReal . DIRECTORY_SEPARATOR . 'game.yaml', $this->dumpYaml($manifest));

            $validation = $this->validateReadback($slug);
            if (!$validation['ok']) {
                throw new RuntimeException('Generated package validation failed: ' . implode('; ', $validation['fatal_errors']));
            }

            return [
                'slug' => $slug,
                'package_path' => $packageReal,
                'story_file' => $storyFile,
                'story_sha256' => $storySha256,
                'metadata' => $manifest,
                'validation' => $validation,
                'draft_forced' => true,
                'featured_forced_false' => true,
                'has_ifiction' => is_file($packageReal . DIRECTORY_SEPARATOR . 'metadata.iFiction.xml'),
            ];
        } catch (\Throwable $e) {
            $this->cleanupCreated();
            throw $e;
        }
    }

    private function manifest(string $slug, string $storyFile, string $storySha256, array $fields): array
    {
        return [
            'id' => $slug,
            'slug' => $slug,
            'identification' => [
                'format' => $this->format((string)($fields['format'] ?? ''), $storyFile),
                'ifids' => $this->listField($fields['ifid'] ?? $fields['ifids'] ?? ''),
            ],
            'bibliographic' => [
                'title' => trim((string)($fields['title'] ?? '')),
                'author' => trim((string)($fields['author'] ?? '')),
                'headline' => trim((string)($fields['headline'] ?? '')),
                'first_published' => trim((string)($fields['first_published'] ?? '')),
                'genre' => trim((string)($fields['genre'] ?? '')),
                'language' => trim((string)($fields['language'] ?? 'en')) ?: 'en',
                'description' => trim((string)($fields['description'] ?? '')),
            ],
            'resources' => [
                'story_file' => $storyFile,
                'story_sha256' => $storySha256,
                'screenshots' => [],
            ],
            'catalog' => [
                'ifdb' => ['tuid' => '', 'url' => ''],
                'ifwiki' => ['url' => ''],
                'ifarchive' => ['path' => '', 'url' => ''],
            ],
            'release' => [
                'license' => [
                    'name' => trim((string)($fields['license_name'] ?? 'Verify before redistribution')),
                    'url' => trim((string)($fields['license_url'] ?? '')),
                    'notes' => trim((string)($fields['license_notes'] ?? '')),
                ],
                'source' => [
                    'url' => trim((string)($fields['source_url'] ?? '')),
                    'retrieved' => date('Y-m-d'),
                    'notes' => trim((string)($fields['source_notes'] ?? '')),
                ],
            ],
            'tags' => $this->listField($fields['tags'] ?? ''),
            'terpvault' => [
                'status' => 'draft',
                'featured' => false,
                'tags' => [],
            ],
            'player' => [
                'engine' => 'parchment',
            ],
        ];
    }

    private function writeOptionalResources(string $package, array &$manifest, array $uploads): void
    {
        foreach (self::MARKDOWN_RESOURCES as $key => $relative) {
            $upload = $this->uploadedFile($uploads, $key);
            if (!$this->isPresentUpload($upload)) {
                continue;
            }
            $this->assertClientExtension($upload, ['md'], $relative . ' must be a Markdown file.');
            $target = $this->packageFilePath($package, $relative);
            $this->writeUploadAtomically($upload, $target);
            if ($key === 'provenance') {
                continue;
            }
            $manifest['resources'][$key] = $relative;
        }

        foreach (['cover' => 'cover', 'small_cover' => 'small-cover', 'hero' => 'hero'] as $key => $basename) {
            $upload = $this->uploadedFile($uploads, $key);
            if (!$this->isPresentUpload($upload)) {
                continue;
            }
            $extension = $this->imageExtension($upload);
            $relative = $basename . '.' . ($extension === 'jpeg' ? 'jpg' : $extension);
            $target = $this->packageFilePath($package, $relative);
            $this->writeUploadAtomically($upload, $target);
            $this->validateImage($target, $extension);
            $manifest['resources'][$key] = $relative;
        }

        $screenshots = [];
        foreach ($this->uploadedFiles($uploads, 'screenshots') as $index => $upload) {
            if (!$this->isPresentUpload($upload)) {
                continue;
            }
            $extension = $this->imageExtension($upload);
            $relative = $this->uniqueRelativePath($package, 'screenshots/' . $this->safeStem($upload, 'screenshot-' . ($index + 1)) . '.' . ($extension === 'jpeg' ? 'jpg' : $extension));
            $target = $this->packageFilePath($package, $relative);
            $this->writeUploadAtomically($upload, $target);
            $this->validateImage($target, $extension);
            $screenshots[] = $relative;
        }
        if ($screenshots) {
            $manifest['resources']['screenshots'] = $screenshots;
        }

        $feelies = [];
        foreach ($this->uploadedFiles($uploads, 'feelies') as $upload) {
            if (!$this->isPresentUpload($upload)) {
                continue;
            }
            $extension = $this->feelieExtension($upload);
            $relative = $this->uniqueRelativePath($package, 'feelies/' . $this->safeStem($upload, 'feelie') . '.' . $extension);
            $target = $this->packageFilePath($package, $relative);
            $this->writeUploadAtomically($upload, $target);
            $this->validateFeelie($target, $extension);
            $feelies[] = [
                'title' => $this->titleFromPath($relative),
                'path' => $relative,
                'type' => $this->typeFromExtension($extension),
                'description' => '',
            ];
        }
        if ($feelies) {
            $manifest['resources']['feelies'] = $feelies;
        }

        $ifiction = $this->uploadedFile($uploads, 'ifiction');
        if ($this->isPresentUpload($ifiction)) {
            $this->assertClientExtension($ifiction, ['xml'], 'metadata.iFiction.xml upload must be an XML file.');
            $xml = $this->uploadContents($ifiction);
            $this->validateIFictionXml($xml);
            $this->writeTextAtomically($package . DIRECTORY_SEPARATOR . 'metadata.iFiction.xml', $xml);
        }
    }

    private function validateReadback(string $slug): array
    {
        $repository = new GameRepository($this->grav, $this->config);
        $game = $repository->find($slug, true);
        if (!$game) {
            return [
                'ok' => false,
                'fatal_errors' => ['Package could not be read back from the repository.'],
                'warnings' => [],
            ];
        }

        $warnings = $game->warnings();
        $fatal = array_values(array_map(static function (array $warning): string {
            return (string)($warning['message'] ?? $warning['label'] ?? $warning['code'] ?? 'Package validation error.');
        }, array_filter($warnings, static function (array $warning): bool {
            return ($warning['severity'] ?? '') === 'error';
        })));

        return [
            'ok' => count($fatal) === 0,
            'fatal_errors' => $fatal,
            'warnings' => array_values(array_filter($warnings, static function (array $warning): bool {
                return ($warning['severity'] ?? 'warning') !== 'error';
            })),
            'error_count' => count($fatal),
            'warning_count' => count($warnings) - count($fatal),
        ];
    }

    private function slug(string $slug): string
    {
        $slug = trim($slug);
        if (strpos($slug, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*:#i', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }
        if ($slug === '' || $slug[0] === '/' || strpos($slug, '/') !== false || strpos($slug, '\\') !== false || preg_match('/^[A-Za-z]:[\/\\\\]/', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }
        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }

        return $slug;
    }

    private function format(string $format, string $storyFile): string
    {
        $format = $this->normalizeFormat($format);
        if ($format !== '') {
            return $format;
        }

        return $this->normalizeFormat(strtolower(pathinfo($storyFile, PATHINFO_EXTENSION)));
    }

    private function normalizeFormat(string $format): string
    {
        $format = strtolower(trim(str_replace(['_', ' '], '-', $format)));
        if (in_array($format, ['zcode', 'z-code', 'z-machine', 'zmachine', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb'], true)) {
            return 'zcode';
        }
        if (in_array($format, ['glulx', 'ulx', 'gblorb', 'glb', 'blorb'], true)) {
            return 'glulx';
        }
        if (in_array($format, ['tads2', 'tads-2', 'tadsii', 'tads-ii', 'gam'], true)) {
            return 'tads2';
        }
        if (in_array($format, ['tads3', 'tads-3', 'tadsiii', 'tads-iii', 't3'], true)) {
            return 'tads3';
        }
        if ($format === 'hex') {
            return 'hugo';
        }
        if ($format === 'taf') {
            return 'adrift';
        }
        if (in_array($format, ['tads', 'hugo', 'adrift'], true)) {
            return $format;
        }

        return '';
    }

    private function listField($value): array
    {
        if (is_string($value)) {
            $value = preg_split('/[\r\n,]+/', $value) ?: [];
        }
        if (!is_array($value)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map(static function ($item): string {
            return trim((string) $item);
        }, $value), static function (string $item): bool {
            return $item !== '';
        })));
    }

    private function safeFilename(UploadedFileInterface $upload, array $extensions, string $fallback): string
    {
        $this->assertClientExtension($upload, $extensions, 'Unsupported story file extension.');
        return $this->safeStem($upload, $fallback) . '.' . strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_EXTENSION));
    }

    private function safeStem(UploadedFileInterface $upload, string $fallback): string
    {
        $name = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_FILENAME));
        $name = preg_replace('/[^a-z0-9_-]+/', '-', $name) ?: '';
        return trim($name, '-_') ?: $fallback;
    }

    private function assertClientExtension(UploadedFileInterface $upload, array $extensions, string $message): void
    {
        $extension = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_EXTENSION));
        if (!in_array($extension, $extensions, true)) {
            throw new InvalidArgumentException($message);
        }
    }

    private function imageExtension(UploadedFileInterface $upload): string
    {
        $extension = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_EXTENSION));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }
        if (!array_key_exists($extension, self::IMAGE_EXTENSIONS)) {
            throw new InvalidArgumentException('Only jpg, jpeg, png, webp, and gif images can be uploaded.');
        }
        return $extension;
    }

    private function feelieExtension(UploadedFileInterface $upload): string
    {
        $extension = strtolower(pathinfo((string) $upload->getClientFilename(), PATHINFO_EXTENSION));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }
        if (!in_array($extension, self::FEELIE_EXTENSIONS, true)) {
            throw new InvalidArgumentException('Only pdf, txt, md, jpg, jpeg, png, webp, gif, mp3, ogg, wav, and m4a feelies can be uploaded.');
        }
        return $extension;
    }

    private function packageFilePath(string $package, string $relative): string
    {
        $relative = $this->normalizeRelativePath($relative);
        $target = $package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create package resource directory.');
        }

        $dirReal = realpath($dir);
        if ($dirReal === false || !$this->isPathInside($dirReal, $package)) {
            throw new InvalidArgumentException('Package resource path is outside the package directory.');
        }

        return $target;
    }

    private function normalizeRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*:#i', $relative)) {
            throw new InvalidArgumentException('Invalid package resource path.');
        }
        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/') {
            throw new InvalidArgumentException('Invalid package resource path.');
        }
        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));
        foreach ($segments as $segment) {
            $lower = strtolower($segment);
            if ($segment === '.' || $segment === '..' || $segment[0] === '.' || in_array($lower, ['__macosx', 'thumbs.db', 'desktop.ini'], true)) {
                throw new InvalidArgumentException('Package resource path cannot contain hidden, system, or traversal segments.');
            }
        }

        return implode('/', $segments);
    }

    private function uniqueRelativePath(string $package, string $relative): string
    {
        $relative = $this->normalizeRelativePath($relative);
        $dir = trim(dirname($relative), '.');
        $stem = pathinfo($relative, PATHINFO_FILENAME);
        $extension = strtolower(pathinfo($relative, PATHINFO_EXTENSION));
        $candidate = $relative;
        $index = 1;
        while (is_file($package . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $candidate))) {
            $candidate = ($dir !== '' ? $dir . '/' : '') . $stem . '-' . $index . '.' . $extension;
            $index++;
        }

        return $candidate;
    }

    private function writeUploadAtomically(UploadedFileInterface $upload, string $target): void
    {
        if ($upload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Uploaded package resource is not available.');
        }

        $this->writeTextAtomically($target, $this->uploadContents($upload));
    }

    private function uploadContents(UploadedFileInterface $upload): string
    {
        $stream = $upload->getStream();
        if ($stream->isSeekable()) {
            $stream->rewind();
        }
        return (string) $stream;
    }

    private function writeTextAtomically(string $target, string $content): void
    {
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create package resource directory.');
        }
        $temp = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
        if (file_put_contents($temp, $content) === false) {
            throw new RuntimeException('Unable to write package file.');
        }
        $this->created[] = $temp;
        if (!rename($temp, $target)) {
            throw new RuntimeException('Unable to move package file into place.');
        }
        $this->created[] = $target;
    }

    private function validateImage(string $path, string $extension): void
    {
        $info = @getimagesize($path);
        if (!is_array($info) || empty($info['mime']) || $info['mime'] !== self::IMAGE_EXTENSIONS[$extension]) {
            throw new InvalidArgumentException('Uploaded image data does not match the file extension.');
        }
    }

    private function validateFeelie(string $path, string $extension): void
    {
        if (in_array($extension, ['jpg', 'png', 'webp', 'gif'], true)) {
            $this->validateImage($path, $extension);
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

    private function validateIFictionXml(string $xml): void
    {
        if (trim($xml) === '') {
            throw new InvalidArgumentException('metadata.iFiction.xml upload is empty.');
        }
        if (strlen($xml) > 524288) {
            throw new InvalidArgumentException('metadata.iFiction.xml upload is too large.');
        }
        if (stripos($xml, '<!DOCTYPE') !== false) {
            throw new InvalidArgumentException('metadata.iFiction.xml contains a DOCTYPE declaration and was not saved.');
        }
        if (!class_exists(DOMDocument::class)) {
            throw new RuntimeException('PHP DOM extension is required to validate iFiction XML.');
        }

        $previous = libxml_use_internal_errors(true);
        libxml_clear_errors();
        $document = new DOMDocument();
        $document->substituteEntities = false;
        $loaded = $document->loadXML($xml, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOCDATA);
        $errors = libxml_get_errors();
        libxml_clear_errors();
        libxml_use_internal_errors($previous);
        if (!$loaded || $document->documentElement === null) {
            $message = 'Unable to parse metadata.iFiction.xml.';
            if ($errors) {
                $message .= ' ' . trim($errors[0]->message);
            }
            throw new InvalidArgumentException($message);
        }
    }

    private function uploadedFile(array $uploads, string $key): ?UploadedFileInterface
    {
        $files = $this->uploadedFiles($uploads, $key);
        return $files[0] ?? null;
    }

    /**
     * @return UploadedFileInterface[]
     */
    private function uploadedFiles(array $uploads, string $key): array
    {
        if (!array_key_exists($key, $uploads)) {
            return [];
        }
        $files = [];
        $this->collectUploadedFiles($uploads[$key], $files);
        return $files;
    }

    private function collectUploadedFiles($value, array &$files): void
    {
        if ($value instanceof UploadedFileInterface) {
            $files[] = $value;
            return;
        }
        if (!is_array($value)) {
            return;
        }
        foreach ($value as $item) {
            $this->collectUploadedFiles($item, $files);
        }
    }

    private function isPresentUpload(?UploadedFileInterface $upload): bool
    {
        return $upload instanceof UploadedFileInterface && $upload->getError() !== UPLOAD_ERR_NO_FILE;
    }

    private function titleFromPath(string $relative): string
    {
        $name = pathinfo($relative, PATHINFO_FILENAME);
        $name = trim(str_replace(['-', '_'], ' ', $name));
        return $name !== '' ? ucwords($name) : basename($relative);
    }

    private function typeFromExtension(string $extension): string
    {
        if (in_array($extension, ['pdf', 'txt', 'md'], true)) {
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

    private function basePath(): string
    {
        if ($this->basePath === '' || !is_dir($this->basePath)) {
            throw new RuntimeException('TerpVault games directory is not available.');
        }

        $base = realpath($this->basePath);
        if ($base === false) {
            throw new RuntimeException('Unable to resolve TerpVault games directory.');
        }

        return $base;
    }

    private function isPathInside(string $path, string $base): bool
    {
        $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos(rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, $base) === 0;
    }

    private function cleanupCreated(): void
    {
        foreach (array_reverse($this->created) as $path) {
            if (is_file($path)) {
                @unlink($path);
            }
        }
        foreach (array_reverse($this->created) as $path) {
            if (is_dir($path)) {
                $this->removeDirectory($path);
            }
        }
    }

    private function removeDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST) as $fileinfo) {
            if ($fileinfo->isDir()) {
                @rmdir($fileinfo->getPathname());
            } else {
                @unlink($fileinfo->getPathname());
            }
        }
        @rmdir($dir);
    }

    private function dumpYaml(array $data): string
    {
        if (class_exists(SymfonyYaml::class)) {
            $flags = defined(SymfonyYaml::class . '::DUMP_EMPTY_ARRAY_AS_SEQUENCE') ? SymfonyYaml::DUMP_EMPTY_ARRAY_AS_SEQUENCE : 0;
            return rtrim((string) SymfonyYaml::dump($data, 10, 2, $flags)) . "\n";
        }

        if (method_exists(Yaml::class, 'dump')) {
            return rtrim((string) Yaml::dump($data, 10, 2)) . "\n";
        }

        throw new RuntimeException('YAML dumping is not available.');
    }
}
