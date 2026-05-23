<?php

declare(strict_types=1);

namespace Grav\Plugin\TerpVault\Controller;

use Grav\Plugin\Api\Controllers\AbstractApiController;
use Grav\Plugin\Api\Exceptions\ForbiddenException;
use Grav\Plugin\Api\Exceptions\ValidationException;
use Grav\Plugin\Api\Response\ApiResponse;
use Grav\Plugin\TerpVault\Service\PackageMarkdownService;
use Grav\Plugin\TerpVault\Service\PackageMediaService;
use Grav\Plugin\TerpVault\Service\PackageMetadataService;
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

    private function markdownService(): PackageMarkdownService
    {
        return new PackageMarkdownService();
    }

    private function mediaService(): PackageMediaService
    {
        return new PackageMediaService();
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
        $upload = $this->firstUploadedFile($request->getUploadedFiles());
        if (!$upload) {
            throw new ValidationException('No media file was uploaded.');
        }

        try {
            return ApiResponse::create($this->mediaService()->upload($slug, $type, $upload));
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
