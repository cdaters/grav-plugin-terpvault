<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use InvalidArgumentException;

class EcosystemMetadataService
{
    private const IFARCHIVE_BASE_URL = 'https://ifarchive.org/if-archive/';

    private const REFERENCE_FIELDS = [
        'ifdb_url' => 'IFDB URL',
        'ifwiki_url' => 'IFWiki URL',
        'source_url' => 'Source / package URL',
        'upstream_source_url' => 'Upstream source URL',
        'port_repository_url' => 'Port/source repository URL',
        'license_url' => 'License URL',
    ];

    public function preview(array $inputs): array
    {
        $warnings = [
            'Reference only.',
            'Curator review required.',
            'URL presence does not prove redistribution rights.',
        ];
        $errors = [];
        $metadata = [];
        $ifArchivePath = $this->stringInput($inputs, 'ifarchive_path');
        $ifArchiveUrl = $this->stringInput($inputs, 'ifarchive_url') ?: $this->stringInput($inputs, 'ifarchive');
        $hasInput = $ifArchivePath !== '' || $ifArchiveUrl !== '';

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
            'references' => $references,
            'warnings' => array_values(array_unique($warnings)),
            'errors' => $errors,
            'writes' => false,
            'remote_fetches' => false,
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
