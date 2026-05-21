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
 * v0.1.0 is a repo-ready foundation: package metadata, virtual library/detail/play
 * pages, controlled file serving, Twig helpers, shortcode-style embedding, and
 * Admin2 page registration scaffolding.
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

    public function onPluginsInitialized(): void
    {
        if (!$this->config->get('plugins.terpvault.enabled')) {
            return;
        }

        if ($this->isAdmin()) {
            $this->enable([
                'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
                'onApiSidebarItems' => ['onApiSidebarItems', 0],
                'onApiPluginPageInfo' => ['onApiPluginPageInfo', 0],
                'onApiRegisterRoutes' => ['onApiRegisterRoutes', 0],
            ]);
            return;
        }

        $this->enable([
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onTwigInitialized' => ['onTwigInitialized', 0],
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0],
            'onPagesInitialized' => ['onPagesInitialized', 0],
            'onPageContentProcessed' => ['onPageContentProcessed', 0],
        ]);
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
            'route' => $this->baseRoute(),
        ];
    }

    /**
     * Render virtual pages and safely serve package files/assets.
     */
    public function onPagesInitialized(): void
    {
        if (!$this->pluginConfig()['auto_routes']) {
            return;
        }

        $route = '/' . trim($this->grav['uri']->route(), '/');
        $base = $this->baseRoute();

        if ($route === $base . '/_manifest') {
            $this->serveJson(['games' => array_map(static function (GamePackage $game) {
                return $game->toArray();
            }, $this->repository()->all(true))]);
        }

        if (strpos($route, $base . '/_file/') === 0) {
            $slug = rawurldecode(substr($route, strlen($base . '/_file/')));
            $this->serveStoryFile($slug);
        }

        if (strpos($route, $base . '/_asset/') === 0) {
            $remaining = substr($route, strlen($base . '/_asset/'));
            [$slug, $asset] = array_pad(explode('/', $remaining, 2), 2, '');
            $this->serveAsset(rawurldecode($slug), rawurldecode($asset));
        }

        if ($route === $base) {
            $this->setVirtualPage(__DIR__ . '/pages/library.md');
            return;
        }

        if (preg_match('#^' . preg_quote($base, '#') . '/([^/]+)/play$#', $route, $matches)) {
            $game = $this->repository()->find(rawurldecode($matches[1]), $this->showUnpublished());
            if ($game) {
                $this->grav['twig']->twig_vars['terpvault_current_game'] = $game;
                $this->setVirtualPage(__DIR__ . '/pages/play.md');
            }
            return;
        }

        if (preg_match('#^' . preg_quote($base, '#') . '/([^/]+)$#', $route, $matches)) {
            $game = $this->repository()->find(rawurldecode($matches[1]), $this->showUnpublished());
            if ($game) {
                $this->grav['twig']->twig_vars['terpvault_current_game'] = $game;
                $this->setVirtualPage(__DIR__ . '/pages/detail.md');
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
        if (!$this->pluginConfig()['admin']['enable_admin2_page']) {
            return;
        }

        $user = $event['user'] ?? null;
        if ($user && method_exists($user, 'authorize') && !$user->authorize('admin.super')) {
            return;
        }

        $items = $event['items'] ?? [];
        $items[] = [
            'id' => 'terpvault',
            'plugin' => 'terpvault',
            'label' => 'TerpVault',
            'icon' => 'fa-book-reader',
            'route' => '/plugin/terpvault',
            'priority' => 5,
        ];
        $event['items'] = $items;
    }

    public function onApiPluginPageInfo(Event $event): void
    {
        if (($event['plugin'] ?? null) !== 'terpvault') {
            return;
        }

        $event['definition'] = [
            'id' => 'terpvault',
            'plugin' => 'terpvault',
            'title' => 'TerpVault',
            'icon' => 'fa-book-reader',
            'page_type' => 'component',
            'actions' => [],
        ];
    }

    /**
     * Admin2/API routes. Kept simple for v0.1.0: read-only endpoints the custom
     * Admin2 page can use without mutating files yet.
     */
    public function onApiRegisterRoutes(Event $event): void
    {
        $routes = $event['routes'] ?? null;
        if (!$routes) {
            return;
        }

        $routes->get('/terpvault/games', function () {
            return [
                'status' => 'success',
                'games' => array_map(static function (GamePackage $game) {
                    return $game->toArray();
                }, $this->repository()->all(true)),
            ];
        });

        $routes->get('/terpvault/games/{slug}', function ($slug) {
            $game = $this->repository()->find((string) $slug, true);
            if (!$game) {
                return ['status' => 'error', 'message' => 'Game not found'];
            }

            return ['status' => 'success', 'game' => $game->toArray()];
        });
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
        $storyUrl = $this->absoluteUrl($game->url('file'));
        $configured = trim((string)($config['player']['parchment_url'] ?? ''));

        if ($configured !== '') {
            return $configured . (strpos($configured, '?') === false ? '?' : '&') . 'story=' . rawurlencode($storyUrl);
        }

        $local = __DIR__ . '/assets/vendor/parchment/index.html';
        if (is_file($local)) {
            $base = $this->grav['base_url'] . '/user/plugins/terpvault/assets/vendor/parchment/index.html';
            return $base . '?story=' . rawurlencode($storyUrl);
        }

        return $this->grav['base_url'] . '/user/plugins/terpvault/assets/vendor/parchment/placeholder.html?story=' . rawurlencode($storyUrl);
    }

    public function twigRenderMarkdown(?string $file): string
    {
        if (!$file || !is_file($file)) {
            return '';
        }

        $markdown = file_get_contents($file) ?: '';
        return $this->grav['parsedown']->text($markdown);
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

    protected function baseRoute(): string
    {
        return '/' . trim((string)($this->pluginConfig()['route'] ?? '/if'), '/');
    }

    protected function showUnpublished(): bool
    {
        return (bool)($this->pluginConfig()['library']['show_unpublished'] ?? false);
    }

    protected function setVirtualPage(string $file): void
    {
        $page = new Page();
        $page->init(new \SplFileInfo($file));
        $page->routable(true);
        $page->visible(false);
        $this->grav['page'] = $page;
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

        $this->serveFile($path, 'application/octet-stream');
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

    protected function serveFile(string $path, string $mime): void
    {
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($path));
        header('X-Content-Type-Options: nosniff');
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

        $base = rtrim((string)$this->grav['uri']->rootUrl(true), '/');
        return $base . '/' . ltrim($url, '/');
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
