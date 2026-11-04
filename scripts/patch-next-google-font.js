/* eslint-disable @typescript-eslint/no-require-imports -- Node runs this postinstall file as CommonJS. */
/**
 * Next.js 16.3.1 crashes in next/font/google when Google Fonts returns an
 * extensionless URL such as https://fonts.gstatic.com/l/font?kit=...
 * The loader does regex.exec(url)[1], and that exec is null.
 *
 * Stable 16.4.2 still has this crash. The upstream fix is only on canary.
 * Same Google fonts stay in use. When a URL has no extension, the file type
 * comes from the CSS format() hint, otherwise woff2.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const findFile = path.join(
  root,
  "node_modules/next/dist/compiled/@next/font/dist/google/find-font-files-in-css.js",
);
const loaderFile = path.join(
  root,
  "node_modules/next/dist/compiled/@next/font/dist/google/loader.js",
);

const findFrom = `            const googleFontFileUrl = (_b = /src: url\\((.+?)\\)/.exec(line)) === null || _b === void 0 ? void 0 : _b[1];
            if (googleFontFileUrl &&
                !fontFiles.some((foundFile) => foundFile.googleFontFileUrl === googleFontFileUrl)) {
                // Found the font file in the @font-face declaration.
                fontFiles.push({
                    googleFontFileUrl,
                    preloadFontFile: !!(subsetsToPreload === null || subsetsToPreload === void 0 ? void 0 : subsetsToPreload.includes(currentSubset)),
                });
            }`;

const findTo = `            const srcMatch = /src: url\\((.+?)\\)(?:\\s+format\\('(\\w+)'\\))?/.exec(line);
            const googleFontFileUrl = srcMatch === null || srcMatch === void 0 ? void 0 : srcMatch[1];
            const fontFormat = srcMatch === null || srcMatch === void 0 ? void 0 : srcMatch[2];
            if (googleFontFileUrl &&
                !fontFiles.some((foundFile) => foundFile.googleFontFileUrl === googleFontFileUrl)) {
                // Found the font file in the @font-face declaration.
                fontFiles.push({
                    googleFontFileUrl,
                    fontFormat,
                    preloadFontFile: !!(subsetsToPreload === null || subsetsToPreload === void 0 ? void 0 : subsetsToPreload.includes(currentSubset)),
                });
            }`;

const loaderFrom = `        const downloadedFiles = await Promise.all(fontFiles.map(async ({ googleFontFileUrl, preloadFontFile }) => {`;
const loaderTo = `        const downloadedFiles = await Promise.all(fontFiles.map(async ({ googleFontFileUrl, preloadFontFile, fontFormat }) => {`;

const extFrom = `            const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];`;
const extTo = `            const extMatch = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl);
            const ext = extMatch ? extMatch[1] : (fontFormat || 'woff2');`;

function replaceOnce(file, from, to, label) {
  const source = fs.readFileSync(file, "utf8");
  if (source.includes(to)) return "already patched";
  if (!source.includes(from)) {
    throw new Error(`${label} pattern not found in ${path.relative(root, file)}`);
  }
  fs.writeFileSync(file, source.replace(from, to));
  return "patched";
}

const findResult = replaceOnce(findFile, findFrom, findTo, "find-font-files-in-css");
const mapResult = replaceOnce(loaderFile, loaderFrom, loaderTo, "loader map");
const extResult = replaceOnce(loaderFile, extFrom, extTo, "loader extension");

const { findFontFilesInCss } = require(findFile);
const extensionless = findFontFilesInCss(
  "/* latin */\n@font-face {\n  src: url(https://fonts.gstatic.com/l/font?kit=abc&skey=def&v=v20) format('woff2');\n}\n",
  ["latin"],
);
const normal = findFontFilesInCss(
  "/* latin */\n@font-face {\n  src: url(https://fonts.gstatic.com/s/rubik/v31/file.woff2) format('woff2');\n}\n",
  ["latin"],
);
if (extensionless[0]?.fontFormat !== "woff2" || !extensionless[0].googleFontFileUrl.includes("/l/font")) {
  throw new Error("Extensionless Google font URL was not parsed.");
}
if (!normal[0]?.googleFontFileUrl.endsWith(".woff2") || normal[0].fontFormat !== "woff2") {
  throw new Error("Normal .woff2 Google font URL was not parsed.");
}

console.log(`next/font Google loader: find ${findResult}, map ${mapResult}, extension ${extResult}`);
