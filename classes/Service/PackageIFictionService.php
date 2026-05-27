<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Service;

use DOMDocument;
use DOMElement;
use DOMXPath;
use Grav\Common\Grav;
use Grav\Common\Yaml;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;

class PackageIFictionService
{
    private const FIELD_MAP = [
        'bibliographic.title' => 'Title',
        'bibliographic.author' => 'Author',
        'bibliographic.headline' => 'Headline',
        'bibliographic.description' => 'Description',
        'bibliographic.first_published' => 'First published',
        'bibliographic.genre' => 'Genre',
        'bibliographic.language' => 'Language',
        'identification.ifids' => 'IFIDs',
        'identification.format' => 'Format',
    ];

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

    public function preview(string $slug): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        return $this->previewFromPaths($paths, $metadata);
    }

    public function apply(string $slug, array $selectedFields): array
    {
        $paths = $this->packagePaths($slug);
        $metadata = $this->loadYaml($paths['yaml']);
        $selectedFields = $this->normalizeSelectedFields($selectedFields);

        foreach ($selectedFields as $field) {
            if (!array_key_exists($field, self::FIELD_MAP)) {
                throw new InvalidArgumentException('Unsupported iFiction target field: ' . $field);
            }
        }

        $preview = $this->previewFromPaths($paths, $metadata);
        if (!$selectedFields) {
            $preview['applied'] = false;
            $preview['updated_fields'] = [];
            return $preview;
        }

        if (!$preview['ok']) {
            $preview['applied'] = false;
            $preview['updated_fields'] = [];
            return $preview;
        }

        $available = [];
        foreach ($preview['fields'] as $field) {
            $available[(string) $field['path']] = $field['xml'];
        }

        $updates = [];
        foreach ($selectedFields as $field) {
            if (!array_key_exists($field, $available) || $this->stringify($available[$field]) === '') {
                throw new InvalidArgumentException('Selected iFiction field has no non-empty XML value: ' . $field);
            }
            $updates[$field] = $available[$field];
        }

        $write = (new PackageMetadataService())->updateMetadata($paths['slug'], $updates);
        $updatedMetadata = is_array($write['metadata'] ?? null) ? $write['metadata'] : $this->loadYaml($paths['yaml']);
        $updatedPreview = $this->previewFromPaths($paths, $updatedMetadata);
        $updatedPreview['applied'] = true;
        $updatedPreview['updated_fields'] = array_keys($updates);
        $updatedPreview['backup'] = $write['backup'] ?? null;

        return $updatedPreview;
    }

    public function upload(string $slug, UploadedFileInterface $upload): array
    {
        $paths = $this->packagePaths($slug);
        if ($upload->getError() !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('metadata.iFiction.xml upload failed.');
        }

        $clientName = (string) $upload->getClientFilename();
        if (strtolower(pathinfo($clientName, PATHINFO_EXTENSION)) !== 'xml') {
            throw new InvalidArgumentException('metadata.iFiction.xml upload must be an XML file.');
        }

        $stream = $upload->getStream();
        if ($stream->isSeekable()) {
            $stream->rewind();
        }
        $xml = (string) $stream;
        if (trim($xml) === '') {
            throw new InvalidArgumentException('metadata.iFiction.xml upload is empty.');
        }
        if (strlen($xml) > 524288) {
            throw new InvalidArgumentException('metadata.iFiction.xml upload is too large.');
        }
        if (stripos($xml, '<!DOCTYPE') !== false) {
            throw new InvalidArgumentException('metadata.iFiction.xml contains a DOCTYPE declaration and was not saved.');
        }

        $this->parseXml($xml);

        $target = $paths['package'] . DIRECTORY_SEPARATOR . 'metadata.iFiction.xml';
        $backup = null;
        if (is_file($target)) {
            $backup = $this->backupPath($target);
            if (!copy($target, $backup)) {
                throw new RuntimeException('Unable to create metadata.iFiction.xml backup.');
            }
        }

        $temp = $paths['package'] . DIRECTORY_SEPARATOR . '.metadata.iFiction.xml.tmp-' . bin2hex(random_bytes(8));
        if (file_put_contents($temp, $xml) === false) {
            throw new RuntimeException('Unable to write metadata.iFiction.xml temp file.');
        }
        if (!rename($temp, $target)) {
            @unlink($temp);
            throw new RuntimeException('Unable to replace metadata.iFiction.xml.');
        }

        $metadata = $this->loadYaml($paths['yaml']);
        $preview = $this->previewFromPaths($paths, $metadata);
        $preview['uploaded'] = true;
        $preview['backup'] = $backup;

        return $preview;
    }

    private function previewFromPaths(array $paths, array $metadata): array
    {
        $result = [
            'slug' => $paths['slug'],
            'exists' => is_file($paths['package'] . DIRECTORY_SEPARATOR . 'metadata.iFiction.xml'),
            'ok' => false,
            'errors' => [],
            'xml_path' => 'metadata.iFiction.xml',
            'extracted' => [],
            'fields' => [],
        ];
        $xmlPath = $paths['package'] . DIRECTORY_SEPARATOR . 'metadata.iFiction.xml';

        if (!is_file($xmlPath)) {
            $result['errors'][] = 'metadata.iFiction.xml was not found in this package.';
            return $result;
        }

        $xml = file_get_contents($xmlPath);
        if (!is_string($xml) || trim($xml) === '') {
            $result['errors'][] = 'metadata.iFiction.xml is empty or unreadable.';
            return $result;
        }

        if (stripos($xml, '<!DOCTYPE') !== false) {
            $result['errors'][] = 'metadata.iFiction.xml contains a DOCTYPE declaration and was not parsed.';
            return $result;
        }

        try {
            $extracted = $this->parseXml($xml);
        } catch (RuntimeException $e) {
            $result['errors'][] = $e->getMessage();
            return $result;
        }

        $result['extracted'] = $extracted;
        $result['fields'] = $this->fieldPreview($metadata, $extracted);
        $result['ok'] = count($result['fields']) > 0;
        if (!$result['ok']) {
            $result['errors'][] = 'No supported iFiction metadata fields were found.';
        }

        return $result;
    }

    private function backupPath(string $path): string
    {
        $base = $path . '.bak-' . date('Ymd-His');
        $candidate = $base;
        $index = 1;
        while (file_exists($candidate)) {
            $candidate = $base . '-' . $index;
            $index++;
        }

        return $candidate;
    }

    private function parseXml(string $xml): array
    {
        if (!class_exists(DOMDocument::class)) {
            throw new RuntimeException('PHP DOM extension is required to preview iFiction XML.');
        }

        $previous = libxml_use_internal_errors(true);
        libxml_clear_errors();

        $document = new DOMDocument();
        $document->preserveWhiteSpace = false;
        $document->substituteEntities = false;
        $loaded = $document->loadXML($xml, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOCDATA);
        $errors = libxml_get_errors();
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (!$loaded || $document->documentElement === null) {
            $message = 'Unable to parse metadata.iFiction.xml.';
            if ($errors) {
                $message .= ' ' . trim($errors[0]->message);
            }
            throw new RuntimeException($message);
        }

        $xpath = new DOMXPath($document);
        $story = $this->firstElement($xpath, '//*[local-name()="story"]') ?: $document->documentElement;
        $bibliographic = $this->firstElement($xpath, './/*[local-name()="bibliographic"]', $story);
        $identification = $this->firstElement($xpath, './/*[local-name()="identification"]', $story);
        $extracted = [];

        if ($bibliographic) {
            $this->setIfPresent($extracted, 'bibliographic.title', $this->firstChildText($bibliographic, ['title']));
            $this->setIfPresent($extracted, 'bibliographic.author', $this->firstChildText($bibliographic, ['author']));
            $this->setIfPresent($extracted, 'bibliographic.headline', $this->firstChildText($bibliographic, ['headline', 'subtitle']));
            $this->setIfPresent($extracted, 'bibliographic.description', $this->firstChildText($bibliographic, ['description', 'teaser']));
            $this->setIfPresent($extracted, 'bibliographic.first_published', $this->firstChildText($bibliographic, ['firstpublished', 'first_published', 'date', 'published']));
            $this->setIfPresent($extracted, 'bibliographic.genre', $this->firstChildText($bibliographic, ['genre']));
            $this->setIfPresent($extracted, 'bibliographic.language', $this->firstChildText($bibliographic, ['language']));
        }

        if ($identification) {
            $ifids = $this->childTexts($identification, ['ifid']);
            if ($ifids) {
                $extracted['identification.ifids'] = array_values(array_unique($ifids));
            }
            $format = $this->firstChildText($identification, ['format', 'system']);
            if ($format !== '') {
                $extracted['identification.format'] = strtolower($format);
            }
        }

        return $extracted;
    }

    private function fieldPreview(array $metadata, array $extracted): array
    {
        $fields = [];
        foreach (self::FIELD_MAP as $path => $label) {
            if (!array_key_exists($path, $extracted)) {
                continue;
            }
            $xmlValue = $extracted[$path];
            $current = $this->getNestedValue($metadata, $path);
            $fields[] = [
                'path' => $path,
                'label' => $label,
                'current' => $current,
                'xml' => $xmlValue,
                'would_change' => $this->stringify($current) !== $this->stringify($xmlValue),
                'current_empty' => $this->stringify($current) === '',
                'default_selected' => $this->stringify($current) === '' && $this->stringify($xmlValue) !== '',
                'overwrite_warning' => $this->stringify($current) !== '' && $this->stringify($current) !== $this->stringify($xmlValue),
            ];
        }

        return $fields;
    }

    private function normalizeSelectedFields(array $selectedFields): array
    {
        $fields = [];
        foreach ($selectedFields as $field) {
            if (!is_scalar($field)) {
                continue;
            }
            $field = trim((string) $field);
            if ($field !== '') {
                $fields[] = $field;
            }
        }

        return array_values(array_unique($fields));
    }

    private function firstElement(DOMXPath $xpath, string $query, ?DOMElement $context = null): ?DOMElement
    {
        $nodes = $context ? $xpath->query($query, $context) : $xpath->query($query);
        if (!$nodes || $nodes->length === 0 || !$nodes->item(0) instanceof DOMElement) {
            return null;
        }

        return $nodes->item(0);
    }

    private function firstChildText(DOMElement $parent, array $names): string
    {
        $values = $this->childTexts($parent, $names);
        return $values[0] ?? '';
    }

    private function childTexts(DOMElement $parent, array $names): array
    {
        $lookup = array_fill_keys($names, true);
        $values = [];
        foreach ($parent->childNodes as $node) {
            if (!$node instanceof DOMElement) {
                continue;
            }
            $name = strtolower($node->localName ?: $node->nodeName);
            if (!isset($lookup[$name])) {
                continue;
            }
            $value = trim((string) $node->textContent);
            if ($value !== '') {
                $values[] = $value;
            }
        }

        return $values;
    }

    private function setIfPresent(array &$data, string $path, string $value): void
    {
        if ($value !== '') {
            $data[$path] = $value;
        }
    }

    private function stringify($value): string
    {
        if (is_array($value)) {
            return implode("\n", array_map('strval', $value));
        }

        return trim((string)($value ?? ''));
    }

    private function packagePaths(string $slug): array
    {
        $slug = trim($slug);
        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('Invalid package slug.');
        }

        if ($this->basePath === '' || !is_dir($this->basePath)) {
            throw new RuntimeException('TerpVault games directory is not available.');
        }

        $base = realpath($this->basePath);
        if ($base === false) {
            throw new RuntimeException('Unable to resolve TerpVault games directory.');
        }

        $package = $this->basePath . DIRECTORY_SEPARATOR . $slug;
        if (!is_dir($package)) {
            throw new InvalidArgumentException('Package not found: ' . $slug);
        }

        $packageReal = realpath($package);
        if ($packageReal === false || !$this->isPathInside($packageReal, $base)) {
            throw new InvalidArgumentException('Package path is outside the TerpVault games directory.');
        }

        $yaml = $packageReal . DIRECTORY_SEPARATOR . 'game.yaml';
        if (!is_file($yaml)) {
            throw new InvalidArgumentException('Package game.yaml not found: ' . $slug);
        }

        return [
            'slug' => $slug,
            'base' => $base,
            'package' => $packageReal,
            'yaml' => $yaml,
        ];
    }

    private function loadYaml(string $path): array
    {
        $data = Yaml::parse(file_get_contents($path) ?: '') ?: [];
        if (!is_array($data)) {
            throw new RuntimeException('Invalid game.yaml structure.');
        }

        return $data;
    }

    private function getNestedValue(array $data, string $path)
    {
        $value = $data;
        foreach (explode('.', $path) as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return null;
            }
            $value = $value[$segment];
        }

        return $value;
    }

    private function isPathInside(string $path, string $base): bool
    {
        $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos(rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, $base) === 0;
    }
}
