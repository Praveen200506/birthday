const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "birthday-assets";

/** Resolve an asset through public Supabase Storage, with a local /public fallback. */
export function getAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath.replace(/^\/+/, "");

  if (!SUPABASE_URL) {
    return `/${normalizedPath}`;
  }

  const encodedPath = normalizedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${encodedPath}`;
}
