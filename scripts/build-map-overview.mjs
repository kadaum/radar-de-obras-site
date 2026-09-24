// A truthful, compact national overview: each point represents all source
// coordinates in a half-degree cell. Detailed points load by viewport later.
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('public/data/projects-manifest.json', 'utf8'));
const cells = new Map();
let total = 0, withPoint = 0;
for (const file of manifest.files) {
  const rows = JSON.parse(fs.readFileSync(`public${file.url}`, 'utf8'));
  if (rows.length !== file.rows) throw new Error(`Count mismatch in ${file.url}`);
  for (const row of rows) {
    total++;
    if (!row.point) continue;
    withPoint++;
    const [lon, lat] = row.point;
    const key = `${Math.floor(lon * 2)},${Math.floor(lat * 2)}`;
    const cell = cells.get(key) ?? { lon: 0, lat: 0, count: 0 };
    cell.lon += lon; cell.lat += lat; cell.count++;
    cells.set(key, cell);
  }
}
if (total !== manifest.total) throw new Error('Overview total differs from validated manifest');
const features = [...cells.values()].map((cell, index) => ({ type: 'Feature',
  geometry: { type: 'Point', coordinates: [cell.lon / cell.count, cell.lat / cell.count] },
  properties: { cell: index, count: cell.count, color: '#526b5a' } }));
if (features.reduce((sum, feature) => sum + feature.properties.count, 0) !== withPoint) throw new Error('Overview point total mismatch');
const result = { sourceLoad: manifest.meta.sourceLoad, total, withPoint,
  featureCollection: { type: 'FeatureCollection', features } };
fs.writeFileSync('public/data/map-overview.json', JSON.stringify(result));
console.log(JSON.stringify({ total, withPoint, cells: features.length, bytes: fs.statSync('public/data/map-overview.json').size }));
