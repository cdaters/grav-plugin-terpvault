<?php
namespace Grav\Plugin\TerpVault;

/**
 * Lightweight value object for one TerpVault game package.
 */
class GamePackage
{
    private const HERO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    private const FEELIE_EXTENSIONS = ['pdf', 'txt', 'md', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'ogg', 'wav', 'm4a'];

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
        foreach ([
            $this->get('identification.format'),
            $this->get('identification.system'),
            $this->get('format'),
            $this->get('system'),
        ] as $value) {
            $value = trim((string) $value);
            if ($value !== '') {
                return $this->normalizeFormat($value);
            }
        }

        return $this->inferFormat();
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

    private function inferFormat(): string
    {
        $ifidFormat = $this->formatFromIfids($this->ifids());
        if ($ifidFormat !== '') {
            return $ifidFormat;
        }

        $storyFormat = $this->formatFromPath($this->storyFile());
        if ($storyFormat !== '') {
            return $storyFormat;
        }

        $playerFormat = $this->normalizeKnownFormat((string) $this->get('player.engine', $this->get('player.runtime', '')));
        if ($playerFormat !== '') {
            return $playerFormat;
        }

        $catalog = $this->catalog();
        $archiveFormat = $this->formatFromPath((string)($catalog['ifarchive']['path'] ?? $catalog['ifarchive']['url'] ?? ''));
        return $archiveFormat !== '' ? $archiveFormat : 'zcode';
    }

    private function normalizeFormat(string $value): string
    {
        $format = strtolower(trim(str_replace(['_', ' '], '-', $value)));
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

        return $format;
    }

    private function formatFromIfids(array $ifids): string
    {
        // Treaty IFID prefixes are strong enough to fill a blank package format.
        $joined = strtoupper(implode(' ', $ifids));
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

    private function formatFromPath(string $path): string
    {
        $extension = strtolower(pathinfo(parse_url($path, PHP_URL_PATH) ?: $path, PATHINFO_EXTENSION));
        return $this->normalizeKnownFormat($extension);
    }

    private function normalizeKnownFormat(string $value): string
    {
        $format = $this->normalizeFormat($value);
        return in_array($format, ['zcode', 'glulx', 'tads2', 'tads3', 'tads', 'hugo', 'adrift', 'ink'], true) ? $format : '';
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
        return $path !== null && is_file($path) ? $path : null;
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
        return $path !== null && is_file($path) ? $path : null;
    }

    public function markdownPath(?string $relative): ?string
    {
        if (!$relative) {
            return null;
        }

        $path = $this->safePath($relative);
        return $path !== null && is_file($path) ? $path : null;
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
     * Optional wide presentation image for public detail/play pages.
     *
     * This is intentionally separate from cover and small_cover artwork.
     */
    public function heroUrl(): ?string
    {
        return $this->firstAssetUrl([
            $this->resourcePathValue($this->get('resources.hero')),
            $this->get('hero'),
            'hero.jpg',
            'hero.jpeg',
            'hero.png',
            'hero.webp',
            'hero.gif',
        ], self::HERO_EXTENSIONS);
    }

    public function heroStyle(): string
    {
        $url = $this->heroUrl();
        if (!$url) {
            return '';
        }

        $hero = $this->get('resources.hero', []);
        $hero = is_array($hero) ? $hero : [];
        $position = $this->cssKeywordValue((string)($hero['focal_position'] ?? 'center center'), 'center center');
        $overlay = $this->overlayColor((string)($hero['overlay_color'] ?? ''), (string)($hero['overlay_tone'] ?? 'dark'));
        $gradient = $this->heroGradient((string)($hero['gradient_direction'] ?? 'to bottom'), $overlay);

        return '--tv-hero-image: url("' . str_replace(['\\', '"'], ['/', '%22'], $url) . '");'
            . '--tv-hero-position: ' . $position . ';'
            . '--tv-hero-gradient: ' . $gradient . ';';
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

    public function feelies(): array
    {
        $feelies = $this->get('resources.feelies', []);
        if (!is_array($feelies)) {
            return [];
        }

        $items = [];
        foreach ($feelies as $item) {
            $data = is_array($item) ? $item : ['path' => (string) $item];
            $path = $this->resourcePathValue($data);
            if ($path === '') {
                continue;
            }
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (!in_array($extension, self::FEELIE_EXTENSIONS, true)) {
                continue;
            }

            $url = $this->assetUrl($path);
            if (!$url) {
                continue;
            }

            $title = trim((string)($data['title'] ?? ''));
            if ($title === '') {
                $title = basename(str_replace('\\', '/', $path));
            }

            $items[] = [
                'title' => $title,
                'path' => $path,
                'url' => $url,
                'type' => trim((string)($data['type'] ?? $data['category'] ?? '')),
                'description' => trim((string)($data['description'] ?? '')),
                'extension' => $extension,
            ];
        }

        return $items;
    }

    public function declaredFeeliePath(string $relative): bool
    {
        $relative = $this->normalizeRelativePath($relative);
        if ($relative === '') {
            return false;
        }

        $extension = strtolower(pathinfo($relative, PATHINFO_EXTENSION));
        if (!in_array($extension, self::FEELIE_EXTENSIONS, true)) {
            return false;
        }

        $feelies = $this->get('resources.feelies', []);
        if (!is_array($feelies)) {
            return false;
        }

        foreach ($feelies as $item) {
            $data = is_array($item) ? $item : ['path' => (string) $item];
            $path = $this->normalizeRelativePath($this->resourcePathValue($data));
            if ($path !== '' && $path === $relative) {
                return true;
            }
        }

        return false;
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
                'hero' => $this->heroUrl(),
                'splash' => $this->splashUrl(),
                'screenshots' => $this->screenshots(),
            ];
            $data['feelies'] = $this->feelies();
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

    private function firstAssetUrl(array $candidates, array $allowedExtensions = []): ?string
    {
        foreach ($candidates as $candidate) {
            $candidate = is_string($candidate) ? trim($candidate) : '';
            if ($candidate === '') {
                continue;
            }
            if ($allowedExtensions && !in_array(strtolower(pathinfo($candidate, PATHINFO_EXTENSION)), $allowedExtensions, true)) {
                continue;
            }

            $url = $this->assetUrl($candidate);
            if ($url) {
                return $url;
            }
        }

        return null;
    }

    private function resourcePathValue($value): string
    {
        if (is_array($value)) {
            return trim((string)($value['path'] ?? ''));
        }

        return is_string($value) ? trim($value) : '';
    }

    private function cssKeywordValue(string $value, string $fallback): string
    {
        $value = trim($value);
        if ($value === '' || !preg_match('/^[a-z0-9% ._-]+$/i', $value)) {
            return $fallback;
        }

        return $value;
    }

    private function heroGradient(string $direction, array $overlay): string
    {
        $direction = strtolower(trim($direction));
        if ($direction === 'radial') {
            return 'radial-gradient(circle, ' . $overlay['start'] . ', ' . $overlay['end'] . ')';
        }

        $allowed = ['to bottom', 'to top', 'to right', 'to left'];
        if (!in_array($direction, $allowed, true) && !preg_match('/^-?\d{1,3}(\.\d+)?deg$/', $direction)) {
            $direction = 'to bottom';
        }

        return 'linear-gradient(' . $direction . ', ' . $overlay['start'] . ', ' . $overlay['end'] . ')';
    }

    private function overlayColor(string $color, string $tone): array
    {
        $color = trim($color);
        if ($color === '' || !preg_match('/^#[0-9a-f]{3}([0-9a-f]{3})?$/i', $color)) {
            $palette = [
                'light' => ['start' => 'rgba(255,255,255,.78)', 'end' => 'rgba(255,255,255,.46)'],
                'warm' => ['start' => 'rgba(42,27,14,.68)', 'end' => 'rgba(42,27,14,.38)'],
                'cool' => ['start' => 'rgba(10,25,44,.70)', 'end' => 'rgba(10,25,44,.40)'],
                'none' => ['start' => 'rgba(0,0,0,0)', 'end' => 'rgba(0,0,0,0)'],
                'dark' => ['start' => 'rgba(0,0,0,.72)', 'end' => 'rgba(0,0,0,.36)'],
            ];

            return $palette[$tone] ?? $palette['dark'];
        }

        if (strlen($color) === 4) {
            $color = '#' . $color[1] . $color[1] . $color[2] . $color[2] . $color[3] . $color[3];
        }

        return ['start' => $color . 'cc', 'end' => $color . '66'];
    }

    private function safePath(string $relative): ?string
    {
        $relative = $this->normalizeRelativePath($relative);
        if ($relative === '') {
            return null;
        }

        return $this->path . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    }

    private function normalizeRelativePath(string $relative): string
    {
        if (strpos($relative, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $relative)) {
            return '';
        }

        $relative = str_replace('\\', '/', trim($relative));
        if ($relative === '' || $relative[0] === '/' || preg_match('/^[A-Za-z]:\//', $relative)) {
            return '';
        }

        $segments = array_values(array_filter(explode('/', $relative), static function (string $segment): bool {
            return $segment !== '';
        }));

        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                return '';
            }
        }

        return implode('/', $segments);
    }
}
