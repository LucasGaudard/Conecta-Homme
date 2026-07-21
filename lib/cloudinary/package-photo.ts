import crypto from "node:crypto";
import { AppError } from "@/lib/errors/app-error";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxPackagePhotoSize = 5 * 1024 * 1024;

type CloudinaryUploadResponse = {
  public_id?: string;
  secure_url?: string;
};

type UploadedPackagePhoto = {
  publicId: string;
  secureUrl: string;
};

type PackagePhotoUploadErrorCode =
  | "cloudinary_failure"
  | "invalid_type"
  | "missing_config"
  | "too_large";

class PackagePhotoUploadError extends AppError {
  readonly code: PackagePhotoUploadErrorCode;

  constructor(code: PackagePhotoUploadErrorCode, message: string) {
    super(message);
    this.name = "PackagePhotoUploadError";
    this.code = code;
  }
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new PackagePhotoUploadError(
      "missing_config",
      "O serviço de imagens não está configurado.",
    );
  }

  return { apiKey, apiSecret, cloudName };
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const payload = Object.entries(params)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function assertPackagePhoto(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new PackagePhotoUploadError(
      "invalid_type",
      "Use uma imagem JPG, PNG ou WEBP.",
    );
  }

  if (file.size > maxPackagePhotoSize) {
    throw new PackagePhotoUploadError(
      "too_large",
      "A foto deve ter no máximo 5 MB.",
    );
  }
}

function isCloudinaryUploadResponse(value: unknown): value is CloudinaryUploadResponse {
  return Boolean(value && typeof value === "object");
}

function getCloudinaryErrorMessage(value: unknown) {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return undefined;
  }

  const error = (value as { error?: unknown }).error;

  if (!error || typeof error !== "object" || !("message" in error)) {
    return undefined;
  }

  const message = (error as { message?: unknown }).message;

  return typeof message === "string" ? message : undefined;
}

function logPackagePhotoUploadError(details: Record<string, unknown>) {
  console.error("[package-photo-upload-error]", details);
}

export async function uploadPackagePhoto(
  value: FormDataEntryValue | null,
  condominiumId: string,
): Promise<UploadedPackagePhoto | null> {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  assertPackagePhoto(value);

  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `condotech/condominiums/${condominiumId}/packages`;
  const publicId = `package-${Date.now()}-${crypto.randomUUID()}`;
  const signature = signCloudinaryParams(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    apiSecret,
  );
  const formData = new FormData();

  formData.set("file", value);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("folder", folder);
  formData.set("public_id", publicId);
  formData.set("signature", signature);

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        body: formData,
        method: "POST",
      },
    );
  } catch (error) {
    logPackagePhotoUploadError({
      cloudNameConfigured: Boolean(cloudName),
      error: error instanceof Error ? error.message : String(error),
      fileSize: value.size,
      fileType: value.type,
      stage: "request",
    });
    throw new PackagePhotoUploadError(
      "cloudinary_failure",
      "Não foi possível enviar a foto. Tente novamente ou cadastre sem foto.",
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isCloudinaryUploadResponse(body) || !body.secure_url || !body.public_id) {
    logPackagePhotoUploadError({
      cloudinaryMessage: getCloudinaryErrorMessage(body),
      cloudNameConfigured: Boolean(cloudName),
      fileSize: value.size,
      fileType: value.type,
      responseOk: response.ok,
      status: response.status,
      statusText: response.statusText,
      stage: "response",
    });
    throw new PackagePhotoUploadError(
      "cloudinary_failure",
      "Não foi possível enviar a foto. Tente novamente ou cadastre sem foto.",
    );
  }

  return {
    publicId: body.public_id,
    secureUrl: body.secure_url,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ public_id: publicId, timestamp }, apiSecret);
  const formData = new FormData();

  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("public_id", publicId);
  formData.set("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    body: formData,
    method: "POST",
  });
}

export { allowedImageTypes, maxPackagePhotoSize };
