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
        return (string) $this->get('bibliographic.title', $this->get('title', $this->slug));
    }

    public function tagline(): string
    {
        return (string) $this->get('bibliographic.headline', $this->get('tagline', $this->get('headline', '')));
    }

    public function description(): string
    {
        return (string) $this->get('bibliographic.description', $this->get('description', ''));
    }

    public function status(): string
    {
        return (string) $this->get('terpvault.status', $this->get('status', 'draft'));
    }

    public function isPublished(): bool
    {
        return $this->status() === 'published';
    }

    public function format(): string
    {
        return (string) $this->get('identification.format', $this->get('format', 'zcode'));
    }

    public function formatLabel(): string
    {
        $storyExt = strtolower(pathinfo($this->storyFile(), PATHINFO_EXTENSION));
        if ($storyExt === 't3') {
            return 'TADS 3';
        }
        if ($storyExt === 'gam') {
            return 'TADS 2';
        }

        $labels = [
            'zcode' => 'Z-code',
            'z-machine' => 'Z-code',
            'glulx' => 'Glulx',
            'tads2' => 'TADS 2',
            'tads3' => 'TADS 3',
            'tads' => 'TADS',
            'hugo' => 'Hugo',
            'adrift' => 'ADRIFT 4',
        ];
        $format = strtolower($this->format());
        return $labels[$format] ?? strtoupper($this->format());
    }

    public function storyFile(): string
    {
        return (string) $this->get('resources.story_file', $this->get('story_file', $this->get('story', $this->get('file', ''))));
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
            $this->get('resources.small_cover'),
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
            $this->get('resources.cover'),
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
            $this->get('resources.splash'),
            $this->get('splash'),
            $this->get('title_image'),
            $this->get('hero'),
        ]);
    }

    public function screenshots(): array
    {
        $screenshots = $this->get('resources.screenshots', $this->get('screenshots', []));
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

    public function author(): string
    {
        return (string) $this->get('bibliographic.author', $this->get('author', ''));
    }

    public function year(): string
    {
        return (string) $this->get('bibliographic.first_published', $this->get('year', ''));
    }

    public function genre(): string
    {
        return (string) $this->get('bibliographic.genre', $this->get('genre', ''));
    }

    public function language(): string
    {
        return (string) $this->get('bibliographic.language', $this->get('language', ''));
    }

    public function ifids(): array
    {
        $ifids = $this->get('identification.ifids', $this->get('ifids', $this->get('ifid', [])));
        if (is_string($ifids) && trim($ifids) !== '') {
            $ifids = [$ifids];
        }
        if (!is_array($ifids)) {
            return [];
        }
        return array_values(array_filter(array_map('strval', $ifids)));
    }

    public function catalog(): array
    {
        $catalog = $this->get('catalog', []);
        return is_array($catalog) ? $catalog : [];
    }

    public function licenseInfo(): array
    {
        $license = $this->get('release.license', $this->get('license', []));
        return is_array($license) ? $license : [];
    }

    public function sourceInfo(): array
    {
        $source = $this->get('release.source', $this->get('source', []));
        return is_array($source) ? $source : [];
    }

    public function resourceFile(string $key, string $legacyKey = ''): string
    {
        return (string) $this->get('resources.' . $key, $legacyKey !== '' ? $this->get($legacyKey, '') : '');
    }


    /**
     * Stable display/diagnostic summary for Admin and API consumers.
     */
    public function metadataSummary(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title(),
            'author' => $this->author(),
            'year' => $this->year(),
            'genre' => $this->genre(),
            'language' => $this->language(),
            'status' => $this->status(),
            'format' => $this->format(),
            'format_label' => $this->formatLabel(),
            'story_file' => $this->storyFile(),
            'ifids' => $this->ifids(),
        ];
    }

    /**
     * Flatten known external catalog/provenance links for display.
     */
    public function catalogLinks(): array
    {
        $catalog = $this->catalog();
        $source = $this->sourceInfo();
        $license = $this->licenseInfo();

        $links = [];
        if (!empty($catalog['ifdb']['url'])) {
            $links[] = ['key' => 'ifdb', 'label' => 'IFDB', 'url' => (string)$catalog['ifdb']['url'], 'value' => (string)($catalog['ifdb']['tuid'] ?? '')];
        }
        if (!empty($catalog['ifwiki']['url'])) {
            $links[] = ['key' => 'ifwiki', 'label' => 'IFWiki', 'url' => (string)$catalog['ifwiki']['url'], 'value' => ''];
        }
        if (!empty($catalog['ifarchive']['url'])) {
            $links[] = ['key' => 'ifarchive', 'label' => 'IF Archive', 'url' => (string)$catalog['ifarchive']['url'], 'value' => (string)($catalog['ifarchive']['path'] ?? '')];
        }
        if (!empty($catalog['babel']['url'])) {
            $links[] = ['key' => 'babel', 'label' => 'Babel', 'url' => (string)$catalog['babel']['url'], 'value' => ''];
        }
        if (!empty($source['url'])) {
            $links[] = ['key' => 'source', 'label' => 'Source', 'url' => (string)$source['url'], 'value' => (string)($source['retrieved'] ?? '')];
        }
        if (!empty($license['url'])) {
            $links[] = ['key' => 'license', 'label' => 'License', 'url' => (string)$license['url'], 'value' => (string)($license['name'] ?? '')];
        }

        return $links;
    }

    public function provenanceRows(): array
    {
        $catalog = $this->catalog();
        $source = $this->sourceInfo();
        $license = $this->licenseInfo();
        $rows = [];

        $ifids = $this->ifids();
        if ($ifids) {
            $rows[] = ['label' => 'IFID', 'type' => 'codes', 'values' => $ifids];
        }

        if (!empty($catalog['ifdb']['url'])) {
            $rows[] = ['label' => 'IFDB', 'type' => 'link', 'url' => (string)$catalog['ifdb']['url'], 'text' => (string)($catalog['ifdb']['tuid'] ?? $catalog['ifdb']['url'])];
        }
        if (!empty($catalog['ifwiki']['url'])) {
            $rows[] = ['label' => 'IFWiki', 'type' => 'link', 'url' => (string)$catalog['ifwiki']['url'], 'text' => (string)$catalog['ifwiki']['url']];
        }
        if (!empty($catalog['ifarchive']['url'])) {
            $rows[] = ['label' => 'IF Archive', 'type' => 'link', 'url' => (string)$catalog['ifarchive']['url'], 'text' => (string)($catalog['ifarchive']['path'] ?? $catalog['ifarchive']['url'])];
        }
        if (!empty($catalog['babel']['url'])) {
            $rows[] = ['label' => 'Babel', 'type' => 'link', 'url' => (string)$catalog['babel']['url'], 'text' => (string)$catalog['babel']['url']];
        }

        if (!empty($source['url'])) {
            $note = trim((string)($source['notes'] ?? ''));
            if (!empty($source['retrieved'])) {
                $note = trim('Retrieved ' . (string)$source['retrieved'] . ($note !== '' ? '. ' . $note : ''));
            }
            $rows[] = ['label' => 'Source', 'type' => 'link', 'url' => (string)$source['url'], 'text' => (string)$source['url'], 'note' => $note];
        } elseif (!empty($source['notes'])) {
            $rows[] = ['label' => 'Source notes', 'type' => 'text', 'text' => (string)$source['notes']];
        }

        if (!empty($license['name'])) {
            $rows[] = [
                'label' => 'License',
                'type' => !empty($license['url']) ? 'link' : 'text',
                'url' => (string)($license['url'] ?? ''),
                'text' => (string)$license['name'],
                'note' => trim((string)($license['notes'] ?? '')),
            ];
        } elseif (!empty($license['notes'])) {
            $rows[] = ['label' => 'Redistribution notes', 'type' => 'text', 'text' => (string)$license['notes']];
        }

        return $rows;
    }

    /**
     * Package health checks for Admin/UI diagnostics.
     *
     * These are intentionally advisory unless a missing story file prevents play.
     * They help maintain provenance, ecosystem metadata, and Inform-style assets
     * without blocking early package assembly.
     */
    public function warnings(): array
    {
        $warnings = [];
        $add = static function (string $code, string $label, string $message, string $severity = 'warning') use (&$warnings): void {
            $warnings[] = [
                'code' => $code,
                'label' => $label,
                'message' => $message,
                'severity' => $severity,
            ];
        };

        if (trim($this->title()) === '' || $this->title() === $this->slug) {
            $add('missing-title', 'Missing title', 'Add bibliographic.title so the package has a human-friendly title.');
        }

        if ($this->storyFile() === '') {
            $add('missing-story-field', 'Missing story file', 'Set resources.story_file to the playable story file.', 'error');
        } elseif (!$this->hasStoryFile()) {
            $add('missing-story-file', 'Story file not found', 'The configured story file does not exist in this package folder.', 'error');
        }

        if (!count($this->ifids())) {
            $add('missing-ifid', 'IFID not recorded', 'Add one or more Treaty of Babel IFIDs when known.');
        }

        if (!$this->hasAnyAsset([
            $this->get('resources.cover'),
            $this->get('cover'),
            $this->get('cover_art'),
            'cover.jpg',
            'cover.png',
            'Cover.jpg',
            'Cover.png',
        ])) {
            $add('missing-cover', 'Cover art not found', 'Add resources.cover or a conventional cover.jpg / cover.png file.');
        }

        if (!$this->hasAnyAsset([
            $this->get('resources.small_cover'),
            $this->get('small_cover'),
            $this->get('small-cover'),
            $this->get('thumbnail'),
            $this->get('thumbnail_file'),
            'small-cover.jpg',
            'small-cover.png',
            'Small Cover.jpg',
            'Small Cover.png',
        ])) {
            $add('missing-small-cover', 'Small cover art not found', 'Add resources.small_cover or a conventional small-cover.jpg / small-cover.png file.');
        }

        $source = $this->sourceInfo();
        if (empty($source['url']) && empty($this->catalog()['ifarchive']['url'])) {
            $add('missing-source', 'Source URL not recorded', 'Add release.source.url or catalog.ifarchive.url for provenance.');
        }

        $license = $this->licenseInfo();
        $licenseName = strtolower(trim((string)($license['name'] ?? '')));
        if ($licenseName === '') {
            $add('missing-license', 'License name not recorded', 'Add release.license.name when redistribution terms are known.');
        } elseif (strpos($licenseName, 'verify') !== false || strpos($licenseName, 'unknown') !== false) {
            $add('license-review', 'License needs review', 'The license field indicates this package still needs redistribution review.');
        }
        if (empty($license['notes'])) {
            $add('missing-redistribution-notes', 'Redistribution notes not recorded', 'Add release.license.notes with curator-facing rights or redistribution context.');
        }

        if (!$this->markdownPath($this->resourceFile('how_to_play', 'how_to_play'))) {
            $add('missing-how-to-play', 'How-to-play notes not found', 'Add a how-to-play.md file for player onboarding.');
        }
        if (!$this->markdownPath($this->resourceFile('hints', 'hints'))) {
            $add('missing-hints', 'Hints not found', 'Add hints.md for spoiler-safe player help.');
        }
        if (!$this->markdownPath($this->resourceFile('walkthrough', 'walkthrough'))) {
            $add('missing-walkthrough', 'Walkthrough not found', 'Add walkthrough.md when a full solution is available.');
        }

        return $warnings;
    }

    public function warningCount(?string $severity = null): int
    {
        $warnings = $this->warnings();
        if ($severity === null) {
            return count($warnings);
        }

        return count(array_filter($warnings, static function (array $warning) use ($severity): bool {
            return ($warning['severity'] ?? '') === $severity;
        }));
    }

    public function advisoryWarnings(): array
    {
        return array_values(array_filter($this->warnings(), static function (array $warning): bool {
            return ($warning['severity'] ?? 'warning') !== 'error';
        }));
    }

    public function toArray(bool $includeUrls = true): array
    {
        $data = $this->meta;
        $data['slug'] = $this->slug;
        $data['status'] = $this->status();
        $data['title'] = $this->title();
        $data['tagline'] = $this->tagline();
        $data['description'] = $this->description();
        $data['author'] = $this->author();
        $data['year'] = $this->year();
        $data['genre'] = $this->genre();
        $data['format'] = $this->format();
        $data['format_label'] = $this->formatLabel();
        $data['story_file'] = $this->storyFile();
        $data['has_story_file'] = $this->hasStoryFile();
        $data['ifids'] = $this->ifids();
        $data['catalog'] = $this->catalog();
        $data['metadata_summary'] = $this->metadataSummary();
        $data['catalog_links'] = $this->catalogLinks();
        $data['warnings'] = $this->warnings();
        $data['warning_count'] = $this->warningCount();
        $data['error_count'] = $this->warningCount('error');

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

    private function hasAnyAsset(array $candidates): bool
    {
        foreach ($candidates as $candidate) {
            $candidate = is_string($candidate) ? trim($candidate) : '';
            if ($candidate !== '' && $this->assetPath($candidate)) {
                return true;
            }
        }

        return false;
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
