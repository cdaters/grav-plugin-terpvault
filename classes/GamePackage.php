<?php
namespace Grav\Plugin\TerpVault;

/**
 * Lightweight value object for one TerpVault game package.
 */
class GamePackage
{
    /** @var string */
    public $slug;

    /** @var array */
    public $meta;

    /** @var string */
    public $path;

    /** @var string */
    public $route;

    public function __construct(string $slug, array $meta, string $path, string $route)
    {
        $this->slug = $slug;
        $this->meta = $meta;
        $this->path = rtrim($path, DIRECTORY_SEPARATOR);
        $this->route = rtrim($route, '/');
    }

    public function get(string $key, $default = null)
    {
        $segments = explode('.', $key);
        $value = $this->meta;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }

    public function title(): string
    {
        return (string) $this->get('title', $this->slug);
    }

    public function tagline(): string
    {
        return (string) $this->get('tagline', '');
    }

    public function description(): string
    {
        return (string) $this->get('description', '');
    }

    public function status(): string
    {
        return (string) $this->get('status', 'draft');
    }

    public function isPublished(): bool
    {
        return $this->status() === 'published';
    }

    public function format(): string
    {
        return (string) $this->get('format', 'zcode');
    }

    public function storyFile(): string
    {
        return (string) $this->get('story_file', $this->get('story', $this->get('file', '')));
    }

    public function storyPath(): ?string
    {
        $file = $this->storyFile();
        if ($file === '') {
            return null;
        }

        $path = $this->safePath($file);
        return is_file($path) ? $path : null;
    }

    public function hasStoryFile(): bool
    {
        return $this->storyPath() !== null;
    }

    public function assetPath(?string $relative): ?string
    {
        if (!$relative) {
            return null;
        }

        $path = $this->safePath($relative);
        return is_file($path) ? $path : null;
    }

    public function markdownPath(?string $relative): ?string
    {
        if (!$relative) {
            return null;
        }

        $path = $this->safePath($relative);
        return is_file($path) ? $path : null;
    }

    public function url(string $type = 'detail'): string
    {
        switch ($type) {
            case 'play':
                return $this->route . '/' . rawurlencode($this->slug) . '/play';
            case 'file':
                return $this->route . '/_file/' . rawurlencode($this->slug);
            case 'story':
                $storyFile = basename(str_replace('\\', '/', $this->storyFile()));
                return $this->route . '/_story/' . rawurlencode($this->slug) . '/' . rawurlencode($storyFile ?: 'story.z5');
            case 'asset':
                return $this->route . '/_asset/' . rawurlencode($this->slug);
            case 'detail':
            default:
                return $this->route . '/' . rawurlencode($this->slug);
        }
    }

    public function assetUrl(?string $relative): ?string
    {
        if (!$relative || !$this->assetPath($relative)) {
            return null;
        }

        return $this->url('asset') . '/' . ltrim(str_replace('\\', '/', $relative), '/');
    }

    /**
     * Inform-style small cover art, used by TerpVault library cards.
     *
     * Preferred package field: small_cover: small-cover.jpg
     * Backward compatible aliases: small-cover, thumbnail, thumbnail_file.
     * If no field is provided, common Inform filenames are detected.
     */
    public function smallCoverUrl(): ?string
    {
        return $this->firstAssetUrl([
            $this->get('small_cover'),
            $this->get('small-cover'),
            $this->get('thumbnail'),
            $this->get('thumbnail_file'),
            'small-cover.jpg',
            'small-cover.png',
            'Small Cover.jpg',
            'Small Cover.png',
        ]) ?: $this->coverUrl();
    }

    /**
     * Backward-compatible alias retained for earlier templates/docs.
     */
    public function thumbnailUrl(): ?string
    {
        return $this->smallCoverUrl();
    }

    /**
     * Inform-style cover art. TerpVault expects a display/box/title image here.
     */
    public function coverUrl(): ?string
    {
        return $this->firstAssetUrl([
            $this->get('cover'),
            $this->get('cover_art'),
            'cover.jpg',
            'cover.png',
            'Cover.jpg',
            'Cover.png',
        ]);
    }

    /**
     * Optional legacy/extra wide splash art. New packages should usually use cover.
     */
    public function splashUrl(): ?string
    {
        return $this->firstAssetUrl([
            $this->get('splash'),
            $this->get('title_image'),
            $this->get('hero'),
        ]);
    }

    public function screenshots(): array
    {
        $screenshots = $this->get('screenshots', []);
        if (!is_array($screenshots)) {
            return [];
        }

        $items = [];
        foreach ($screenshots as $screenshot) {
            $url = $this->assetUrl((string) $screenshot);
            if ($url) {
                $items[] = $url;
            }
        }

        return $items;
    }

    public function toArray(bool $includeUrls = true): array
    {
        $data = $this->meta;
        $data['slug'] = $this->slug;
        $data['status'] = $this->status();
        $data['format'] = $this->format();
        $data['story_file'] = $this->storyFile();
        $data['has_story_file'] = $this->hasStoryFile();

        if ($includeUrls) {
            $smallCover = $this->smallCoverUrl();
            $data['urls'] = [
                'detail' => $this->url('detail'),
                'play' => $this->url('play'),
                'file' => $this->url('file'),
                'story' => $this->url('story'),
                'small_cover' => $smallCover,
                'thumbnail' => $smallCover,
                'cover' => $this->coverUrl(),
                'splash' => $this->splashUrl(),
                'screenshots' => $this->screenshots(),
            ];
        }

        return $data;
    }

    private function firstAssetUrl(array $candidates): ?string
    {
        foreach ($candidates as $candidate) {
            $candidate = is_string($candidate) ? trim($candidate) : '';
            if ($candidate === '') {
                continue;
            }

            $url = $this->assetUrl($candidate);
            if ($url) {
                return $url;
            }
        }

        return null;
    }

    private function safePath(string $relative): string
    {
        $relative = ltrim(str_replace(['\\', '../', '..\\'], ['/', '', ''], $relative), '/');
        return $this->path . DIRECTORY_SEPARATOR . $relative;
    }
}
