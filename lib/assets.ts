const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "birthday-assets";

/**
 * Resolve a public asset path through Supabase Storage when configured.
 * Without a public Supabase URL, the existing local /public path is used.
 */
export function getAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath.replace(/^\/+/, "");

  if (!SUPABASE_URL) {
    return `/${normalizedPath}`;
  }

  const baseUrl = SUPABASE_URL.replace(/\/+$/, "");
  const encodedPath = normalizedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${encodedPath}`;
}

// Keep the old helper name as a temporary source-compatible alias for callers
// from the previous migration branch. New code should use getAssetUrl.
export const assetUrl = getAssetUrl;
