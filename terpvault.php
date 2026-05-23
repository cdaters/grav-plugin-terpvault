<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use Grav\Common\Page\Page;
use Grav\Plugin\TerpVault\GamePackage;
use Grav\Plugin\TerpVault\GameRepository;
use RocketTheme\Toolbox\Event\Event;
use Twig\TwigFunction;

require_once __DIR__ . '/classes/GamePackage.php';
require_once __DIR__ . '/classes/GameRepository.php';

/**
 * TerpVault plugin.
 *
 * v0.2.x is a repo-ready foundation: package metadata, virtual library/detail/play
 * pages, controlled file serving, Twig helpers, shortcode-style embedding, and
 * opt-in read-only Admin2 library inspection.
 */
class TerpVaultPlugin extends Plugin
{
    /** @var GameRepository|null */
    protected $repository;

    public static function getSubscribedEvents(): array
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
        ];
    }

    public function autoload()
    {
        spl_autoload_register(static function (string $class): void {
            $prefix = 'Grav\\Plugin\\TerpVault\\';
            if (strpos($class, $prefix) !== 0) {
                return;
            }

            $relative = substr($class, strlen($prefix));
            $file = __DIR__ . '/classes/' . str_replace('\\', '/', $relative) . '.php';
            if (is_file($file)) {
                require_once $file;
            }
        });
    }

    public function onPluginsInitialized(): void
    {
        if (!$this->config->get('plugins.terpvault.enabled')) {
            return;
        }

        $events = [];

        if ($this->isFrontendRequest()) {
            $events += [
                'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
                'onTwigInitialized' => ['onTwigInitialized', 0],
                'onTwigSiteVariables' => ['onTwigSiteVariables', 0],
                'onPagesInitialized' => ['onPagesInitialized', 100],
                'onPageContentProcessed' => ['onPageContentProcessed', 0],
            ];
        }

        // Admin2 discovers plugin pages and API routes through events whose URI
        // shape can vary by Admin2/API version. Once the explicit opt-in flag is
        // enabled, subscribe to those Admin2/API events and let the event type
        // provide the boundary. Frontend virtual routing is still guarded
        // separately by isFrontendRequest().
        if ($this->admin2IntegrationEnabled()) {
            $events += [
                'onApiRegisterRoutes' => ['onApiRegisterRoutes', 0],
                'onApiSidebarItems' => ['onApiSidebarItems', 0],
                'onApiPluginPageInfo' => ['onApiPluginPageInfo', 0],
            ];
        }

        if ($events) {
            $this->enable($events);
        }
    }

    public function onTwigTemplatePaths(): void
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    public function onTwigInitialized(): void
    {
        $twig = $this->grav['twig']->twig();
        $twig->addFunction(new TwigFunction('terpvault_games', [$this, 'twigGames']));
        $twig->addFunction(new TwigFunction('terpvault_game', [$this, 'twigGame']));
        $twig->addFunction(new TwigFunction('terpvault_player_url', [$this, 'twigPlayerUrl']));
        $twig->addFunction(new TwigFunction('terpvault_render_markdown', [$this, 'twigRenderMarkdown'], ['is_safe' => ['html']]));
        $twig->addFunction(new TwigFunction('terpvault_markdown', [$this, 'twigMarkdown'], ['is_safe' => ['html']]));
        $twig->addFunction(new TwigFunction('terpvault_game_from_route', [$this, 'twigGameFromRoute']));
    }

    public function onTwigSiteVariables(): void
    {
        $assets = $this->grav['assets'];
        $assets->addCss('plugin://terpvault/assets/css/terpvault.css');
        $assets->addJs('plugin://terpvault/assets/js/terpvault.js', ['group' => 'bottom']);

        $twig = $this->grav['twig'];
        $twig->twig_vars['terpvault'] = [
            'config' => $this->pluginConfig(),
            'games' => $this->twigGames(),
            'route' => $this->publicRoute(),
        ];
    }

    /**
     * Render virtual pages and safely serve package files/assets.
     *
     * Frontend virtual routes are Grav pages added before page resolution.
     * Admin2/API integration routes are separate API endpoints and must not
     * participate in this flow. Keeping those paths separate avoids overriding
     * or touching Grav's active/frozen page service during Admin2 requests.
     *
     * Use onPagesInitialized, not onPageInitialized: Grav has loaded the page
     * collection but has not resolved the active page yet. We add routeable
     * virtual pages to the collection here and never assign $grav['page'], which
     * avoids the frozen page service in Grav 2/Admin2.
     */
    public function onPagesInitialized(): void
    {
        if (!($this->pluginConfig()['auto_routes'] ?? true) || !$this->isFrontendRequest()) {
            return;
        }

        $route = $this->currentFrontendRoute();
        $base = $this->baseRoute();

        if ($route === $base . '/_engine/parchment') {
            $this->serveParchment();
        }

        if ($route === $base . '/_manifest') {
            $this->serveJson(['games' => array_map(static function (GamePackage $game) {
                return $game->toArray();
            }, $this->repository()->all(true))]);
        }

        if (strpos($route, $base . '/_story/') === 0) {
            $remaining = substr($route, strlen($base . '/_story/'));
            [$slug] = array_pad(explode('/', $remaining, 2), 1, '');
            $this->serveStoryFile(rawurldecode($slug));
        }

        if (strpos($route, $base . '/_file/') === 0) {
            $remaining = substr($route, strlen($base . '/_file/'));
            [$slug] = array_pad(explode('/', $remaining, 2), 1, '');
            $this->serveStoryFile(rawurldecode($slug));
        }

        if (strpos($route, $base . '/_asset/') === 0) {
            $remaining = substr($route, strlen($base . '/_asset/'));
            [$slug, $asset] = array_pad(explode('/', $remaining, 2), 2, '');
            $this->serveAsset(rawurldecode($slug), rawurldecode($asset));
        }

        if ($route === $base) {
            $this->addVirtualPage(__DIR__ . '/pages/library.md', $route);
            return;
        }

        if (preg_match('#^' . preg_quote($base, '#') . '/([^/]+)/play$#', $route, $matches)) {
            $game = $this->repository()->find(rawurldecode($matches[1]), $this->showUnpublished());
            if ($game) {
                $this->grav['twig']->twig_vars['terpvault_current_game'] = $game;
                $this->addVirtualPage(__DIR__ . '/pages/play.md', $route);
            }
            return;
        }

        if (preg_match('#^' . preg_quote($base, '#') . '/([^/]+)$#', $route, $matches)) {
            $game = $this->repository()->find(rawurldecode($matches[1]), $this->showUnpublished());
            if ($game) {
                $this->grav['twig']->twig_vars['terpvault_current_game'] = $game;
                $this->addVirtualPage(__DIR__ . '/pages/detail.md', $route);
            }
        }
    }

    /**
     * Small native shortcode, independent of Shortcode Core:
     * [terpvault game="sample-cave"]
     */
    public function onPageContentProcessed(Event $event): void
    {
        /** @var Page $page */
        $page = $event['page'];
        $content = $page->content();

        if (strpos($content, '[terpvault') === false) {
            return;
        }

        $content = preg_replace_callback('/\[terpvault\s+game=["\']([^"\']+)["\']\s*\]/i', function ($matches) {
            $game = $this->repository()->find($matches[1], $this->showUnpublished());
            if (!$game) {
                return '<div class="terpvault-alert">TerpVault game not found: ' . htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8') . '</div>';
            }

            return $this->grav['twig']->processTemplate('partials/terpvault-player.html.twig', [
                'game' => $game,
                'config' => $this->pluginConfig(),
            ]);
        }, $content);

        $page->content($content);
    }

    public function onApiSidebarItems(Event $event): void
    {
        if (!$this->admin2IntegrationEnabled()) {
            return;
        }

        $items = $event['items'] ?? [];
        $items[] = [
            'id' => 'terpvault',
            'plugin' => 'terpvault',
            'label' => 'TerpVault',
            'icon' => 'fa-book-open',
            'route' => '/plugin/terpvault',
            'priority' => 35,
        ];
        $event['items'] = $items;
    }

    public function onApiPluginPageInfo(Event $event): void
    {
        if (!$this->admin2IntegrationEnabled()) {
            return;
        }

        if (($event['plugin'] ?? null) !== 'terpvault') {
            return;
        }

        $event['definition'] = [
            'id' => 'terpvault',
            'plugin' => 'terpvault',
            'title' => 'TerpVault',
            'icon' => 'fa-book-open',
            'page_type' => 'component',
            'actions' => [],
            'data' => $this->admin2PageData(),
        ];
    }

    public function onApiRegisterRoutes(Event $event): void
    {
        if (!$this->admin2IntegrationEnabled()) {
            return;
        }

        require_once __DIR__ . '/classes/Service/PackageMetadataService.php';
        require_once __DIR__ . '/classes/Service/PackageCreationService.php';
        require_once __DIR__ . '/classes/Service/PackageMarkdownService.php';
        require_once __DIR__ . '/classes/Service/PackageMediaService.php';
        require_once __DIR__ . '/classes/Service/PackageStoryService.php';
        require_once __DIR__ . '/classes/Controller/ApiController.php';

        $routes = $event['routes'] ?? null;
        if (!$routes) {
            return;
        }

        $controller = \Grav\Plugin\TerpVault\Controller\ApiController::class;
        $routes->post('/terpvault/packages', [$controller, 'createPackage']);
        $routes->get('/terpvault/packages/{slug}/metadata', [$controller, 'metadata']);
        $routes->patch('/terpvault/packages/{slug}/metadata', [$controller, 'updateMetadata']);
        $routes->get('/terpvault/packages/{slug}/markdown/{type}', [$controller, 'markdown']);
        $routes->patch('/terpvault/packages/{slug}/markdown/{type}', [$controller, 'updateMarkdown']);
        $routes->get('/terpvault/packages/{slug}/media', [$controller, 'media']);
        $routes->post('/terpvault/packages/{slug}/media/{type}', [$controller, 'uploadMedia']);
        $routes->patch('/terpvault/packages/{slug}/media/screenshots', [$controller, 'updateScreenshots']);
        $routes->get('/terpvault/packages/{slug}/story', [$controller, 'story']);
        $routes->post('/terpvault/packages/{slug}/story', [$controller, 'uploadStory']);
    }

    public function twigGames(bool $includeUnpublished = false): array
    {
        return $this->repository()->all($includeUnpublished || $this->showUnpublished());
    }

    public function twigGame(string $slug): ?GamePackage
    {
        return $this->repository()->find($slug, $this->showUnpublished());
    }

    public function twigPlayerUrl(GamePackage $game): string
    {
        $config = $this->pluginConfig();
        $storyPayload = $this->parchmentStoryPayload($game);
        $storyQuery = rawurlencode(json_encode($storyPayload, JSON_UNESCAPED_SLASHES));
        $configured = trim((string)($config['player']['parchment_url'] ?? ''));

        if ($configured !== '') {
            return $configured . (strpos($configured, '?') === false ? '?' : '&') . 'story=' . $storyQuery;
        }

        $engineRoute = $this->absoluteUrl($this->baseRoute() . '/_engine/parchment');

        return $engineRoute . '?story=' . $storyQuery;
    }

    /**
     * Parchment can infer story formats from file extensions, but TerpVault
     * serves story files through a controlled route such as /if/_story/slug/game.z5.
     * The explicit filename keeps browser interpreters happier while the
     * route still prevents arbitrary file access.
     */
    protected function parchmentStoryPayload(GamePackage $game): array
    {
        return [
            'url' => $this->absoluteUrl($game->url('story')),
            'format' => $this->parchmentFormat($game),
            'title' => $game->title(),
        ];
    }

    protected function parchmentFormat(GamePackage $game): string
    {
        $format = strtolower(trim((string)$game->format()));
        $storyFile = strtolower((string)$game->storyFile());
        $ext = strtolower(pathinfo($storyFile, PATHINFO_EXTENSION));

        if (in_array($format, ['zcode', 'z-machine', 'zmachine'], true) || preg_match('/^z[1-8]$/', $ext) || in_array($ext, ['zblorb', 'zlb'], true)) {
            return 'zcode';
        }

        if (in_array($format, ['glulx', 'ulx'], true) || in_array($ext, ['ulx', 'gblorb', 'glb', 'blorb'], true)) {
            return 'glulx';
        }

        if ($format === 'hugo' || $ext === 'hex') {
            return 'hugo';
        }

        if (in_array($format, ['tads', 'tads2', 'tads3'], true) || in_array($ext, ['gam', 't3'], true)) {
            return 'tads';
        }

        if ($format === 'adrift' || $ext === 'taf') {
            return 'adrift';
        }

        return $format ?: 'zcode';
    }

    public function twigMarkdown(?string $markdown): string
    {
        if ($markdown === null || trim($markdown) === '') {
            return '';
        }

        return $this->markdownToHtml($markdown);
    }

    public function twigRenderMarkdown(?string $file): string
    {
        if (!$file || !is_file($file)) {
            return '';
        }

        $markdown = file_get_contents($file) ?: '';
        return $this->markdownToHtml($markdown);
    }

    /**
     * Render package Markdown without assuming Grav exposes a `parsedown`
     * service. Grav 2/Admin2 installs may not register that container key,
     * so we try common Parsedown classes first and then fall back to a small,
     * safe renderer instead of throwing a template exception.
     */
    protected function markdownToHtml(string $markdown): string
    {
        foreach ([
            '\ParsedownExtra',
            '\Parsedown',
            '\RocketTheme\Toolbox\Parsedown\ParsedownExtra',
            '\RocketTheme\Toolbox\Parsedown\Parsedown',
        ] as $class) {
            if (class_exists($class)) {
                $parser = new $class();
                if (method_exists($parser, 'setSafeMode')) {
                    $parser->setSafeMode(true);
                }

                return $this->restoreAllowedPackageHtml((string) $parser->text($markdown));
            }
        }

        return $this->basicMarkdownToHtml($markdown);
    }

    /**
     * Parsedown safe mode escapes all raw HTML, including harmless disclosure
     * widgets. TerpVault package help files are local/admin-managed content, so
     * allow a tiny whitelist for progressive hints while keeping everything else
     * escaped.
     */
    protected function restoreAllowedPackageHtml(string $html): string
    {
        $replacements = [
            '&lt;details&gt;' => '<details>',
            '&lt;details open&gt;' => '<details open>',
            '&lt;/details&gt;' => '</details>',
        ];

        $html = strtr($html, $replacements);

        return preg_replace_callback(
            '/&lt;summary&gt;(.*?)&lt;\/summary&gt;/is',
            static function (array $matches): string {
                return '<summary>' . $matches[1] . '</summary>';
            },
            $html
        ) ?: $html;
    }

    /**
     * Format a small, safe subset of inline Markdown for the fallback renderer.
     */
    protected function basicMarkdownInline(string $text): string
    {
        $parts = preg_split('/(`[^`]+`)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
        if (!$parts) {
            return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
        }

        $html = '';
        foreach ($parts as $part) {
            if ($part === '') {
                continue;
            }

            if (strlen($part) >= 2 && $part[0] === '`' && substr($part, -1) === '`') {
                $html .= '<code>' . htmlspecialchars(substr($part, 1, -1), ENT_QUOTES, 'UTF-8') . '</code>';
                continue;
            }

            $html .= htmlspecialchars($part, ENT_QUOTES, 'UTF-8');
        }

        return $html;
    }

    /**
     * Tiny fallback for package help files if no Markdown parser class is
     * available. This intentionally supports only common, safe formatting.
     */
    protected function basicMarkdownToHtml(string $markdown): string
    {
        $lines = preg_split('/\R/', trim($markdown));
        if (!$lines) {
            return '';
        }

        $html = [];
        $paragraph = [];
        $inList = false;

        $flushParagraph = static function () use (&$html, &$paragraph): void {
            if ($paragraph) {
                $html[] = '<p>' . implode(' ', $paragraph) . '</p>';
                $paragraph = [];
            }
        };

        $closeList = static function () use (&$html, &$inList): void {
            if ($inList) {
                $html[] = '</ul>';
                $inList = false;
            }
        };

        foreach ($lines as $line) {
            $line = rtrim($line);

            if ($line === '') {
                $flushParagraph();
                $closeList();
                continue;
            }

            if (preg_match('/^(#{1,4})\s+(.+)$/', $line, $matches)) {
                $flushParagraph();
                $closeList();
                $level = strlen($matches[1]);
                $html[] = '<h' . $level . '>' . $this->basicMarkdownInline($matches[2]) . '</h' . $level . '>';
                continue;
            }

            if (preg_match('/^[-*]\s+(.+)$/', $line, $matches)) {
                $flushParagraph();
                if (!$inList) {
                    $html[] = '<ul>';
                    $inList = true;
                }
                $html[] = '<li>' . $this->basicMarkdownInline($matches[1]) . '</li>';
                continue;
            }

            if (preg_match('/^<\/?details>$/i', $line) || preg_match('/^<summary>.*<\/summary>$/i', $line)) {
                $flushParagraph();
                $closeList();
                $html[] = $line;
                continue;
            }

            $paragraph[] = $this->basicMarkdownInline($line);
        }

        $flushParagraph();
        $closeList();

        return implode("\n", $html);
    }

    protected function supportedFormats(): array
    {
        return [
            'zcode' => ['label' => 'Z-code', 'extensions' => ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb']],
            'glulx' => ['label' => 'Glulx', 'extensions' => ['ulx', 'gblorb', 'glb', 'blorb']],
            'hugo' => ['label' => 'Hugo', 'extensions' => ['hex']],
            'tads' => ['label' => 'TADS 2 / TADS 3', 'extensions' => ['gam', 't3']],
            'adrift' => ['label' => 'ADRIFT 4', 'extensions' => ['taf']],
        ];
    }

    protected function admin2PageData(): array
    {
        $config = $this->pluginConfig();
        $games = array_map(function (GamePackage $game): array {
            $data = $game->toArray(true);
            $data['advisory_warnings'] = $game->advisoryWarnings();
            $data['provenance_rows'] = $game->provenanceRows();
            return $data;
        }, $this->repository()->all(true));

        return [
            'read_only' => true,
            'version' => '0.2.0',
            'manifest_url' => $this->publicRoute() . '/_manifest',
            'route' => $this->publicRoute(),
            'storage' => [
                'games_path' => (string)($config['storage']['games_path'] ?? 'user://data/terpvault/games'),
                'resolved_path' => $this->repository()->basePath(),
            ],
            'config' => [
                'show_unpublished' => $this->showUnpublished(),
                'admin2_enabled' => $this->admin2IntegrationEnabled(),
                'player_engine' => (string)($config['player']['engine'] ?? 'parchment'),
            ],
            'formats' => $this->supportedFormats(),
            'games' => $games,
        ];
    }

    protected function repository(): GameRepository
    {
        if (!$this->repository) {
            $this->repository = new GameRepository($this->grav, $this->pluginConfig());
        }

        return $this->repository;
    }

    protected function pluginConfig(): array
    {
        return (array) $this->config->get('plugins.terpvault');
    }

    public function twigGameFromRoute(): ?GamePackage
    {
        $route = $this->currentFrontendRoute();
        $base = $this->baseRoute();

        if (preg_match('#^' . preg_quote($base, '#') . '/([^/]+)(?:/play)?$#', $route, $matches)) {
            return $this->repository()->find(rawurldecode($matches[1]), $this->showUnpublished());
        }

        return null;
    }

    protected function baseRoute(): string
    {
        return '/' . trim((string)($this->pluginConfig()['route'] ?? '/if'), '/');
    }

    protected function publicRoute(): string
    {
        $route = $this->baseRoute();
        $baseUrl = rtrim((string)($this->grav['base_url'] ?? ''), '/');

        if ($baseUrl !== '' && strpos($route, $baseUrl . '/') !== 0 && $route !== $baseUrl) {
            return $baseUrl . $route;
        }

        return $route;
    }

    protected function showUnpublished(): bool
    {
        return (bool)($this->pluginConfig()['library']['show_unpublished'] ?? false);
    }

    protected function admin2IntegrationEnabled(): bool
    {
        return (bool)($this->pluginConfig()['admin']['enable_admin2_page'] ?? false);
    }

    protected function addVirtualPage(string $file, string $route): void
    {
        $page = new Page();
        $page->init(new \SplFileInfo($file));
        $page->route($route);
        $page->routable(true);
        $page->visible(false);

        $this->grav['pages']->addPage($page, $route);
    }

    protected function isFrontendRequest(): bool
    {
        return !$this->isAdminRouteRequest() && !$this->isAdminApiRequest();
    }

    protected function isAdminApiRequest(): bool
    {
        $adminRoute = '/' . trim((string)$this->config->get('plugins.admin.route', '/admin'), '/');
        $apiRoute = '/' . trim((string)$this->config->get('plugins.api.route', '/api'), '/');
        $route = $this->normalizedUriValue((string)$this->grav['uri']->route(), $apiRoute);
        $path = $this->normalizedUriValue((string)$this->grav['uri']->path(), $apiRoute);
        $adminApiRoute = $adminRoute . '/api';
        $adminRouteValue = $this->normalizedUriValue((string)$this->grav['uri']->route(), $adminApiRoute);
        $adminPathValue = $this->normalizedUriValue((string)$this->grav['uri']->path(), $adminApiRoute);

        return $route === $apiRoute
            || strpos($route, $apiRoute . '/') === 0
            || $path === $apiRoute
            || strpos($path, $apiRoute . '/') === 0
            || strpos($adminRouteValue, $adminApiRoute) === 0
            || strpos($adminPathValue, $adminApiRoute) === 0;
    }

    protected function isAdminRouteRequest(): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        $adminRoute = '/' . trim((string)$this->config->get('plugins.admin.route', '/admin'), '/');
        $route = $this->normalizedUriValue((string)$this->grav['uri']->route(), $adminRoute);
        $path = $this->normalizedUriValue((string)$this->grav['uri']->path(), $adminRoute);

        return $route === $adminRoute
            || strpos($route, $adminRoute . '/') === 0
            || $path === $adminRoute
            || strpos($path, $adminRoute . '/') === 0;
    }

    protected function currentFrontendRoute(): string
    {
        $base = $this->baseRoute();
        $route = $this->normalizedUriValue((string)$this->grav['uri']->route(), $base);

        if ($route === '/' || strpos($route, $base) !== 0) {
            $route = $this->normalizedUriValue((string)$this->grav['uri']->path(), $base);
        }

        return $route;
    }

    protected function normalizedUriValue(string $value, string $routePrefix = ''): string
    {
        $value = '/' . trim($value, '/');
        $baseUrlCandidates = array_filter(array_unique([
            rtrim((string)($this->grav['base_url'] ?? ''), '/'),
            parse_url((string)$this->grav['uri']->rootUrl(false), PHP_URL_PATH) ?: '',
            parse_url((string)$this->grav['uri']->rootUrl(true), PHP_URL_PATH) ?: '',
        ]));

        foreach ($baseUrlCandidates as $baseUrl) {
            $baseUrl = '/' . trim($baseUrl, '/');
            if ($baseUrl !== '/' && ($value === $baseUrl || strpos($value, $baseUrl . '/') === 0)) {
                $value = substr($value, strlen($baseUrl)) ?: '/';
                $value = '/' . trim($value, '/');
                break;
            }
        }

        $routePrefix = '/' . trim($routePrefix, '/');
        if ($routePrefix !== '/' && strpos($value, $routePrefix) !== 0) {
            $position = strpos($value, $routePrefix . '/');
            if ($position !== false) {
                $value = substr($value, $position);
            } elseif (substr($value, -strlen($routePrefix)) === $routePrefix) {
                $value = $routePrefix;
            }
        }

        return $value === '//' ? '/' : $value;
    }

    protected function serveStoryFile(string $slug): void
    {
        $game = $this->repository()->find($slug, $this->showUnpublished());
        if (!$game || !$game->storyPath()) {
            $this->serveStatus(404, 'Story file not found');
        }

        $path = $game->storyPath();
        if (!$this->repository()->allowedStoryExtension($path)) {
            $this->serveStatus(403, 'Story file type is not allowed');
        }

        $this->serveFile($path, 'application/octet-stream', basename($path));
    }

    protected function serveParchment(): void
    {
        $index = __DIR__ . '/assets/vendor/parchment/index.html';
        $placeholder = __DIR__ . '/assets/vendor/parchment/placeholder.html';

        $path = is_file($index) ? $index : $placeholder;
        if (!is_file($path)) {
            $this->serveStatus(404, 'Parchment adapter not found');
        }

        $this->serveFile($path, 'text/html; charset=utf-8');
    }

    protected function serveAsset(string $slug, string $asset): void
    {
        $game = $this->repository()->find($slug, $this->showUnpublished());
        if (!$game || !$asset) {
            $this->serveStatus(404, 'Asset not found');
        }

        $path = $game->assetPath($asset);
        if (!$path || !$this->repository()->allowedAssetExtension($path)) {
            $this->serveStatus(404, 'Asset not found');
        }

        $mime = $this->mimeType($path);
        $this->serveFile($path, $mime);
    }

    protected function serveFile(string $path, string $mime, ?string $filename = null): void
    {
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($path));
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, max-age=0, must-revalidate');
        if ($filename) {
            $safeFilename = str_replace(['"', "\r", "\n"], '', $filename);
            header('Content-Disposition: inline; filename="' . $safeFilename . '"');
        }
        readfile($path);
        exit;
    }

    protected function serveJson(array $data): void
    {
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    protected function serveStatus(int $status, string $message): void
    {
        http_response_code($status);
        header('Content-Type: text/plain; charset=utf-8');
        echo $message;
        exit;
    }

    protected function absoluteUrl(string $url): string
    {
        if (preg_match('#^https?://#', $url)) {
            return $url;
        }

        $url = '/' . ltrim($url, '/');
        $root = rtrim((string)$this->grav['uri']->rootUrl(true), '/');
        $baseUrl = rtrim((string)($this->grav['base_url'] ?? ''), '/');

        // GamePackage URLs already include Grav's base URL, for example
        // /quark2/if/_story/sample-cave/game.z5. Uri::rootUrl(true) may also
        // include /quark2 depending on the install and environment. Strip that
        // trailing base once to avoid /quark2/quark2 URLs inside Parchment.
        if ($baseUrl !== '' && strpos($url, $baseUrl . '/') === 0 && substr($root, -strlen($baseUrl)) === $baseUrl) {
            $root = substr($root, 0, -strlen($baseUrl));
            $root = rtrim($root, '/');
        }

        return $root . $url;
    }

    protected function mimeType(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $map = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'md' => 'text/markdown; charset=utf-8',
            'txt' => 'text/plain; charset=utf-8',
        ];

        return $map[$ext] ?? 'application/octet-stream';
    }
}
