<?php
namespace Grav\Plugin\TerpVault;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use RuntimeException;

/**
 * Reads TerpVault game package folders from user/data/terpvault/games.
 */
class GameRepository
{
    /** @var Grav */
    protected $grav;

    /** @var array */
    protected $config;

    /** @var string */
    protected $route;

    /** @var string */
    protected $path;

    public function __construct(Grav $grav, array $config)
    {
        $this->grav = $grav;
        $this->config = $config;
        $this->route = rtrim((string)($config['route'] ?? '/if'), '/');
        $stream = (string)($config['storage']['games_path'] ?? 'user://data/terpvault/games');
        $this->path = $grav['locator']->findResource($stream, true, true) ?: '';
    }

    public function basePath(): string
    {
        return $this->path;
    }

    /**
     * @return GamePackage[]
     */
    public function all(bool $includeUnpublished = false): array
    {
        if (!$this->path || !is_dir($this->path)) {
            return [];
        }

        $packages = [];
        $iterator = new \DirectoryIterator($this->path);
        foreach ($iterator as $fileinfo) {
            if (!$fileinfo->isDir() || $fileinfo->isDot()) {
                continue;
            }

            $slug = $this->slugify($fileinfo->getFilename());
            $package = $this->load($slug);
            if (!$package) {
                continue;
            }

            if (!$includeUnpublished && !$package->isPublished()) {
                continue;
            }

            $packages[$package->slug] = $package;
        }

        uasort($packages, static function (GamePackage $a, GamePackage $b) {
            return strcasecmp($a->title(), $b->title());
        });

        return array_values($packages);
    }

    public function find(string $slug, bool $includeUnpublished = true): ?GamePackage
    {
        $slug = $this->slugify($slug);
        $package = $this->load($slug);

        if (!$package) {
            return null;
        }

        if (!$includeUnpublished && !$package->isPublished()) {
            return null;
        }

        return $package;
    }

    public function load(string $slug): ?GamePackage
    {
        if (!$this->path) {
            return null;
        }

        $slug = $this->slugify($slug);
        $dir = $this->path . DIRECTORY_SEPARATOR . $slug;
        $yamlFile = $dir . DIRECTORY_SEPARATOR . 'game.yaml';

        if (!is_dir($dir) || !is_file($yamlFile)) {
            return null;
        }

        $meta = Yaml::parse(file_get_contents($yamlFile)) ?: [];
        if (!is_array($meta)) {
            throw new RuntimeException("Invalid game.yaml for {$slug}");
        }

        $meta['slug'] = $meta['slug'] ?? $slug;
        return new GamePackage($this->slugify((string)$meta['slug']), $meta, $dir, $this->route);
    }

    public function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9\-_]+/', '-', $value) ?: '';
        $value = trim($value, '-_');

        return $value ?: 'untitled';
    }

    public function allowedStoryExtension(string $path): bool
    {
        $allowed = $this->config['security']['allowed_story_extensions'] ?? [];
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }

    public function allowedAssetExtension(string $path): bool
    {
        $allowed = $this->config['security']['allowed_asset_extensions'] ?? [];
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }
}
