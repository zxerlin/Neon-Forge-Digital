import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUTPUT_ZIP_PUBLIC = path.join(PUBLIC_DIR, 'neonforge-os-current.zip');
const OUTPUT_ZIP_ROOT = path.join(ROOT_DIR, 'neonforge-os-current.zip');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.cache',
  '.tmp',
  'data'
]);

const EXCLUDED_EXTENSIONS = new Set([
  '.zip',
  '.log',
  '.db',
  '.db-wal',
  '.db-shm'
]);

const EXCLUDED_FILES = new Set([
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  '.env.test',
  '.DS_Store',
  'Thumbs.db',
  'neonforge_store.json'
]);

export async function buildProjectZip() {
  console.log('[Packager] Compiling NeonForge OS project archive...');
  const zip = new JSZip();
  let fileCount = 0;
  let totalBytes = 0;

  function walk(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const name = entry.name;
      const fullPath = path.join(currentDir, name);
      const zipPath = relativePath ? `${relativePath}/${name}` : name;

      if (entry.isDirectory()) {
        // Exclude root ./data database folder, but keep src/data source directory
        if (name === 'data' && currentDir === ROOT_DIR) continue;
        if (EXCLUDED_DIRS.has(name) && name !== 'data') continue;
        walk(fullPath, zipPath);
      } else if (entry.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (EXCLUDED_EXTENSIONS.has(ext)) continue;
        if (EXCLUDED_FILES.has(name)) continue;
        if (name.startsWith('.env') && name !== '.env.example') continue;

        try {
          const content = fs.readFileSync(fullPath);
          zip.file(zipPath, content);
          fileCount++;
          totalBytes += content.length;
        } catch (err) {
          console.warn(`[Packager] Warning: failed to read ${fullPath}: ${err.message}`);
        }
      }
    }
  }

  walk(ROOT_DIR);

  console.log(`[Packager] Packaging ${fileCount} files (${(totalBytes / 1024 / 1024).toFixed(2)} MB uncompressed)...`);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_ZIP_PUBLIC, zipBuffer);
  fs.writeFileSync(OUTPUT_ZIP_ROOT, zipBuffer);

  const zipMb = (zipBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`✅ [Packager] Successfully built neonforge-os-current.zip: ${zipMb} MB (${zipBuffer.length} bytes)`);
  console.log(`   - Saved to: ${OUTPUT_ZIP_PUBLIC}`);
  console.log(`   - Saved to: ${OUTPUT_ZIP_ROOT}`);

  return {
    buffer: zipBuffer,
    fileCount,
    uncompressedBytes: totalBytes,
    zipBytes: zipBuffer.length
  };
}

// Direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  buildProjectZip().catch((err) => {
    console.error('❌ [Packager] Failed to generate project ZIP:', err);
    process.exit(1);
  });
}
