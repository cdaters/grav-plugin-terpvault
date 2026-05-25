<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Controller;

use Grav\Plugin\Api\Controllers\AbstractApiController;
use Grav\Plugin\Api\Exceptions\ForbiddenException;
use Grav\Plugin\Api\Exceptions\ValidationException;
use Grav\Plugin\Api\Response\ApiResponse;
use Grav\Framework\Psr7\Response;
use Grav\Plugin\TerpVault\Service\PackageArchiveService;
use Grav\Plugin\TerpVault\Service\PackageCreationService;
use Grav\Plugin\TerpVault\Service\PackageIFictionService;
use Grav\Plugin\TerpVault\Service\PackageImportService;
use Grav\Plugin\TerpVault\Service\PackageMarkdownService;
use Grav\Plugin\TerpVault\Service\PackageMediaService;
use Grav\Plugin\TerpVault\Service\PackageMetadataService;
use Grav\Plugin\TerpVault\Service\PackageStoryService;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;

class ApiController extends AbstractApiController
{
    private function service(): PackageMetadataService
    {
        return new PackageMetadataService();
    }

    private function creationService(): PackageCreationService
    {
        return new PackageCreationService();
    }

    private function archiveService(): PackageArchiveService
    {
        return new PackageArchiveService();
    }

    private function importService(): PackageImportService
    {
        return new PackageImportService();
    }

    private function ifictionService(): PackageIFictionService
    {
        return new PackageIFictionService();
    }

    private function markdownService(): PackageMarkdownService
    {
        return new PackageMarkdownService();
    }

    private function mediaService(): PackageMediaService
    {
        return new PackageMediaService();
    }

    private function storyService(): PackageStoryService
    {
        return new PackageStoryService();
    }

    public function metadata(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');

        try {
            return ApiResponse::create($this->service()->metadata($slug));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function createPackage(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $body = $request->getParsedBody();
        $fields = is_array($body) ? $body : [];
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('Initial story file is required.');
        }

        try {
            return ApiResponse::create($this->creationService()->create($fields, $upload));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function exportPackage(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');

        try {
            $export = $this->archiveService()->export($slug);
            $path = (string) $export['path'];
            $filename = str_replace(['"', "\r", "\n"], '', (string) $export['filename']);
            $stream = fopen($path, 'rb');
            if ($stream === false) {
                throw new RuntimeException('Unable to read package export zip.');
            }

            register_shutdown_function(static function () use ($path): void {
                if (is_file($path)) {
                    @unlink($path);
                }
            });

            return new Response(200, [
                'Content-Type' => 'application/zip',
                'Content-Length' => (string) $export['size'],
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'no-store, max-age=0',
                'X-Content-Type-Options' => 'nosniff',
            ], $stream);
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function inspectImport(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('No TerpVault package zip was uploaded.');
        }

        try {
            return ApiResponse::create($this->importService()->inspect($upload));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function commitImport(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $body = $request->getParsedBody();
        $fields = is_array($body) ? $body : [];
        $slug = (string)($fields['slug'] ?? '');
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('No TerpVault package zip was uploaded.');
        }

        try {
            return ApiResponse::create($this->importService()->commit($upload, $slug));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function updateMetadata(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $body = $this->getRequestBody($request);
        if (!is_array($body)) {
            throw new ValidationException('Request body must be a JSON object.');
        }
        $updates = is_array($body['metadata'] ?? null) ? $body['metadata'] : $body;

        try {
            return ApiResponse::create($this->service()->updateMetadata($slug, $updates));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function previewIFiction(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');

        try {
            return ApiResponse::create($this->ifictionService()->preview($slug));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function applyIFiction(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $body = $this->getRequestBody($request);
        if (!is_array($body)) {
            throw new ValidationException('Request body must be a JSON object.');
        }

        $fields = $body['fields'] ?? $body['paths'] ?? [];
        if (!is_array($fields)) {
            throw new ValidationException('Selected iFiction fields must be an array.');
        }

        try {
            return ApiResponse::create($this->ifictionService()->apply($slug, $fields));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function markdown(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $type = (string) $this->getRouteParam($request, 'type');

        try {
            return ApiResponse::create($this->markdownService()->markdown($slug, $type));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function updateMarkdown(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $type = (string) $this->getRouteParam($request, 'type');
        $body = $this->getRequestBody($request);
        if (!is_array($body)) {
            throw new ValidationException('Request body must be a JSON object.');
        }

        $content = $body['content'] ?? $body['markdown'] ?? null;
        if (!is_scalar($content) && $content !== null) {
            throw new ValidationException('Helper Markdown content must be text.');
        }

        try {
            return ApiResponse::create($this->markdownService()->updateMarkdown($slug, $type, (string) ($content ?? '')));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function media(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');

        try {
            return ApiResponse::create($this->mediaService()->media($slug));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function uploadMedia(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $type = (string) $this->getRouteParam($request, 'type');
        $body = $request->getParsedBody();
        $options = is_array($body) ? $body : [];
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('No media file was uploaded.');
        }

        try {
            return ApiResponse::create($this->mediaService()->upload($slug, $type, $upload, $options));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function updateScreenshots(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $body = $this->getRequestBody($request);
        if (!is_array($body)) {
            throw new ValidationException('Request body must be a JSON object.');
        }

        $screenshots = $body['screenshots'] ?? null;
        if (!is_array($screenshots)) {
            throw new ValidationException('screenshots must be an array.');
        }

        try {
            return ApiResponse::create($this->mediaService()->updateScreenshots($slug, $screenshots));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function story(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');

        try {
            return ApiResponse::create($this->storyService()->story($slug));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    public function uploadStory(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireAdminApiSuper($request);
        $slug = (string) $this->getRouteParam($request, 'slug');
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('No story file was uploaded.');
        }

        try {
            return ApiResponse::create($this->storyService()->upload($slug, $upload));
        } catch (InvalidArgumentException $e) {
            throw new ValidationException($e->getMessage());
        } catch (RuntimeException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    private function requireAdminApiSuper(ServerRequestInterface $request): void
    {
        $user = $this->getUser($request);

        if ($this->userHasPermission($user, 'api.super') || $this->userHasPermission($user, 'admin.super')) {
            return;
        }

        throw new ForbiddenException('Missing required permission: api.super or admin.super');
    }

    private function userHasPermission(?object $user, string $permission): bool
    {
        if (!$user) {
            return false;
        }

        if (method_exists($user, 'authorize') && (bool) $user->authorize($permission)) {
            return true;
        }

        if (method_exists($user, 'get') && (bool) $user->get('access.' . $permission)) {
            return true;
        }

        return false;
    }

    private function firstUploadedFile(array $files): ?UploadedFileInterface
    {
        foreach ($files as $file) {
            if ($file instanceof UploadedFileInterface) {
                return $file;
            }

            if (is_array($file)) {
                $nested = $this->firstUploadedFile($file);
                if ($nested) {
                    return $nested;
                }
            }
        }

        return null;
    }
}
