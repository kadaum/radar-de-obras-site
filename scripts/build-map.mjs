// Build the vendored, editable map source and publish its HTML metadata with the assets.
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';
const root = process.cwd();
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
const publicHtmlPath = path.join(root, 'public', 'radar.html');
fs.writeFileSync(publicHtmlPath, html);
console.log(JSON.stringify({ js, css, worker: 'bundled with content hash' }));
