<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;
use Symfony\Component\Yaml\Yaml as SymfonyYaml;

class PackageCreationService
{
    private const STORY_EXTENSIONS = [
        'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb',
        'ulx', 'gblorb', 'glb', 'gam', 't3', 'taf',
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

    public function create(array $fields, UploadedFileInterface $upload): array
    {
        $slug = $this->slug((string)($fields['slug'] ?? ''));
        $title = trim((string)($fields['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('Title is required.');
        }
        if ($upload->getError() !== UPLOAD_ERR_OK) {
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

            $storyFile = $this->storyFilename($upload);
            $this->writeUploadAtomically($upload, $packageReal . DIRECTORY_SEPARATOR . $storyFile);

            $manifest = $this->manifest($slug, $storyFile, $fields);
            $this->writeTextAtomically($packageReal . DIRECTORY_SEPARATOR . 'game.yaml', $this->dumpYaml($manifest));
            $this->writeTextAtomically($packageReal . DIRECTORY_SEPARATOR . 'how-to-play.md', "# How to Play\n\nAdd package-specific parser commands and play notes here.\n");
            $this->writeTextAtomically($packageReal . DIRECTORY_SEPARATOR . 'hints.md', "# Hints\n\nAdd spoiler-safe hints here. Start broad, then reveal more specific help in later sections.\n");
            $this->writeTextAtomically($packageReal . DIRECTORY_SEPARATOR . 'walkthrough.md', "# Walkthrough\n\nWalkthrough not yet written. Add a complete solution path when ready.\n");

            return [
                'slug' => $slug,
                'package_path' => $packageReal,
                'story_file' => $storyFile,
                'metadata' => $manifest,
            ];
        } catch (\Throwable $e) {
            $this->cleanupCreated();
            throw $e;
        }
    }

    private function manifest(string $slug, string $storyFile, array $fields): array
    {
        return [
            'id' => $slug,
            'slug' => $slug,
            'identification' => [
                'format' => trim((string)($fields['format'] ?? '')),
                'ifids' => [],
            ],
            'bibliographic' => [
                'title' => trim((string)($fields['title'] ?? '')),
                'author' => trim((string)($fields['author'] ?? '')),
                'headline' => trim((string)($fields['headline'] ?? '')),
                'first_published' => trim((string)($fields['first_published'] ?? '')),
                'genre' => trim((string)($fields['genre'] ?? '')),
                'language' => trim((string)($fields['language'] ?? '')),
                'description' => trim((string)($fields['description'] ?? '')),
            ],
            'resources' => [
                'story_file' => $storyFile,
                'screenshots' => [],
                'how_to_play' => 'how-to-play.md',
                'hints' => 'hints.md',
                'walkthrough' => 'walkthrough.md',
            ],
            'catalog' => [
                'ifdb' => ['tuid' => '', 'url' => ''],
                'ifwiki' => ['url' => ''],
                'ifarchive' => ['path' => '', 'url' => ''],
            ],
            'release' => [
                'license' => [
                    'name' => trim((string)($fields['license_name'] ?? '')),
                    'url' => trim((string)($fields['license_url'] ?? '')),
                    'notes' => trim((string)($fields['license_notes'] ?? '')),
                ],
                'source' => [
                    'url' => trim((string)($fields['source_url'] ?? '')),
                    'retrieved' => date('Y-m-d'),
                    'notes' => trim((string)($fields['source_notes'] ?? '')),
                ],
            ],
            'terpvault' => [
                'status' => $this->status((string)($fields['status'] ?? 'draft')),
                'featured' => false,
                'tags' => $this->tags($fields['tags'] ?? ''),
            ],
            'player' => [
                'engine' => 'parchment',
            ],
        ];
    }

    private function slug(string $slug): string
    {
        $slug = trim($slug);
        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }

        return $slug;
    }

    private function status(string $status): string
    {
        $status = strtolower(trim($status));
        if (!in_array($status, ['draft', 'published'], true)) {
            return 'draft';
        }

        return $status;
    }

    private function tags($value): array
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

    private function storyFilename(UploadedFileInterface $upload): string
    {
        $clientName = (string) $upload->getClientFilename();
        $extension = strtolower(pathinfo($clientName, PATHINFO_EXTENSION));
        if (!in_array($extension, self::STORY_EXTENSIONS, true)) {
            throw new InvalidArgumentException('Unsupported story file extension.');
        }

        $name = strtolower(pathinfo($clientName, PATHINFO_FILENAME));
        $name = preg_replace('/[^a-z0-9_-]+/', '-', $name) ?: '';
        $name = trim($name, '-_') ?: 'story';

        return $name . '.' . $extension;
    }

    private function writeUploadAtomically(UploadedFileInterface $upload, string $target): void
    {
        $temp = dirname($target) . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
        $stream = $upload->getStream();
        if ($stream->isSeekable()) {
            $stream->rewind();
        }

        if (file_put_contents($temp, (string) $stream) === false) {
            throw new RuntimeException('Unable to write uploaded story file.');
        }
        $this->created[] = $temp;
        if (!rename($temp, $target)) {
            throw new RuntimeException('Unable to move uploaded story file into package.');
        }
        $this->created[] = $target;
    }

    private function writeTextAtomically(string $target, string $content): void
    {
        $temp = dirname($target) . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
        if (file_put_contents($temp, $content) === false) {
            throw new RuntimeException('Unable to write package file.');
        }
        $this->created[] = $temp;
        if (!rename($temp, $target)) {
            throw new RuntimeException('Unable to move package file into place.');
        }
        $this->created[] = $target;
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
            } elseif (is_dir($path)) {
                @rmdir($path);
            }
        }
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
