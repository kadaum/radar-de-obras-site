// Build the vendored, editable map source and publish its HTML metadata with the assets.
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';
const root = process.cwd();
const publicHtmlPath = path.join(root, 'public', 'radar.html');
const previousHtml = fs.existsSync(publicHtmlPath) ? fs.readFileSync(publicHtmlPath, 'utf8') : '';
const previousAssets = [...previousHtml.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g)].map(match => match[1]);
const outDir = path.join(root, '.sites-runtime', 'map-dist');
await build({ configFile: false, root: path.join(root, 'map-source'), publicDir: false,
  build: { outDir, emptyOutDir: true, assetsDir: 'assets' } });
const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const js = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
const css = html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
if (!js || !css) throw new Error('Map build did not produce its expected assets');
const assetsDir = path.join(root, 'public', 'assets');
fs.mkdirSync(assetsDir, { recursive: true });
for (const name of fs.readdirSync(path.join(outDir, 'assets'))) {
  fs.copyFileSync(path.join(outDir, 'assets', name), path.join(assetsDir, name));
}
fs.writeFileSync(publicHtmlPath, html);
// Preserve the current and immediately preceding entry points for open tabs.
// Move only Vite-generated index bundles; unrelated assets and workers stay intact.
const keep = new Set([...fs.readdirSync(path.join(outDir, 'assets')), ...previousAssets]);
const archive = path.resolve(root, '.sites-runtime', 'map-assets-archive', new Date().toISOString().replace(/[:.]/g, '-'));
const archived = [];
for (const name of fs.readdirSync(assetsDir)) {
  if (!/^index-[A-Za-z0-9_-]+\.(js|css)$/.test(name) || keep.has(name)) continue;
  const source = path.resolve(assetsDir, name), target = path.resolve(archive, name);
  if (path.dirname(source) !== path.resolve(assetsDir) || path.dirname(target) !== archive || !archive.startsWith(path.resolve(root, '.sites-runtime') + path.sep)) throw new Error('Unsafe asset archive path');
  if (!fs.statSync(source).isFile()) throw new Error('Expected generated asset file');
  fs.mkdirSync(archive, {recursive: true});
  fs.renameSync(source, target); archived.push(name);
}
console.log(JSON.stringify({archived, retainedPrevious: previousAssets}));
console.log(JSON.stringify({ js, css, worker: 'bundled with content hash' }));
