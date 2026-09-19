const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim();

/**
 * Resolve a public asset path while keeping local /public assets as the
 * default fallback. The R2 base URL is intentionally public because these
 * URLs are consumed by browser image and audio elements.
 */
export function assetUrl(assetPath: string): string {
  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;

  if (!R2_PUBLIC_URL) {
    return normalizedPath;
  }

  return `${R2_PUBLIC_URL.replace(/\/+$/, "")}${normalizedPath}`;
}
