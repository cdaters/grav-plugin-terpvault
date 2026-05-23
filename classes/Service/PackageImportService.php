<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;
use ZipArchive;

class PackageImportService
{
    private const STORY_EXTENSIONS = [
        'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb',
        'ulx', 'gblorb', 'glb', 't3',
    ];

    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

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

    public function inspect(UploadedFileInterface $upload): array
    {
        $report = $this->emptyReport();
        if (!class_exists(ZipArchive::class)) {
            $report['fatal_errors'][] = 'PHP ZipArchive is required to inspect TerpVault package imports.';
            return $this->finalizeReport($report);
        }

        $stage = $this->stageDirectory();

        try {
            if ($upload->getError() !== UPLOAD_ERR_OK) {
                $report['fatal_errors'][] = 'Uploaded package zip is not available.';
                return $this->finalizeReport($report);
            }

            $clientName = (string) $upload->getClientFilename();
            if (!$this->looksLikeTerpVaultZip($clientName)) {
                $report['fatal_errors'][] = 'Uploaded file must use a .terpvault.zip filename.';
                return $this->finalizeReport($report);
            }

            $zipPath = $stage . DIRECTORY_SEPARATOR . 'package.terpvault.zip';
            try {
                $this->writeUpload($upload, $zipPath);
            } catch (RuntimeException $e) {
                $report['fatal_errors'][] = 'Uploaded package zip is not readable.';
                return $this->finalizeReport($report);
            }

            $zip = new ZipArchive();
            if ($zip->open($zipPath) !== true) {
                $report['fatal_errors'][] = 'Uploaded file is not a readable zip archive.';
                return $this->finalizeReport($report);
            }

            try {
                $this->inspectZip($zip, $report);
            } finally {
                $zip->close();
            }

            return $this->finalizeReport($report);
        } finally {
            $this->removeDirectory($stage);
        }
    }

    public function commit(UploadedFileInterface $upload, string $finalSlug): array
    {
        $finalSlug = $this->validateFinalSlug($finalSlug);
        $report = $this->emptyReport();
        if (!class_exists(ZipArchive::class)) {
            throw new RuntimeException('PHP ZipArchive is required to import TerpVault packages.');
        }

        $base = $this->basePath();
        $stage = $this->commitStageDirectory($base);

        try {
            if ($upload->getError() !== UPLOAD_ERR_OK) {
                throw new InvalidArgumentException('Uploaded package zip is not available.');
            }

            $clientName = (string) $upload->getClientFilename();
            if (!$this->looksLikeTerpVaultZip($clientName)) {
                throw new InvalidArgumentException('Uploaded file must use a .terpvault.zip filename.');
            }

            $destination = $base . DIRECTORY_SEPARATOR . $finalSlug;
            if (file_exists($destination)) {
                throw new InvalidArgumentException('Package folder already exists: ' . $finalSlug);
            }

            $zipPath = $stage . DIRECTORY_SEPARATOR . 'package.terpvault.zip';
            $this->writeUpload($upload, $zipPath);

            $zip = new ZipArchive();
            if ($zip->open($zipPath) !== true) {
                throw new InvalidArgumentException('Uploaded file is not a readable zip archive.');
            }

            try {
                $analysis = $this->inspectZip($zip, $report);
                $report = $this->finalizeReport($report);
                if (!$report['ok']) {
                    return [
                        'ok' => false,
                        'slug' => $finalSlug,
                        'fatal_errors' => $report['fatal_errors'],
                        'warnings' => $report['warnings'],
                        'report' => $report,
                    ];
                }

                if (file_exists($destination)) {
                    throw new InvalidArgumentException('Package folder already exists: ' . $finalSlug);
                }

                $packageStage = $stage . DIRECTORY_SEPARATOR . $finalSlug;
                if (!mkdir($packageStage, 0775, true) && !is_dir($packageStage)) {
                    throw new RuntimeException('Unable to create import package staging directory.');
                }

                $this->extractPackageFiles($zip, $analysis['entry_map'], $packageStage);
                $metadata = $analysis['metadata'];
                $this->forceDraftMetadata($metadata, $finalSlug);
                $this->writeTextAtomically($packageStage . DIRECTORY_SEPARATOR . 'game.yaml', $this->dumpYaml($metadata));

                $packageReal = realpath($packageStage);
                $stageReal = realpath($stage);
                if ($packageReal === false || $stageReal === false || !$this->isPathInside($packageReal, $stageReal)) {
                    throw new RuntimeException('Imported package staging path is invalid.');
                }

                $destinationParent = dirname($destination);
                $destinationParentReal = realpath($destinationParent);
                if ($destinationParentReal === false || $destinationParentReal !== $base) {
                    throw new RuntimeException('Import destination is outside the games directory.');
                }

                if (!rename($packageStage, $destination)) {
                    throw new RuntimeException('Unable to move imported package into the games directory.');
                }

                $destinationReal = realpath($destination);
                if ($destinationReal === false || !$this->isPathInside($destinationReal, $base)) {
                    if (is_dir($destination)) {
                        $this->removeDirectory($destination);
                    }
                    throw new RuntimeException('Imported package destination is outside the games directory.');
                }

                return [
                    'ok' => true,
                    'slug' => $finalSlug,
                    'package_path' => $destinationReal,
                    'metadata' => $metadata,
                    'report' => $report,
                    'draft_forced' => true,
                ];
            } finally {
                $zip->close();
            }
        } finally {
            $this->removeDirectory($stage);
        }
    }

    private function inspectZip(ZipArchive $zip, array &$report): array
    {
        $topFolders = [];
        $packageFiles = [];
        $entryMap = [];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = (string) $zip->getNameIndex($i);
            try {
                $normalized = $this->normalizeZipEntry($name);
            } catch (InvalidArgumentException $e) {
                $report['fatal_errors'][] = $e->getMessage() . ' Entry: ' . $name;
                continue;
            }

            if ($this->isCruftEntry($normalized)) {
                $report['ignored_files'][] = $normalized;
                continue;
            }

            $parts = explode('/', $normalized, 2);
            if (count($parts) === 1 && substr(str_replace('\\', '/', $name), -1) === '/') {
                $topFolders[$parts[0]] = true;
                continue;
            }

            if (count($parts) < 2 || $parts[1] === '') {
                $report['fatal_errors'][] = 'Archive entries must be inside one top-level package folder. Entry: ' . $name;
                continue;
            }

            $topFolders[$parts[0]] = true;
            if (substr(str_replace('\\', '/', $name), -1) === '/') {
                continue;
            }

            try {
                $relative = $this->normalizePackagePath($parts[1], 'Package file path');
            } catch (InvalidArgumentException $e) {
                $report['fatal_errors'][] = $e->getMessage() . ' Entry: ' . $name;
                continue;
            }

            $packageFiles[$relative] = true;
            $entryMap[$relative] = $normalized;
        }

        $folders = array_keys($topFolders);
        if (count($folders) !== 1) {
            $report['fatal_errors'][] = count($folders) === 0
                ? 'Archive does not contain a top-level package folder.'
                : 'Archive must contain exactly one top-level package folder.';
            return ['entry_map' => $entryMap, 'metadata' => []];
        }

        sort($report['ignored_files']);
        $report['top_folder'] = $folders[0];
        $report['included_files'] = array_keys($packageFiles);
        sort($report['included_files']);

        if (!isset($entryMap['game.yaml'])) {
            $report['fatal_errors'][] = 'Package game.yaml is required.';
            return ['entry_map' => $entryMap, 'metadata' => []];
        }

        $yamlText = $zip->getFromName($entryMap['game.yaml']);
        if (!is_string($yamlText)) {
            $report['fatal_errors'][] = 'Unable to read package game.yaml.';
            return ['entry_map' => $entryMap, 'metadata' => []];
        }

        try {
            $metadata = Yaml::parse($yamlText) ?: [];
        } catch (\Throwable $e) {
            $report['fatal_errors'][] = 'Unable to parse package game.yaml: ' . $e->getMessage();
            return ['entry_map' => $entryMap, 'metadata' => []];
        }

        if (!is_array($metadata)) {
            $report['fatal_errors'][] = 'Invalid game.yaml structure.';
            return ['entry_map' => $entryMap, 'metadata' => []];
        }

        $this->inspectMetadata($metadata, $packageFiles, $report);

        return [
            'entry_map' => $entryMap,
            'metadata' => $metadata,
        ];
    }

    private function inspectMetadata(array $metadata, array $packageFiles, array &$report): void
    {
        $resources = is_array($metadata['resources'] ?? null) ? $metadata['resources'] : [];
        $report['yaml_slug'] = isset($metadata['slug']) ? (string) $metadata['slug'] : '';
        $report['candidate_slug'] = $this->candidateSlug($report['top_folder'], $report['yaml_slug']);
        $report['title'] = (string)($metadata['bibliographic']['title'] ?? $metadata['title'] ?? '');
        $report['author'] = (string)($metadata['bibliographic']['author'] ?? $metadata['author'] ?? '');
        $report['has_ifiction'] = isset($packageFiles['metadata.iFiction.xml']);

        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $report['candidate_slug'])) {
            $report['fatal_errors'][] = 'Invalid candidate package slug.';
        }

        $report['destination_exists'] = $this->destinationExists($report['candidate_slug']);
        $report['has_collision'] = $report['destination_exists'];
        if ($report['has_collision']) {
            $report['warnings'][] = 'A package folder already exists for the candidate slug. Future import commit will require a new slug.';
        }

        $storyFile = isset($resources['story_file']) ? (string) $resources['story_file'] : '';
        $report['story_file'] = $storyFile;
        if ($storyFile === '') {
            $report['fatal_errors'][] = 'resources.story_file is required.';
        } else {
            try {
                $storyFile = $this->normalizePackagePath($storyFile, 'Story file path');
                $report['story_file'] = $storyFile;
                $report['story_extension'] = strtolower(pathinfo($storyFile, PATHINFO_EXTENSION));
                if (!in_array($report['story_extension'], self::STORY_EXTENSIONS, true)) {
                    $report['fatal_errors'][] = 'resources.story_file uses an unsupported story extension.';
                }
                if (!isset($packageFiles[$storyFile])) {
                    $report['fatal_errors'][] = 'resources.story_file does not exist in the zip package.';
                }
            } catch (InvalidArgumentException $e) {
                $report['fatal_errors'][] = $e->getMessage();
            }
        }

        foreach (['how_to_play', 'hints', 'walkthrough'] as $key) {
            $relative = isset($resources[$key]) ? (string) $resources[$key] : '';
            if ($relative === '') {
                continue;
            }
            try {
                $relative = $this->normalizePackagePath($relative, 'Helper Markdown path');
                if (strtolower(pathinfo($relative, PATHINFO_EXTENSION)) !== 'md') {
                    $report['fatal_errors'][] = 'resources.' . $key . ' must reference a .md file.';
                    continue;
                }
                if (!isset($packageFiles[$relative])) {
                    $report['warnings'][] = 'Referenced helper Markdown file is missing: ' . $relative;
                }
            } catch (InvalidArgumentException $e) {
                $report['fatal_errors'][] = $e->getMessage();
            }
        }

        foreach (['cover', 'small_cover'] as $key) {
            $relative = isset($resources[$key]) ? (string) $resources[$key] : '';
            if ($relative === '') {
                continue;
            }
            $this->inspectMediaReference($relative, 'resources.' . $key, $packageFiles, $report);
        }

        $screenshots = is_array($resources['screenshots'] ?? null) ? $resources['screenshots'] : [];
        foreach ($screenshots as $screenshot) {
            $this->inspectMediaReference((string) $screenshot, 'resources.screenshots', $packageFiles, $report);
        }

        if (!$report['has_ifiction']) {
            $report['warnings'][] = 'metadata.iFiction.xml is not present.';
        }

        $report['warnings'][] = 'Future import commit should force imported packages to draft status for review.';
        $report['package_summary'] = [
            'candidate_slug' => $report['candidate_slug'],
            'title' => $report['title'],
            'author' => $report['author'],
            'story_file' => $report['story_file'],
            'story_extension' => $report['story_extension'],
            'file_count' => count($report['included_files']),
        ];
    }

    private function inspectMediaReference(string $relative, string $field, array $packageFiles, array &$report): void
    {
        if ($relative === '') {
            return;
        }

        try {
            $relative = $this->normalizePackagePath($relative, 'Media path');
            if (!in_array(strtolower(pathinfo($relative, PATHINFO_EXTENSION)), self::IMAGE_EXTENSIONS, true)) {
                $report['fatal_errors'][] = $field . ' must reference a jpg, jpeg, png, or webp file.';
                return;
            }
            if (!isset($packageFiles[$relative])) {
                $report['warnings'][] = 'Referenced media file is missing: ' . $relative;
            }
        } catch (InvalidArgumentException $e) {
            $report['fatal_errors'][] = $e->getMessage();
        }
    }

    private function extractPackageFiles(ZipArchive $zip, array $entryMap, string $packageStage): void
    {
        foreach ($entryMap as $relative => $zipEntry) {
            if ($relative === 'game.yaml') {
                continue;
            }

            $target = $this->resolveStagedPackageFile($packageStage, $relative);
            $dir = dirname($target);
            if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
                throw new RuntimeException('Unable to create import staging directory.');
            }

            $contents = $zip->getFromName($zipEntry);
            if (!is_string($contents)) {
                throw new RuntimeException('Unable to read zip entry during import: ' . $zipEntry);
            }

            if (file_put_contents($target, $contents) === false) {
                throw new RuntimeException('Unable to write imported package file: ' . $relative);
            }
        }
    }

    private function resolveStagedPackageFile(string $packageStage, string $relative): string
    {
        $relative = $this->normalizePackagePath($relative, 'Package file path');
        $target = $packageStage . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create import staging directory.');
        }

        $dirReal = realpath($dir);
        $stageReal = realpath($packageStage);
        if ($dirReal === false || $stageReal === false || !$this->isPathInside($dirReal, $stageReal)) {
            throw new InvalidArgumentException('Package file path is outside the import staging directory.');
        }

        return $target;
    }

    private function forceDraftMetadata(array &$metadata, string $finalSlug): void
    {
        $metadata['id'] = $finalSlug;
        $metadata['slug'] = $finalSlug;
        if (!isset($metadata['terpvault']) || !is_array($metadata['terpvault'])) {
            $metadata['terpvault'] = [];
        }
        $metadata['terpvault']['status'] = 'draft';
        $metadata['terpvault']['featured'] = false;

        $this->normalizeEmptyListField($metadata, ['identification', 'ifids']);
        $this->normalizeEmptyListField($metadata, ['resources', 'screenshots']);
        $this->normalizeEmptyListField($metadata, ['terpvault', 'tags']);
    }

    private function normalizeEmptyListField(array &$metadata, array $path): void
    {
        $target =& $metadata;
        $last = array_pop($path);
        foreach ($path as $segment) {
            if (!array_key_exists($segment, $target)) {
                return;
            }
            if (!is_array($target[$segment])) {
                return;
            }
            $target =& $target[$segment];
        }

        if (!array_key_exists($last, $target)) {
            return;
        }

        if ($target[$last] === null || $target[$last] === '') {
            $target[$last] = [];
            return;
        }

        if (is_array($target[$last]) && count($target[$last]) === 0) {
            $target[$last] = [];
        }
    }

    private function validateFinalSlug(string $slug): string
    {
        if (strpos($slug, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $slug)) {
            throw new InvalidArgumentException('Invalid final import slug.');
        }

        $slug = trim($slug);
        if ($slug === '' || $slug[0] === '/' || preg_match('/^[A-Za-z]:[\/\\\\]/', $slug) || strpos($slug, '/') !== false || strpos($slug, '\\') !== false) {
            throw new InvalidArgumentException('Invalid final import slug.');
        }

        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('Invalid final import slug.');
        }

        return $slug;
    }

    private function candidateSlug(string $topFolder, string $yamlSlug): string
    {
        $topFolder = trim($topFolder);
        if ($topFolder !== '') {
            return $topFolder;
        }

        return trim($yamlSlug);
    }

    private function destinationExists(string $slug): bool
    {
        if ($slug === '' || !preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug) || $this->basePath === '' || !is_dir($this->basePath)) {
            return false;
        }

        $base = realpath($this->basePath);
        if ($base === false) {
            return false;
        }

        $destination = $this->basePath . DIRECTORY_SEPARATOR . $slug;
        if (!file_exists($destination)) {
            return false;
        }

        $destinationReal = realpath($destination);
        return $destinationReal !== false && $this->isPathInside($destinationReal, $base);
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

    private function normalizeZipEntry(string $path): string
    {
        return $this->normalizePath($path, 'Invalid zip entry path');
    }

    private function normalizePackagePath(string $path, string $label): string
    {
        return $this->normalizePath($path, $label);
    }

    private function normalizePath(string $path, string $label): string
    {
        if (strpos($path, "\0") !== false || preg_match('#^[a-z][a-z0-9+.-]*://#i', $path)) {
            throw new InvalidArgumentException($label . ' is invalid.');
        }

        $path = str_replace('\\', '/', trim($path));
        if ($path === '' || $path[0] === '/' || preg_match('/^[A-Za-z]:\//', $path)) {
            throw new InvalidArgumentException($label . ' is invalid.');
        }

        $segments = array_values(array_filter(explode('/', $path), static function (string $segment): bool {
            return $segment !== '';
        }));

        if (!$segments) {
            throw new InvalidArgumentException($label . ' is empty after normalization.');
        }

        foreach ($segments as $segment) {
            if ($segment === '.' || $segment === '..') {
                throw new InvalidArgumentException($label . ' cannot contain traversal segments.');
            }
        }

        return implode('/', $segments);
    }

    private function isCruftEntry(string $path): bool
    {
        $segments = explode('/', $path);

        foreach ($segments as $segment) {
            if ($segment === '__MACOSX' || $segment === '.DS_Store' || $segment === 'Thumbs.db' || $segment === 'desktop.ini') {
                return true;
            }
            if (strpos($segment, '._') === 0) {
                return true;
            }
        }

        return false;
    }

    private function writeUpload(UploadedFileInterface $upload, string $target): void
    {
        $stream = $upload->getStream();
        if ($stream->isSeekable()) {
            $stream->rewind();
        }

        if (file_put_contents($target, (string) $stream) === false) {
            throw new RuntimeException('Unable to stage uploaded package zip.');
        }
    }

    private function writeTextAtomically(string $target, string $content): void
    {
        $dir = dirname($target);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create import staging directory.');
        }

        $temp = $dir . DIRECTORY_SEPARATOR . '.' . basename($target) . '.tmp-' . bin2hex(random_bytes(8));
        if (file_put_contents($temp, $content) === false) {
            throw new RuntimeException('Unable to write imported package metadata.');
        }

        if (!rename($temp, $target)) {
            @unlink($temp);
            throw new RuntimeException('Unable to replace imported package metadata.');
        }
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

    private function stageDirectory(): string
    {
        $base = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'terpvault-import-' . bin2hex(random_bytes(8));
        if (!mkdir($base, 0775, true) && !is_dir($base)) {
            throw new RuntimeException('Unable to create import inspection staging directory.');
        }

        return $base;
    }

    private function commitStageDirectory(string $gamesBase): string
    {
        $gamesBase = rtrim($gamesBase, DIRECTORY_SEPARATOR);
        $storageRoot = dirname($gamesBase);
        $storageRootReal = realpath($storageRoot);
        if ($storageRootReal === false) {
            throw new RuntimeException('Unable to resolve TerpVault storage directory.');
        }

        $stagingRoot = $storageRootReal . DIRECTORY_SEPARATOR . '.import-staging';
        if (!is_dir($stagingRoot) && !mkdir($stagingRoot, 0775, true) && !is_dir($stagingRoot)) {
            throw new RuntimeException('Unable to create import staging root.');
        }

        $stagingRootReal = realpath($stagingRoot);
        if ($stagingRootReal === false || !$this->isPathInside($stagingRootReal, $storageRootReal)) {
            throw new RuntimeException('Import staging root is outside the TerpVault storage directory.');
        }

        $stage = $stagingRootReal . DIRECTORY_SEPARATOR . 'import-' . bin2hex(random_bytes(8));
        if (!mkdir($stage, 0775, true) && !is_dir($stage)) {
            throw new RuntimeException('Unable to create import staging directory.');
        }

        $stageReal = realpath($stage);
        if ($stageReal === false || !$this->isPathInside($stageReal, $stagingRootReal)) {
            throw new RuntimeException('Import staging directory is outside the staging root.');
        }

        return $stageReal;
    }

    private function removeDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $items = scandir($dir);
        if ($items === false) {
            return;
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $this->removeDirectory($path);
            } else {
                @unlink($path);
            }
        }

        @rmdir($dir);
    }

    private function looksLikeTerpVaultZip(string $name): bool
    {
        return (bool) preg_match('/\.terpvault\.zip$/i', $name);
    }

    private function emptyReport(): array
    {
        return [
            'ok' => false,
            'fatal_errors' => [],
            'warnings' => [],
            'ignored_files' => [],
            'included_files' => [],
            'candidate_slug' => '',
            'yaml_slug' => '',
            'top_folder' => '',
            'title' => '',
            'author' => '',
            'story_file' => '',
            'story_extension' => '',
            'has_collision' => false,
            'destination_exists' => false,
            'has_ifiction' => false,
            'package_summary' => [],
        ];
    }

    private function finalizeReport(array $report): array
    {
        $report['fatal_errors'] = array_values(array_unique(array_map('strval', $report['fatal_errors'])));
        $report['warnings'] = array_values(array_unique(array_map('strval', $report['warnings'])));
        $report['ignored_files'] = array_values(array_unique(array_map('strval', $report['ignored_files'])));
        $report['included_files'] = array_values(array_unique(array_map('strval', $report['included_files'])));
        sort($report['ignored_files']);
        sort($report['included_files']);
        $report['ok'] = count($report['fatal_errors']) === 0;

        return $report;
    }

    private function isPathInside(string $path, string $base): bool
    {
        $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos(rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, $base) === 0;
    }
}
