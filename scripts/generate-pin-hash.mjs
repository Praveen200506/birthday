#!/usr/bin/env node

/**
 * Utility script to generate SHA-256 hashes for:
 * 1. BLOG_PIN_HASH (4-digit Reader PIN)
 * 2. BLOG_ADMIN_PASSWORD_HASH (Author Password)
 *
 * Usage:
 *   node scripts/generate-pin-hash.mjs <your-pin-or-password>
 *
 * Example:
 *   node scripts/generate-pin-hash.mjs 1910
 */

import crypto from "crypto";

const input = process.argv[2];

if (!input) {
  console.log("\n❌ Please provide a PIN or password to hash.");
  console.log("Usage: node scripts/generate-pin-hash.mjs <input>\n");
  console.log("Example:");
  console.log("  node scripts/generate-pin-hash.mjs 1910\n");
  process.exit(1);
}

const hash = crypto.createHash("sha256").update(input.trim()).digest("hex");

console.log("\n===========================================");
console.log("🔐 Generated SHA-256 Hash:");
console.log("===========================================");
console.log(hash);
console.log("===========================================");
if (input.length === 4 && /^\d+$/.test(input)) {
  console.log(`Add to your .env / Vercel Environment Variables:`);
  console.log(`BLOG_PIN_HASH=${hash}\n`);
} else {
  console.log(`Add to your .env / Vercel Environment Variables:`);
  console.log(`BLOG_ADMIN_PASSWORD_HASH=${hash}\n`);
}
