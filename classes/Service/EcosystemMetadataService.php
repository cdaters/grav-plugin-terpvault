<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use InvalidArgumentException;

class EcosystemMetadataService
{
    private const IFARCHIVE_BASE_URL = 'https://ifarchive.org/if-archive/';
    private const IFDB_CANONICAL_BASE_URL = 'https://ifdb.org/viewgame?id=';
    private const IFDB_JSON_BASE_URL = 'https://ifdb.org/viewgame?json&id=';
    private const IFDB_DESCRIPTION_LIMIT = 700;

    private const REFERENCE_FIELDS = [
        'ifwiki_url' => 'IFWiki URL',
        'source_url' => 'Source / package URL',
        'upstream_source_url' => 'Upstream source URL',
        'port_repository_url' => 'Port/source repository URL',
        'license_url' => 'License URL',
    ];

    /** @var callable|null */
    private $httpFetcher;

    public function __construct(?callable $httpFetcher = null)
    {
        $this->httpFetcher = $httpFetcher;
    }

    public function preview(array $inputs): array
    {
        $warnings = [
            'Reference only.',
            'Curator review required.',
            'IFDB metadata does not prove redistribution rights.',
            'URL presence does not prove redistribution rights.',
        ];
        $errors = [];
        $metadata = [];
        $ifArchivePath = $this->stringInput($inputs, 'ifarchive_path');
        $ifArchiveUrl = $this->stringInput($inputs, 'ifarchive_url') ?: $this->stringInput($inputs, 'ifarchive');
        $ifdbTuidInput = $this->stringInput($inputs, 'ifdb_tuid');
        $ifdbUrlInput = $this->stringInput($inputs, 'ifdb_url') ?: $this->stringInput($inputs, 'ifdb');
        $ifdbInput = $ifdbTuidInput ?: $ifdbUrlInput;
        $hasInput = $ifArchivePath !== '' || $ifArchiveUrl !== '' || $ifdbInput !== '';

        $ifArchive = [
            'ok' => true,
            'path' => '',
            'url' => '',
            'warnings' => [],
            'errors' => [],
        ];

        $references = [];
        foreach (self::REFERENCE_FIELDS as $field => $label) {
            $value = $this->stringInput($inputs, $field);
            if ($value === '') {
                continue;
            }

            $hasInput = true;
            $referenceWarnings = $this->referenceWarnings($value, $label);
            $warnings = array_merge($warnings, $referenceWarnings);
            $references[$field] = [
                'label' => $label,
                'value' => $value,
                'lookup_implemented' => false,
                'status' => 'stored/reference only',
            ];
        }

        if ($ifArchivePath !== '' || $ifArchiveUrl !== '') {
            $ifArchive = $this->normalizeIFArchiveReference($ifArchivePath, $ifArchiveUrl);

            $warnings = array_merge($warnings, $ifArchive['warnings']);
            $errors = array_merge($errors, $ifArchive['errors']);
            if ($ifArchive['path'] !== '' || $ifArchive['url'] !== '') {
                $metadata['catalog'] = [
                    'ifarchive' => [
                        'path' => $ifArchive['path'],
                        'url' => $ifArchive['url'],
                    ],
                ];
            }
        }

        $ifdb = $this->emptyIFDBPreview();
        if ($ifdbInput !== '') {
            if ($ifdbTuidInput !== '' && $ifdbUrlInput !== '') {
                $ifdb = $this->ifdbMismatchPreview($ifdbTuidInput, $ifdbUrlInput);
                if (!$ifdb['errors']) {
                    $ifdb = $this->previewIFDB($ifdbTuidInput);
                }
            } else {
                $ifdb = $this->previewIFDB($ifdbInput);
            }
            $warnings = array_merge($warnings, $ifdb['warnings']);
            $errors = array_merge($errors, $ifdb['errors']);
            if ($ifdb['tuid'] !== '' || $ifdb['url'] !== '') {
                $metadata['catalog']['ifdb'] = [
                    'tuid' => $ifdb['tuid'],
                    'url' => $ifdb['url'],
                ];
            }
        }

        if (!$hasInput) {
            $errors[] = 'Enter at least one ecosystem reference before previewing metadata.';
        }

        return [
            'ok' => count($errors) === 0,
            'source' => 'Terpwright ecosystem metadata preview',
            'reference_only' => true,
            'curator_review_required' => true,
            'rights_notice' => 'URL presence does not prove redistribution rights.',
            'metadata' => $metadata,
            'ifarchive' => $ifArchive,
            'ifdb' => $ifdb,
            'references' => $references,
            'warnings' => array_values(array_unique($warnings)),
            'errors' => $errors,
            'writes' => false,
            'remote_fetches' => (bool)($ifdb['remote_fetches'] ?? false),
        ];
    }

    private function ifdbMismatchPreview(string $tuid, string $url): array
    {
        $preview = $this->emptyIFDBPreview();
        $tuidResult = $this->normalizeIFDBReference($tuid);
        $urlResult = $this->normalizeIFDBReference($url);
        $preview['warnings'] = array_values(array_unique(array_merge($tuidResult['warnings'], $urlResult['warnings'])));
        $preview['errors'] = array_merge($tuidResult['errors'], $urlResult['errors']);
        if (!$preview['errors'] && $tuidResult['tuid'] !== $urlResult['tuid']) {
            $preview['errors'][] = 'IFDB TUID and URL point to different IFDB listings.';
        }
        $preview['ok'] = !$preview['errors'];
        if ($preview['ok']) {
            $preview['tuid'] = $tuidResult['tuid'];
            $preview['url'] = $tuidResult['url'];
        }

        return $preview;
    }

    public function requireIFDBMetadata(string $tuid, string $url): array
    {
        if (trim($tuid) === '' && trim($url) === '') {
            return [
                'tuid' => '',
                'url' => '',
            ];
        }

        $result = $this->normalizeIFDBReference(trim($tuid) !== '' ? $tuid : $url);
        if (trim($tuid) !== '' && trim($url) !== '') {
            $urlResult = $this->normalizeIFDBReference($url);
            if ($urlResult['errors']) {
                throw new InvalidArgumentException(implode(' ', $urlResult['errors']));
            }
            if ($result['tuid'] !== '' && $urlResult['tuid'] !== '' && $result['tuid'] !== $urlResult['tuid']) {
                throw new InvalidArgumentException('IFDB TUID and URL point to different IFDB listings.');
            }
        }
        if ($result['errors']) {
            throw new InvalidArgumentException(implode(' ', $result['errors']));
        }

        return [
            'tuid' => $result['tuid'],
            'url' => $result['url'],
        ];
    }

    public function requireIFArchiveMetadata(string $path, string $url): array
    {
        if (trim($path) === '' && trim($url) === '') {
            return [
                'path' => '',
                'url' => '',
            ];
        }

        $result = $this->normalizeIFArchiveReference($path, $url);
        if ($result['errors']) {
            throw new InvalidArgumentException(implode(' ', $result['errors']));
        }

        return [
            'path' => $result['path'],
            'url' => $result['url'],
        ];
    }

    public function normalizeIFArchiveReference(string $path, string $url): array
    {
        $warnings = [
            'IF Archive references are metadata only; TerpVault did not download or verify the file.',
            'Do not treat an IF Archive URL as license or redistribution approval.',
        ];
        $errors = [];
        $path = trim($path);
        $url = trim($url);
        $pathCandidate = '';
        $urlCandidate = '';

        if ($path === '' && $url === '') {
            return [
                'ok' => false,
                'path' => '',
                'url' => '',
                'warnings' => $warnings,
                'errors' => ['Enter an IF Archive URL or path before previewing IF Archive metadata.'],
            ];
        }

        if ($url !== '') {
            $fromUrl = $this->pathFromIFArchiveUrl($url);
            if ($fromUrl['error'] !== '') {
                $errors[] = $fromUrl['error'];
            } else {
                $pathCandidate = $fromUrl['path'];
                if ($fromUrl['warning'] !== '') {
                    $warnings[] = $fromUrl['warning'];
                }
            }
        }

        if ($path !== '') {
            $fromPath = $this->normalizeIFArchivePath($path);
            if ($fromPath['error'] !== '') {
                $errors[] = $fromPath['error'];
            } elseif ($pathCandidate !== '' && $fromPath['path'] !== $pathCandidate) {
                $errors[] = 'IF Archive path and URL point to different archive paths.';
            } else {
                $pathCandidate = $fromPath['path'];
            }
        }

        if ($pathCandidate !== '') {
            $urlCandidate = self::IFARCHIVE_BASE_URL . $this->encodePath($pathCandidate);
        }

        return [
            'ok' => count($errors) === 0,
            'path' => count($errors) === 0 ? $pathCandidate : '',
            'url' => count($errors) === 0 ? $urlCandidate : '',
            'warnings' => array_values(array_unique($warnings)),
            'errors' => $errors,
        ];
    }

    public function normalizeIFDBReference(string $input): array
    {
        $input = trim($input);
        $warnings = [
            'IFDB is catalog/reference metadata only; TerpVault did not download story files or assets.',
            'IFDB metadata does not prove redistribution rights.',
        ];
        $errors = [];

        if ($input === '') {
            return [
                'ok' => false,
                'tuid' => '',
                'url' => '',
                'warnings' => $warnings,
                'errors' => ['Enter an IFDB TUID or IFDB URL before previewing IFDB metadata.'],
            ];
        }

        if (preg_match('/[\x00-\x1F\x7F]/', $input) || strpos($input, '\\') !== false) {
            return [
                'ok' => false,
                'tuid' => '',
                'url' => '',
                'warnings' => $warnings,
                'errors' => ['IFDB input contains unsafe characters.'],
            ];
        }

        $tuid = '';
        if (preg_match('#^([a-z][a-z0-9+.-]*):#i', $input, $schemeMatch)) {
            $scheme = strtolower($schemeMatch[1]);
            if (!in_array($scheme, ['http', 'https'], true)) {
                $errors[] = 'IFDB URL uses an unsafe or unsupported scheme.';
            } elseif (!preg_match('#^https?://#i', $input)) {
                $errors[] = 'IFDB URL is malformed.';
            } else {
                $fromUrl = $this->tuidFromIFDBUrl($input);
                $tuid = $fromUrl['tuid'];
                $errors = array_merge($errors, $fromUrl['errors']);
                $warnings = array_merge($warnings, $fromUrl['warnings']);
            }
        } elseif (strpos($input, '/') !== false || strpos($input, '?') !== false || strpos($input, '#') !== false || strpos($input, ':') !== false) {
            $errors[] = 'IFDB TUID must be a plain alphanumeric id or a full https://ifdb.org/viewgame?id=... URL.';
        } elseif (!$this->isPlausibleTuid($input)) {
            $errors[] = 'IFDB TUID shape is not plausible.';
        } else {
            $tuid = strtolower($input);
        }

        $url = $tuid !== '' ? self::IFDB_CANONICAL_BASE_URL . rawurlencode($tuid) : '';

        return [
            'ok' => count($errors) === 0,
            'tuid' => count($errors) === 0 ? $tuid : '',
            'url' => count($errors) === 0 ? $url : '',
            'warnings' => array_values(array_unique($warnings)),
            'errors' => $errors,
        ];
    }

    private function previewIFDB(string $input): array
    {
        $normalized = $this->normalizeIFDBReference($input);
        $preview = $this->emptyIFDBPreview();
        $preview['ok'] = $normalized['ok'];
        $preview['tuid'] = $normalized['tuid'];
        $preview['url'] = $normalized['url'];
        $preview['warnings'] = $normalized['warnings'];
        $preview['errors'] = $normalized['errors'];

        if (!$normalized['ok'] || $normalized['tuid'] === '') {
            return $preview;
        }

        $apiUrl = self::IFDB_JSON_BASE_URL . rawurlencode($normalized['tuid']);
        $preview['api_url'] = $apiUrl;
        $preview['remote_fetches'] = true;
        $preview['sources'][] = [
            'label' => 'IFDB viewgame JSON API',
            'url' => $apiUrl,
            'type' => 'official-api',
        ];
        $preview['sources'][] = [
            'label' => 'IFDB listing page',
            'url' => $normalized['url'],
            'type' => 'catalog-page',
        ];

        try {
            $fetched = $this->fetchUrl($apiUrl);
            if (!$fetched['ok']) {
                $preview['ok'] = false;
                $preview['warnings'][] = $fetched['error'] ?: 'IFDB lookup failed.';
                return $preview;
            }

            $decoded = json_decode($fetched['body'], true);
            if (!is_array($decoded)) {
                $preview['ok'] = false;
                $preview['warnings'][] = 'IFDB returned a response that could not be parsed as JSON.';
                return $preview;
            }

            if (isset($decoded['errorCode']) || isset($decoded['errorMessage'])) {
                $preview['ok'] = false;
                $preview['warnings'][] = trim((string)($decoded['errorMessage'] ?? $decoded['errorCode'] ?? 'IFDB returned an error.'));
                return $preview;
            }

            $extracted = $this->fieldsFromIFDBJson($decoded, $normalized['tuid'], $normalized['url']);
            $preview['fields'] = $extracted['fields'];
            $preview['tags'] = $extracted['tags'];
            $preview['downloads_reference_only'] = $extracted['downloads_reference_only'];
            $preview['raw_summary'] = $extracted['raw_summary'];
            if (!$preview['fields']) {
                $preview['warnings'][] = 'IFDB lookup succeeded, but no supported metadata fields were present.';
            }
        } catch (\Throwable $e) {
            $preview['ok'] = false;
            $preview['warnings'][] = 'IFDB lookup failed without writing package files: ' . $e->getMessage();
        }

        $preview['warnings'] = array_values(array_unique($preview['warnings']));
        return $preview;
    }

    private function fieldsFromIFDBJson(array $data, string $fallbackTuid, string $fallbackUrl): array
    {
        $bibliographic = is_array($data['bibliographic'] ?? null) ? $data['bibliographic'] : [];
        $identification = is_array($data['identification'] ?? null) ? $data['identification'] : [];
        $ifdb = is_array($data['ifdb'] ?? null) ? $data['ifdb'] : [];
        $fields = [];

        $tuid = $this->cleanScalar($ifdb['tuid'] ?? $fallbackTuid);
        $link = $this->cleanScalar($ifdb['link'] ?? $fallbackUrl);
        if ($tuid !== '' && $this->isPlausibleTuid($tuid)) {
            $fields[] = $this->field('catalog.ifdb.tuid', 'IFDB TUID', strtolower($tuid), 'catalog');
        }
        if ($link !== '') {
            $normalizedLink = $this->normalizeIFDBReference($link);
            $fields[] = $this->field('catalog.ifdb.url', 'IFDB URL', $normalizedLink['url'] ?: $fallbackUrl, 'catalog');
        } else {
            $fields[] = $this->field('catalog.ifdb.url', 'IFDB URL', $fallbackUrl, 'catalog');
        }

        $this->appendTextField($fields, 'bibliographic.title', 'Title', $bibliographic['title'] ?? null, 'bibliographic');
        $this->appendTextField($fields, 'bibliographic.author', 'Author', $bibliographic['author'] ?? null, 'bibliographic');
        $this->appendTextField($fields, 'bibliographic.first_published', 'First published', $bibliographic['firstpublished'] ?? null, 'bibliographic');
        $this->appendTextField($fields, 'bibliographic.genre', 'Genre', $bibliographic['genre'] ?? null, 'bibliographic');
        $this->appendTextField($fields, 'bibliographic.language', 'Language', $bibliographic['language'] ?? null, 'bibliographic');

        $description = $this->htmlToConciseText($this->cleanScalar($bibliographic['description'] ?? ''));
        if ($description !== '') {
            $fields[] = $this->field('bibliographic.description', 'Description', $description, 'bibliographic');
        }

        $ifids = [];
        if (is_array($identification['ifids'] ?? null)) {
            foreach ($identification['ifids'] as $ifid) {
                $clean = $this->cleanScalar($ifid);
                if ($clean !== '') {
                    $ifids[] = $clean;
                }
            }
        }
        if ($ifids) {
            $fields[] = $this->field('identification.ifids', 'IFIDs', array_values(array_unique($ifids)), 'identification');
        }

        $this->appendTextField($fields, 'identification.format', 'Format', $identification['format'] ?? null, 'identification');

        $tags = [];
        if (is_array($ifdb['tags'] ?? null)) {
            foreach ($ifdb['tags'] as $tag) {
                $name = is_array($tag) ? $this->cleanScalar($tag['name'] ?? '') : $this->cleanScalar($tag);
                if ($name !== '' && count($tags) < 12) {
                    $tags[] = $name;
                }
            }
        }
        $tags = array_values(array_unique($tags));
        if ($tags) {
            $fields[] = $this->field('tags', 'Tags', $tags, 'discovery');
        }

        return [
            'fields' => $fields,
            'tags' => $tags,
            'downloads_reference_only' => $this->downloadReferences($ifdb),
            'raw_summary' => [
                'pageversion' => $ifdb['pageversion'] ?? null,
                'play_time_minutes' => $ifdb['playTimeInMinutes'] ?? null,
                'rating_count_total' => $ifdb['ratingCountTot'] ?? null,
            ],
        ];
    }

    private function downloadReferences(array $ifdb): array
    {
        $links = $ifdb['downloads']['links'] ?? null;
        if (!is_array($links)) {
            return [];
        }

        $references = [];
        foreach ($links as $link) {
            if (!is_array($link) || count($references) >= 8) {
                continue;
            }
            $url = $this->cleanScalar($link['url'] ?? '');
            if ($url === '') {
                continue;
            }
            $references[] = [
                'title' => $this->cleanScalar($link['title'] ?? 'Download reference'),
                'url' => $url,
                'format' => $this->cleanScalar($link['format'] ?? ''),
                'is_game' => (bool)($link['isGame'] ?? false),
                'status' => 'reference only; not downloaded',
            ];
        }

        return $references;
    }

    private function appendTextField(array &$fields, string $path, string $label, $value, string $group): void
    {
        $clean = $this->cleanScalar($value);
        if ($clean === '') {
            return;
        }

        $fields[] = $this->field($path, $label, $clean, $group);
    }

    private function field(string $path, string $label, $value, string $group): array
    {
        return [
            'path' => $path,
            'label' => $label,
            'value' => $value,
            'group' => $group,
            'source' => 'IFDB viewgame JSON API',
            'apply' => false,
        ];
    }

    private function emptyIFDBPreview(): array
    {
        return [
            'ok' => true,
            'tuid' => '',
            'url' => '',
            'api_url' => '',
            'fields' => [],
            'tags' => [],
            'downloads_reference_only' => [],
            'raw_summary' => [],
            'sources' => [],
            'warnings' => [],
            'errors' => [],
            'remote_fetches' => false,
        ];
    }

    private function tuidFromIFDBUrl(string $url): array
    {
        $warnings = [];
        $errors = [];
        $tuid = '';
        $parts = parse_url($url);
        if (!is_array($parts)) {
            return ['tuid' => '', 'warnings' => [], 'errors' => ['IFDB URL is malformed.']];
        }

        $scheme = strtolower((string)($parts['scheme'] ?? ''));
        $host = strtolower((string)($parts['host'] ?? ''));
        $path = (string)($parts['path'] ?? '');
        if (!in_array($scheme, ['http', 'https'], true)) {
            $errors[] = 'IFDB URL must use http or https.';
        }
        if (!in_array($host, ['ifdb.org', 'www.ifdb.org'], true)) {
            $errors[] = 'IFDB URL must be on ifdb.org.';
        }
        if (strpos($path, '\\') !== false || strpos($path, '..') !== false) {
            $errors[] = 'IFDB URL path must not contain traversal or unsafe path segments.';
        }
        if (!in_array($path, ['', '/', '/viewgame'], true)) {
            $errors[] = 'IFDB URL path must be /viewgame.';
        }
        if (!empty($parts['fragment'])) {
            $warnings[] = 'IFDB URL fragments are ignored in the normalized package URL.';
        }

        $query = [];
        parse_str((string)($parts['query'] ?? ''), $query);
        $candidate = is_scalar($query['id'] ?? null) ? trim((string)$query['id']) : '';
        if ($candidate === '') {
            $errors[] = 'IFDB URL must include an id query parameter.';
        } elseif (!$this->isPlausibleTuid($candidate)) {
            $errors[] = 'IFDB URL id parameter is not a plausible TUID.';
        } else {
            $tuid = strtolower($candidate);
        }

        return [
            'tuid' => $errors ? '' : $tuid,
            'warnings' => $warnings,
            'errors' => $errors,
        ];
    }

    private function isPlausibleTuid(string $tuid): bool
    {
        return (bool)preg_match('/^[a-z0-9]{4,32}$/i', trim($tuid));
    }

    private function fetchUrl(string $url): array
    {
        if ($this->httpFetcher !== null) {
            $result = call_user_func($this->httpFetcher, $url);
            if (is_array($result)) {
                return [
                    'ok' => (bool)($result['ok'] ?? false),
                    'body' => (string)($result['body'] ?? ''),
                    'error' => (string)($result['error'] ?? ''),
                ];
            }

            return [
                'ok' => is_string($result),
                'body' => is_string($result) ? $result : '',
                'error' => is_string($result) ? '' : 'Injected IFDB fetcher returned an invalid response.',
            ];
        }

        if (function_exists('curl_init')) {
            $handle = curl_init($url);
            if ($handle === false) {
                return ['ok' => false, 'body' => '', 'error' => 'Unable to initialize HTTP client for IFDB lookup.'];
            }

            curl_setopt_array($handle, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_TIMEOUT => 8,
                CURLOPT_USERAGENT => 'TerpVault Admin2 ecosystem metadata preview',
                CURLOPT_HTTPHEADER => ['Accept: application/json'],
            ]);
            $body = curl_exec($handle);
            $error = curl_error($handle);
            $status = (int)curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
            curl_close($handle);

            if (!is_string($body) || $body === '') {
                return ['ok' => false, 'body' => '', 'error' => $error ?: 'IFDB lookup returned an empty response.'];
            }
            if ($status < 200 || $status >= 300) {
                return ['ok' => false, 'body' => $body, 'error' => 'IFDB lookup returned HTTP ' . $status . '.'];
            }

            return ['ok' => true, 'body' => $body, 'error' => ''];
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 8,
                'ignore_errors' => true,
                'header' => "Accept: application/json\r\nUser-Agent: TerpVault Admin2 ecosystem metadata preview\r\n",
            ],
        ]);
        $body = @file_get_contents($url, false, $context);
        if (!is_string($body) || $body === '') {
            return ['ok' => false, 'body' => '', 'error' => 'IFDB lookup failed or returned an empty response.'];
        }

        return ['ok' => true, 'body' => $body, 'error' => ''];
    }

    private function htmlToConciseText(string $html): string
    {
        $text = preg_replace('#<(br|/p|/div|/li)\b[^>]*>#i', "\n", $html) ?? $html;
        $text = strip_tags($text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\s*\n\s*/', "\n", $text) ?? $text;
        $text = trim($text);
        if ($text === '') {
            return '';
        }
        if (function_exists('mb_strlen') && mb_strlen($text, 'UTF-8') > self::IFDB_DESCRIPTION_LIMIT) {
            return rtrim((string)mb_substr($text, 0, self::IFDB_DESCRIPTION_LIMIT, 'UTF-8')) . '...';
        }
        if (strlen($text) > self::IFDB_DESCRIPTION_LIMIT) {
            return rtrim(substr($text, 0, self::IFDB_DESCRIPTION_LIMIT)) . '...';
        }

        return $text;
    }

    private function cleanScalar($value): string
    {
        if (!is_scalar($value) && $value !== null) {
            return '';
        }

        $text = trim((string)($value ?? ''));
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text) ?? $text;
        return trim($text);
    }

    private function pathFromIFArchiveUrl(string $url): array
    {
        if (preg_match('/[\x00-\x1F\x7F]/', $url) || strpos($url, '\\') !== false) {
            return $this->pathResult('', 'IF Archive URL contains unsafe characters.');
        }

        $parts = parse_url($url);
        if (!is_array($parts)) {
            return $this->pathResult('', 'IF Archive URL is malformed.');
        }

        $scheme = strtolower((string)($parts['scheme'] ?? ''));
        $host = strtolower((string)($parts['host'] ?? ''));
        if (!in_array($scheme, ['http', 'https'], true)) {
            return $this->pathResult('', 'IF Archive URL must use http or https.');
        }
        if (!in_array($host, ['ifarchive.org', 'www.ifarchive.org'], true)) {
            return $this->pathResult('', 'IF Archive URL must be on ifarchive.org.');
        }

        $rawPath = str_replace('\\', '/', (string)($parts['path'] ?? ''));
        if (strpos($rawPath, '/if-archive/') !== 0) {
            return $this->pathResult('', 'IF Archive URL path must start with /if-archive/.');
        }

        $warning = '';
        if (!empty($parts['query']) || !empty($parts['fragment'])) {
            $warning = 'IF Archive URL query strings and fragments are ignored in the normalized package URL.';
        }

        $archivePath = rawurldecode(substr($rawPath, strlen('/if-archive/')));
        $normalized = $this->normalizeIFArchivePath($archivePath);
        return [
            'path' => $normalized['path'],
            'error' => $normalized['error'],
            'warning' => $warning,
        ];
    }

    private function normalizeIFArchivePath(string $path): array
    {
        $path = str_replace('\\', '/', trim($path));
        if (strpos($path, 'if-archive/') === 0) {
            $path = substr($path, strlen('if-archive/'));
        }

        if ($path === '') {
            return $this->pathResult('', 'IF Archive path is empty.');
        }
        if (strpos($path, "\0") !== false || $path[0] === '/' || preg_match('/^[A-Za-z]:[\/\\\\]/', $path) || preg_match('#^[a-z][a-z0-9+.-]*:#i', $path)) {
            return $this->pathResult('', 'IF Archive path must be a relative archive path.');
        }
        if (strpos($path, '//') !== false) {
            return $this->pathResult('', 'IF Archive path must not contain empty path segments.');
        }

        foreach (explode('/', $path) as $segment) {
            if ($segment === '' || $segment === '.' || $segment === '..') {
                return $this->pathResult('', 'IF Archive path must not contain traversal segments.');
            }
            if (preg_match('/[\x00-\x1F\x7F]/', $segment)) {
                return $this->pathResult('', 'IF Archive path contains unsafe characters.');
            }
        }

        return $this->pathResult($path, '');
    }

    private function referenceWarnings(string $url, string $label): array
    {
        $warnings = [$label . ' is stored as a curator reference only; lookup is not implemented yet.'];
        if (preg_match('/[\x00-\x1F\x7F]/', $url) || strpos($url, '\\') !== false) {
            $warnings[] = $label . ' contains characters that would be rejected by package writes.';
            return $warnings;
        }

        $parts = parse_url($url);
        $scheme = is_array($parts) ? strtolower((string)($parts['scheme'] ?? '')) : '';
        $host = is_array($parts) ? (string)($parts['host'] ?? '') : '';
        if (!is_array($parts) || !in_array($scheme, ['http', 'https'], true) || trim($host) === '') {
            $warnings[] = $label . ' should be an http or https URL before saving package metadata.';
        }

        return $warnings;
    }

    private function pathResult(string $path, string $error): array
    {
        return [
            'path' => $path,
            'error' => $error,
        ];
    }

    private function encodePath(string $path): string
    {
        return implode('/', array_map('rawurlencode', explode('/', $path)));
    }

    private function stringInput(array $inputs, string $key): string
    {
        $value = $inputs[$key] ?? '';
        return is_scalar($value) || $value === null ? trim((string)($value ?? '')) : '';
    }
}
