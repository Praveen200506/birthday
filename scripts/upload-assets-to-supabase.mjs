import { createClient } from "@supabase/supabase-js";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";
import { Readable } from "node:stream";

const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "birthday-assets";
const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const root = process.cwd();
const sourceFolders = ["heroPagePhotos", "photos", "music"] as const;
const maxStorageBytes = 1_000_000_000;

if (!url || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY locally before uploading.");
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

function filesIn(folder: string): string[] {
  const directory = join(root, "public", folder);
  if (!existsSync(directory)) throw new Error(`Missing asset directory: ${directory}`);
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(directory, entry.name));
}

function contentType(file: string): string {
  const extension = file.toLowerCase().split(".").pop();
  return ({ jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", heic: "image/heic", mp3: "audio/mpeg", txt: "text/plain" } as Record<string, string>)[extension || ""] || "application/octet-stream";
}

async function main() {
  const files = sourceFolders.flatMap((folder) => filesIn(folder));
  const totalBytes = files.reduce((total, file) => total + statSync(file).size, 0);
  console.log(`Found ${files.length} files (${(totalBytes / 1024 / 1024).toFixed(2)} MiB).`);
  if (totalBytes > maxStorageBytes) throw new Error("Asset set exceeds the 1 GB safety limit; no uploads were attempted.");

  let uploaded = 0;
  let skipped = 0;
  for (const file of files) {
    const folder = relative(join(root, "public"), file).split(sep).join("/");
    const objectPath = folder;
    const parent = objectPath.slice(0, objectPath.lastIndexOf("/"));
    const name = basename(objectPath);
    const { data: existing, error: listError } = await supabase.storage.from(bucket).list(parent, { search: name, limit: 100 });
    if (listError) throw new Error(`Could not inspect ${objectPath}: ${listError.message}`);
    if (existing?.some((entry) => entry.name === name)) { skipped++; console.log(`Skipped existing: ${objectPath}`); continue; }

    const { error } = await supabase.storage.from(bucket).upload(objectPath, Readable.toWeb(createReadStream(file)) as unknown as Blob, { contentType: contentType(file), upsert: false });
    if (error) throw new Error(`Upload failed for ${objectPath}: ${error.message}`);
    uploaded++;
    console.log(`Uploaded: ${objectPath}`);
  }
  console.log(`Complete. Uploaded: ${uploaded}; skipped existing: ${skipped}; total bytes: ${totalBytes}.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
