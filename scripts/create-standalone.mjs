import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist");
const htmlPath = path.join(outputDirectory, "index.html");
let html = await readFile(htmlPath, "utf8");

const scriptMatch = html.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/i);
const styleMatch = html.match(/<link\b[^>]*\bhref="([^"]+)"[^>]*>/i);

if (!scriptMatch || !styleMatch) {
  throw new Error("Could not find the production JavaScript and CSS in dist/index.html");
}

const scriptPath = path.join(outputDirectory, scriptMatch[1].replace(/^\.\//, ""));
const stylePath = path.join(outputDirectory, styleMatch[1].replace(/^\.\//, ""));
let script = await readFile(scriptPath, "utf8");
const style = await readFile(stylePath, "utf8");
const assetPattern = /new URL\(`([^`]+)`,import\.meta\.url\)\.href/g;
const assetMatches = [...script.matchAll(assetPattern)];

if (assetMatches.length === 0) {
  throw new Error("Could not find the bundled asset URLs in the production JavaScript");
}

for (const [, assetName] of assetMatches) {
  const assetPath = path.join(path.dirname(scriptPath), assetName);
  const asset = await readFile(assetPath);
  const extension = path.extname(assetPath).toLowerCase();
  const mimeType =
    extension === ".png"
      ? "image/png"
      : extension === ".svg"
        ? "image/svg+xml"
        : "application/octet-stream";
  const dataUrl = `data:${mimeType};base64,${asset.toString("base64")}`;
  script = script.replaceAll(`new URL(\`${assetName}\`,import.meta.url).href`, JSON.stringify(dataUrl));
}

if (script.includes("import.meta")) {
  throw new Error("The standalone JavaScript still contains import.meta references");
}

if (!html.includes("</body>")) {
  throw new Error("Could not find the closing body tag in dist/index.html");
}

html = html
  .replace(styleMatch[0], `<style>${style.replace(/<\/style/gi, "<\\/style")}</style>`);
html = html.replace(scriptMatch[0], "");
html = html.replace(
  "</body>",
  `<script>${script.replace(/<\/script/gi, "<\\/script")}</script></body>`,
);

await writeFile(htmlPath, html);
console.log(`Created standalone HTML at ${path.relative(projectRoot, htmlPath)}`);
