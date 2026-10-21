import { createClient } from "@supabase/supabase-js";

export const MAX_MEMORY_IMAGE_BYTES = 15 * 1024 * 1024;

export const MEMORY_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getMemoryStorageConfig() {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
    "birthday-assets";

  if (!url || !serviceRoleKey || !bucket) return null;
  return { url, serviceRoleKey, bucket };
}

export function createMemoryStorageClient() {
  const config = getMemoryStorageConfig();
  if (!config) return null;

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Never permit production memory uploads to rely on the development fallback
 * author password or a known default signing secret.
 */
export function hasSecureMemoryAdminConfiguration(): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const passwordHash = process.env.BLOG_ADMIN_PASSWORD_HASH?.trim() || "";
  const sessionSecret = process.env.BLOG_ADMIN_SESSION_SECRET?.trim() || "";
  return /^[a-f0-9]{64}$/i.test(passwordHash) && sessionSecret.length >= 32;
}
