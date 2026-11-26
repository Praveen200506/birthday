import crypto from "crypto";

const BLOG_SESSION_COOKIE = "blog_session";
const BLOG_ADMIN_SESSION_COOKIE = "blog_admin_session";

// In-memory rate limiting for security
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitEntry>();

export const checkRateLimit = (key: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.attempts >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.attempts += 1;
  return { allowed: true, remaining: maxAttempts - entry.attempts };
};

/**
 * Hash a plain text string using SHA-256
 */
export const hashSecret = (input: string): string => {
  return crypto.createHash("sha256").update(input.trim()).digest("hex");
};

/**
 * Constant-time comparison between two hashes
 */
const safeCompare = (a: string, b: string): boolean => {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
};

/**
 * Verify Blog 4-digit PIN against server environment variable
 */
export const verifyBlogPin = (pin: string): boolean => {
  if (!pin || pin.trim().length !== 4) return false;

  const expectedHash = process.env.BLOG_PIN_HASH;
  // If BLOG_PIN_HASH is set, compare hashes
  if (expectedHash && expectedHash.trim().length > 0) {
    const inputHash = hashSecret(pin);
    return safeCompare(inputHash, expectedHash.trim());
  }

  return false;
};

/**
 * Verify Author/Admin Password against server environment variable
 */
export const verifyAdminPassword = (password: string): boolean => {
  if (!password || password.trim().length === 0) return false;

  const expectedHash = process.env.BLOG_ADMIN_PASSWORD_HASH;
  if (expectedHash && expectedHash.trim().length > 0) {
    const inputHash = hashSecret(password);
    return safeCompare(inputHash, expectedHash.trim());
  }

  return false;
};

/**
 * Create a cryptographically signed session token
 */
const createSignedToken = (payload: object, secret: string, expiresInMs: number): string => {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + expiresInMs,
    nonce: crypto.randomBytes(8).toString("hex"),
  });
  const dataBase64 = Buffer.from(data).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(dataBase64).digest("base64url");
  return `${dataBase64}.${signature}`;
};

/**
 * Verify and decode a cryptographically signed session token
 */
const verifySignedToken = (token: string, secret: string): boolean => {
  if (!token || !token.includes(".")) return false;
  const [dataBase64, signature] = token.split(".");
  if (!dataBase64 || !signature) return false;

  try {
    const expectedSignature = crypto.createHmac("sha256", secret).update(dataBase64).digest("base64url");
    const sigBufA = Buffer.from(signature);
    const sigBufB = Buffer.from(expectedSignature);

    if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
      return false;
    }

    const jsonStr = Buffer.from(dataBase64, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Reader session utilities
 */
export const getBlogReaderSessionToken = (): string => {
  const secret = process.env.BLOG_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("BLOG_SESSION_SECRET must be configured with at least 32 characters.");
  }
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  return createSignedToken({ role: "reader" }, secret, SEVEN_DAYS_MS);
};

export const verifyBlogReaderSession = (token?: string | null): boolean => {
  if (!token) return false;
  const secret = process.env.BLOG_SESSION_SECRET?.trim();
  return Boolean(secret && secret.length >= 32 && verifySignedToken(token, secret));
};

/**
 * Admin session utilities
 */
export const getBlogAdminSessionToken = (): string => {
  const secret = process.env.BLOG_ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("BLOG_ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return createSignedToken({ role: "admin" }, secret, ONE_DAY_MS);
};

export const verifyBlogAdminSession = (token?: string | null): boolean => {
  if (!token) return false;
  const secret = process.env.BLOG_ADMIN_SESSION_SECRET?.trim();
  return Boolean(secret && secret.length >= 32 && verifySignedToken(token, secret));
};

export { BLOG_SESSION_COOKIE, BLOG_ADMIN_SESSION_COOKIE };
