<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use RuntimeException;

class PluginConfigService
{
    private const SETTING_FIELDS = [
        'library.title' => 'string',
        'library.intro' => 'long_string',
        'library.cards_per_row' => 'int',
        'library.show_unpublished' => 'bool',
        'route' => 'route',
        'auto_routes' => 'bool',
        'player.engine' => 'player_engine',
        'player.theme' => 'player_theme',
        'player.allow_fullscreen' => 'bool',
        'player.launch_mode' => 'launch_mode',
        'player.allow_download_saves' => 'bool',
        'player.allow_upload_saves' => 'bool',
        'player.autosave' => 'bool',
        'admin.enable_admin2_page' => 'bool',
        'validation.warn_missing_ifid' => 'bool',
        'validation.warn_missing_license' => 'bool',
        'validation.warn_missing_source' => 'bool',
        'validation.warn_missing_help_files' => 'bool',
    ];

    private const STORY_DEFAULTS = [
        'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb',
        'ulx', 'gblorb', 'glb', 'blorb', 'hex', 'gam', 't3', 'taf',
    ];

    private const ASSET_DEFAULTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'md', 'txt'];

    /** @var Grav */
    private $grav;

    public function __construct()
    {
        $this->grav = Grav::instance();
    }

    public function snapshot(array $config = []): array
    {
        $effective = $config ?: $this->effectiveConfig();
        $repository = new \Grav\Plugin\TerpVault\GameRepository($this->grav, $effective);
        $storagePath = (string)($effective['storage']['games_path'] ?? 'user://data/terpvault/games');

        return [
            'ok' => true,
            'config' => $this->editableConfig($effective),
            'storage' => [
                'games_path' => $storagePath,
                'resolved_path' => $repository->basePath(),
                'editable' => false,
            ],
            'formats' => $this->formats($effective),
            'editable_fields' => array_keys(self::SETTING_FIELDS),
            'format_fields' => [
                'security.allowed_story_extensions',
                'security.allowed_asset_extensions',
            ],
            'cache_clear_required' => true,
        ];
    }

    public function updateSettings(array $input): array
    {
        $updates = $this->flattenInput($input['settings'] ?? $input['config'] ?? $input);
        $current = $this->effectiveConfig();
        $userConfig = $this->userConfig();
        $pending = [];
        $saved = [];
        $rejected = [];
        $warnings = [];

        foreach ($updates as $path => $value) {
            if (!array_key_exists($path, self::SETTING_FIELDS)) {
                $rejected[$path] = 'Unknown or read-only setting.';
                continue;
            }

            try {
                $normalized = $this->normalizeSetting($path, $value, self::SETTING_FIELDS[$path]);
                $this->setPath($userConfig, $path, $normalized);
                $this->setPath($current, $path, $normalized);
                $saved[$path] = $normalized;

                if ($path === 'admin.enable_admin2_page' && $normalized === false) {
                    $warnings[] = 'Admin2 has been disabled in config; this page may disappear after cache clear or reload.';
                }

                if ($path === 'player.engine' && $normalized !== 'parchment') {
                    $warnings[] = 'Changing player.engine stores the config value only; TerpVault still bundles Parchment and does not add a new runtime.';
                }
            } catch (InvalidArgumentException $e) {
                $rejected[$path] = $e->getMessage();
            }
        }

        if ($saved) {
            $this->writeUserConfig($userConfig);
        }

        return [
            'ok' => empty($rejected),
            'warnings' => $warnings,
            'errors' => array_values($rejected),
            'saved_fields' => array_keys($saved),
            'saved' => $saved,
            'rejected' => $rejected,
            'ignored' => [],
            'cache_clear_required' => true,
        ] + $this->snapshot($current);
    }

    public function updateFormats(array $input): array
    {
        $payload = is_array($input['formats'] ?? null) ? $input['formats'] : $input;
        $current = $this->effectiveConfig();
        $userConfig = $this->userConfig();
        $saved = [];
        $rejected = [];
        $warnings = [];

        $map = [
            'story' => 'security.allowed_story_extensions',
            'story_extensions' => 'security.allowed_story_extensions',
            'allowed_story_extensions' => 'security.allowed_story_extensions',
            'security.allowed_story_extensions' => 'security.allowed_story_extensions',
            'asset' => 'security.allowed_asset_extensions',
            'asset_extensions' => 'security.allowed_asset_extensions',
            'allowed_asset_extensions' => 'security.allowed_asset_extensions',
            'security.allowed_asset_extensions' => 'security.allowed_asset_extensions',
        ];

        foreach ($payload as $key => $value) {
            $path = $map[(string)$key] ?? null;
            if (!$path) {
                $rejected[(string)$key] = 'Unknown format allowlist.';
                continue;
            }

            if (!is_array($value)) {
                $rejected[$path] = 'Extension allowlist must be an array.';
                continue;
            }

            try {
                $normalized = $this->normalizeExtensions($value);
                $defaults = $path === 'security.allowed_story_extensions' ? self::STORY_DEFAULTS : self::ASSET_DEFAULTS;
                $removedDefaults = array_values(array_diff($defaults, $normalized));
                if ($removedDefaults) {
                    $warnings[] = 'Built-in ' . ($path === 'security.allowed_story_extensions' ? 'story' : 'asset') . ' extensions removed: ' . implode(', ', $removedDefaults) . '.';
                }

                $pending[$path] = $normalized;
            } catch (InvalidArgumentException $e) {
                $rejected[$path] = $e->getMessage();
            }
        }

        if ($rejected) {
            return [
                'ok' => false,
                'warnings' => [],
                'errors' => array_values($rejected),
                'saved_fields' => [],
                'saved' => [],
                'rejected' => $rejected,
                'ignored' => [],
                'cache_clear_required' => true,
            ] + $this->snapshot($current);
        }

        foreach ($pending as $path => $normalized) {
            $this->setPath($userConfig, $path, $normalized);
            $this->setPath($current, $path, $normalized);
            $saved[$path] = $normalized;
        }

        if ($saved) {
            $this->writeUserConfig($userConfig);
        }

        return [
            'ok' => empty($rejected),
            'warnings' => $warnings,
            'errors' => array_values($rejected),
            'saved_fields' => array_keys($saved),
            'saved' => $saved,
            'rejected' => $rejected,
            'ignored' => [],
            'cache_clear_required' => true,
        ] + $this->snapshot($current);
    }

    public function formats(array $config = []): array
    {
        $config = $config ?: $this->effectiveConfig();
        $story = $this->normalizeConfiguredExtensions($config['security']['allowed_story_extensions'] ?? self::STORY_DEFAULTS);
        $asset = $this->normalizeConfiguredExtensions($config['security']['allowed_asset_extensions'] ?? self::ASSET_DEFAULTS);
        $known = [
            'zcode' => ['label' => 'Z-code', 'extensions' => array_values(array_intersect($story, ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb']))],
            'glulx' => ['label' => 'Glulx', 'extensions' => array_values(array_intersect($story, ['ulx', 'gblorb', 'glb', 'blorb']))],
            'hugo' => ['label' => 'Hugo', 'extensions' => array_values(array_intersect($story, ['hex']))],
            'tads' => ['label' => 'TADS 2 / TADS 3', 'extensions' => array_values(array_intersect($story, ['gam', 't3']))],
            'adrift' => ['label' => 'ADRIFT 4', 'extensions' => array_values(array_intersect($story, ['taf']))],
        ];

        $grouped = [];
        foreach ($known as $item) {
            $grouped = array_merge($grouped, $item['extensions']);
        }

        $other = array_values(array_diff($story, $grouped));
        if ($other) {
            $known['other'] = ['label' => 'Other configured story extensions', 'extensions' => $other];
        }

        return [
            'groups' => $known,
            'story_extensions' => $story,
            'asset_extensions' => $asset,
            'defaults' => [
                'story_extensions' => self::STORY_DEFAULTS,
                'asset_extensions' => self::ASSET_DEFAULTS,
            ],
            'note' => 'These settings control what TerpVault accepts. They do not add player/interpreter support.',
        ];
    }

    private function editableConfig(array $config): array
    {
        return [
            'library' => [
                'title' => (string)($config['library']['title'] ?? ''),
                'intro' => (string)($config['library']['intro'] ?? ''),
                'cards_per_row' => (int)($config['library']['cards_per_row'] ?? 3),
                'show_unpublished' => (bool)($config['library']['show_unpublished'] ?? false),
            ],
            'route' => '/' . trim((string)($config['route'] ?? '/if'), '/'),
            'auto_routes' => (bool)($config['auto_routes'] ?? true),
            'player' => [
                'engine' => (string)($config['player']['engine'] ?? 'parchment'),
                'theme' => (string)($config['player']['theme'] ?? 'retro-terminal'),
                'allow_fullscreen' => (bool)($config['player']['allow_fullscreen'] ?? true),
                'launch_mode' => (string)($config['player']['launch_mode'] ?? 'button'),
                'allow_download_saves' => (bool)($config['player']['allow_download_saves'] ?? true),
                'allow_upload_saves' => (bool)($config['player']['allow_upload_saves'] ?? true),
                'autosave' => (bool)($config['player']['autosave'] ?? true),
            ],
            'admin' => [
                'enable_admin2_page' => (bool)($config['admin']['enable_admin2_page'] ?? false),
            ],
            'validation' => [
                'warn_missing_ifid' => (bool)($config['validation']['warn_missing_ifid'] ?? true),
                'warn_missing_license' => (bool)($config['validation']['warn_missing_license'] ?? true),
                'warn_missing_source' => (bool)($config['validation']['warn_missing_source'] ?? true),
                'warn_missing_help_files' => (bool)($config['validation']['warn_missing_help_files'] ?? true),
            ],
        ];
    }

    private function normalizeSetting(string $path, $value, string $type)
    {
        if ($type === 'bool') {
            return $this->normalizeBool($value);
        }

        if ($type === 'int') {
            if (!is_numeric($value)) {
                throw new InvalidArgumentException('Value must be a number.');
            }
            $int = (int)$value;
            if ($path === 'library.cards_per_row' && ($int < 1 || $int > 6)) {
                throw new InvalidArgumentException('Cards per row must be between 1 and 6.');
            }
            return $int;
        }

        if ($type === 'route') {
            $route = '/' . trim((string)$value, '/');
            if (!preg_match('#^/[a-zA-Z0-9][a-zA-Z0-9/_-]*$#', $route) || strpos($route, '//') !== false) {
                throw new InvalidArgumentException('Route must be an absolute site path using letters, numbers, slash, dash, or underscore.');
            }
            if (preg_match('#^/(admin|api)(/|$)#i', $route)) {
                throw new InvalidArgumentException('Route cannot use the Admin or API prefix.');
            }
            return $route;
        }

        if ($type === 'player_engine') {
            $engine = strtolower(trim((string)$value));
            if (!in_array($engine, ['parchment', 'custom'], true)) {
                throw new InvalidArgumentException('Player engine must be parchment or custom.');
            }
            return $engine;
        }

        if ($type === 'player_theme') {
            $theme = strtolower(trim((string)$value));
            if (!in_array($theme, ['retro-terminal', 'parchment', 'clean'], true)) {
                throw new InvalidArgumentException('Player theme must be retro-terminal, parchment, or clean.');
            }
            return $theme;
        }

        if ($type === 'launch_mode') {
            $mode = strtolower(trim((string)$value));
            if (!in_array($mode, ['button', 'autostart'], true)) {
                throw new InvalidArgumentException('Launch mode must be button or autostart.');
            }
            return $mode;
        }

        $text = trim((string)$value);
        $max = $type === 'long_string' ? 2000 : 160;
        if (strlen($text) > $max) {
            throw new InvalidArgumentException('Text is too long.');
        }
        return $text;
    }

    private function normalizeBool($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_int($value)) {
            return $value === 1;
        }

        $text = strtolower(trim((string)$value));
        if (in_array($text, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }
        if (in_array($text, ['0', 'false', 'no', 'off', ''], true)) {
            return false;
        }

        throw new InvalidArgumentException('Value must be true or false.');
    }

    private function normalizeExtensions(array $values): array
    {
        $normalized = [];
        foreach ($values as $value) {
            if (!is_scalar($value)) {
                throw new InvalidArgumentException('Extension values must be text.');
            }

            $extension = strtolower(trim((string)$value));
            $extension = ltrim($extension, '.');
            if ($extension === '') {
                throw new InvalidArgumentException('Extension values cannot be empty.');
            }

            if (!preg_match('/^[a-z0-9][a-z0-9_-]{0,15}$/', $extension)) {
                throw new InvalidArgumentException('Extension values may only use lowercase letters, numbers, dash, and underscore.');
            }

            if (strpos($extension, '/') !== false || strpos($extension, '\\') !== false || strpos($extension, '..') !== false) {
                throw new InvalidArgumentException('Extension values cannot be path-like.');
            }

            if (in_array($extension, $normalized, true)) {
                throw new InvalidArgumentException('Duplicate extension value: ' . $extension . '.');
            }

            $normalized[] = $extension;
        }

        return $normalized;
    }

    private function normalizeConfiguredExtensions($values): array
    {
        return is_array($values) ? $this->normalizeExtensions($values) : [];
    }

    private function flattenInput($input, string $prefix = ''): array
    {
        if (!is_array($input)) {
            return [];
        }

        $flat = [];
        foreach ($input as $key => $value) {
            $path = $prefix === '' ? (string)$key : $prefix . '.' . (string)$key;
            if (is_array($value) && !$this->isList($value)) {
                $flat += $this->flattenInput($value, $path);
                continue;
            }
            $flat[$path] = $value;
        }

        return $flat;
    }

    private function isList(array $value): bool
    {
        if ($value === []) {
            return true;
        }

        return array_keys($value) === range(0, count($value) - 1);
    }

    private function effectiveConfig(): array
    {
        return (array)$this->grav['config']->get('plugins.terpvault', []);
    }

    private function userConfig(): array
    {
        $path = $this->userConfigPath(false);
        if ($path === '' || !is_file($path)) {
            return [];
        }

        $data = Yaml::parse(file_get_contents($path) ?: '') ?: [];
        if (!is_array($data)) {
            throw new RuntimeException('Existing TerpVault user config is not a YAML object.');
        }

        return $data;
    }

    private function userConfigPath(bool $createDirectory): string
    {
        $dir = $this->grav['locator']->findResource('user://config/plugins', true, $createDirectory) ?: '';
        if ($dir === '') {
            if (!$createDirectory) {
                return '';
            }

            throw new RuntimeException('Unable to resolve user config plugin directory.');
        }

        return rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'terpvault.yaml';
    }

    private function writeUserConfig(array $config): void
    {
        $path = $this->userConfigPath(true);
        $dir = dirname($path);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create user config plugin directory.');
        }

        $temp = $path . '.tmp-' . bin2hex(random_bytes(6));
        if (file_put_contents($temp, $this->dumpYaml($config)) === false) {
            throw new RuntimeException('Unable to write TerpVault config temp file.');
        }

        if (!rename($temp, $path)) {
            @unlink($temp);
            throw new RuntimeException('Unable to replace TerpVault user config.');
        }
    }

    private function setPath(array &$data, string $path, $value): void
    {
        $parts = explode('.', $path);
        $target = &$data;
        foreach ($parts as $index => $part) {
            if ($index === count($parts) - 1) {
                $target[$part] = $value;
                return;
            }

            if (!isset($target[$part]) || !is_array($target[$part])) {
                $target[$part] = [];
            }
            $target = &$target[$part];
        }
    }

    private function dumpYaml(array $data): string
    {
        if (method_exists(Yaml::class, 'dump')) {
            return rtrim((string)Yaml::dump($data, 10, 2)) . "\n";
        }

        if (class_exists('\Symfony\Component\Yaml\Yaml')) {
            return rtrim((string)\Symfony\Component\Yaml\Yaml::dump($data, 10, 2)) . "\n";
        }

        throw new RuntimeException('No YAML dumper is available.');
    }
}
