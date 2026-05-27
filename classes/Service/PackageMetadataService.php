<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use RuntimeException;

class PackageMetadataService
{
    private const EDITABLE_FIELDS = [
        'bibliographic.title',
        'bibliographic.author',
        'bibliographic.headline',
        'bibliographic.first_published',
        'bibliographic.genre',
        'bibliographic.language',
        'bibliographic.description',
        'identification.format',
        'identification.ifids',
        'catalog.ifdb.tuid',
        'catalog.ifdb.url',
        'catalog.ifwiki.url',
        'catalog.ifarchive.path',
        'catalog.ifarchive.url',
        'release.license.name',
        'release.license.url',
        'release.license.notes',
        'release.source.url',
        'release.source.retrieved',
        'release.source.notes',
        'terpvault.status',
        'terpvault.featured',
        'terpvault.tags',
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

    public function metadata(string $slug): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);

        return [
            'slug' => $paths['slug'],
            'package_path' => $paths['package'],
            'game_yaml' => $paths['yaml'],
            'metadata' => $metadata,
            'editable' => $this->extractEditable($metadata),
            'editable_fields' => self::EDITABLE_FIELDS,
            'read_only_fields' => [
                'slug',
                'resources.story_file',
                'resources.cover',
                'resources.small_cover',
                'resources.hero',
                'resources.screenshots',
                'resources.feelies',
                'resources.how_to_play',
                'resources.hints',
                'resources.walkthrough',
                'player',
            ],
        ];
    }

    public function updateMetadata(string $slug, array $updates): array
    {
        $paths = $this->packagePaths($slug);
        $current = $this->loadYaml($paths['yaml']);
        $flatUpdates = $this->flattenUpdates($updates);

        if (!$flatUpdates) {
            throw new InvalidArgumentException('No metadata fields were provided.');
        }

        foreach (array_keys($flatUpdates) as $field) {
            if (!in_array($field, self::EDITABLE_FIELDS, true)) {
                throw new InvalidArgumentException('Field is not editable: ' . $field);
            }
        }

        $updated = $current;
        foreach ($flatUpdates as $field => $value) {
            $this->setNestedValue($updated, $field, $this->normalizeValue($field, $value));
        }
        $this->fillBlankFormat($updated);

        $backup = $this->writeYamlAtomically($paths['yaml'], $updated);
        $result = $this->metadata($paths['slug']);
        $result['backup'] = $backup;
        $result['updated_fields'] = array_keys($flatUpdates);

        return $result;
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

    private function extractEditable(array $metadata): array
    {
        $editable = [];
        foreach (self::EDITABLE_FIELDS as $field) {
            $value = $this->getNestedValue($metadata, $field);
            if ($value !== null) {
                $this->setNestedValue($editable, $field, $value);
            }
        }

        return $editable;
    }

    private function flattenUpdates(array $updates, string $prefix = ''): array
    {
        $flat = [];
        foreach ($updates as $key => $value) {
            $key = trim((string) $key);
            if ($key === '') {
                continue;
            }

            $path = $prefix === '' ? $key : $prefix . '.' . $key;
            if (in_array($path, ['identification.ifids', 'terpvault.tags'], true)) {
                $flat[$path] = $value;
                continue;
            }

            if (is_array($value)) {
                $flat += $this->flattenUpdates($value, $path);
                continue;
            }

            $flat[$path] = $value;
        }

        return $flat;
    }

    private function normalizeValue(string $field, $value)
    {
        if ($field === 'identification.ifids' || $field === 'terpvault.tags') {
            return $this->normalizeList($value);
        }

        if ($field === 'terpvault.featured') {
            if (is_bool($value)) {
                return $value;
            }
            if (is_string($value)) {
                return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on'], true);
            }
            return (bool) $value;
        }

        if ($field === 'terpvault.status') {
            $status = strtolower(trim((string) $value));
            if (!in_array($status, ['draft', 'published'], true)) {
                throw new InvalidArgumentException('Invalid TerpVault status. Use draft or published.');
            }
            return $status;
        }

        if ($field === 'identification.format') {
            return strtolower(trim((string) $value));
        }

        return is_scalar($value) || $value === null ? (string) ($value ?? '') : '';
    }

    private function fillBlankFormat(array &$metadata): void
    {
        if (!isset($metadata['identification']) || !is_array($metadata['identification'])) {
            $metadata['identification'] = [];
        }
        if (trim((string)($metadata['identification']['format'] ?? '')) !== '') {
            return;
        }

        $format = $this->inferFormat($metadata);
        if ($format !== '') {
            $metadata['identification']['format'] = $format;
        }
    }

    private function inferFormat(array $metadata): string
    {
        $ifids = $metadata['identification']['ifids'] ?? [];
        $ifids = is_array($ifids) ? $ifids : [$ifids];
        $ifidFormat = $this->formatFromIfids($ifids);
        if ($ifidFormat !== '') {
            return $ifidFormat;
        }

        $storyFile = (string)($metadata['resources']['story_file'] ?? $metadata['story_file'] ?? '');
        $storyFormat = $this->normalizeFormatToken(strtolower(pathinfo($storyFile, PATHINFO_EXTENSION)));
        if ($storyFormat !== '') {
            return $storyFormat;
        }

        $player = is_array($metadata['player'] ?? null) ? $metadata['player'] : [];
        return $this->normalizeFormatToken((string)($player['engine'] ?? $player['runtime'] ?? ''));
    }

    private function formatFromIfids(array $ifids): string
    {
        // Treaty IFID prefixes are strong enough to fill a blank package format.
        $joined = strtoupper(implode(' ', array_map('strval', $ifids)));
        if (strpos($joined, 'TADS2-') !== false) {
            return 'tads2';
        }
        if (strpos($joined, 'TADS3-') !== false) {
            return 'tads3';
        }
        if (strpos($joined, 'ZCODE-') !== false) {
            return 'zcode';
        }
        if (strpos($joined, 'GLULX-') !== false) {
            return 'glulx';
        }

        return '';
    }

    private function normalizeFormatToken(string $format): string
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
        if (in_array($format, ['tads', 'hugo', 'adrift', 'ink'], true)) {
            return $format;
        }
        if ($format === 'hex') {
            return 'hugo';
        }
        if ($format === 'taf') {
            return 'adrift';
        }

        return '';
    }

    private function normalizeList($value): array
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

    private function getNestedValue(array $data, string $path)
    {
        $value = $data;
        foreach (explode('.', $path) as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return null;
            }
            $value = $value[$segment];
        }

        return $value;
    }

    private function setNestedValue(array &$data, string $path, $value): void
    {
        $segments = explode('.', $path);
        $last = array_pop($segments);
        $target =& $data;

        foreach ($segments as $segment) {
            if (!isset($target[$segment]) || !is_array($target[$segment])) {
                $target[$segment] = [];
            }
            $target =& $target[$segment];
        }

        $target[$last] = $value;
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
            $yamlText = $this->dumpYaml($metadata);
            if (file_put_contents($temp, $yamlText) === false) {
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

    private function backupPath(string $yaml): string
    {
        $base = $yaml . '.bak-' . date('Ymd-His');
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
