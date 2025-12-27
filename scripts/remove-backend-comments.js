const fs = require("fs").promises;
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "backend");
const SKIP_DIRS = ["node_modules"];
const SKIP_FILES = ["package-lock.json"];

const extHandlers = {
  ".js": stripJSComments,
  ".mjs": stripJSComments,
};

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (
        SKIP_DIRS.some(
          (d) =>
            full.includes(path.sep + d + path.sep) ||
            full.endsWith(path.sep + d)
        )
      )
        continue;
      await walk(full);
    } else if (ent.isFile()) {
      if (SKIP_FILES.includes(ent.name)) continue;
      await processFile(full);
    }
  }
}

function getHandlerFor(file) {
  const ext = path.extname(file).toLowerCase();
  return extHandlers[ext];
}

async function processFile(file) {
  const handler = getHandlerFor(file);
  if (!handler) return;
  try {
    let src = await fs.readFile(file, "utf8");
    const cleaned = handler(src);
    if (cleaned !== src) {
      await fs.writeFile(file, cleaned, "utf8");
      console.log("Updated:", path.relative(process.cwd(), file));
    }
  } catch (err) {
    console.error("Failed:", file, err.message);
  }
}

function stripJSComments(src) {
  let out = src;
  // Remove block comments /* ... */
  out = out.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove single-line comments (//...) but preserve http:// and https://
  out = out.replace(/(^|[^:\\])\/\/.*$/gm, "$1");
  return out;
}

async function main() {
  try {
    const stat = await fs.stat(ROOT);
    if (!stat.isDirectory()) throw new Error("backend/ not found");
  } catch (e) {
    console.error("backend/ folder not found at", ROOT);
    process.exit(1);
  }

  console.log("Scanning", ROOT);
  await walk(ROOT);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
