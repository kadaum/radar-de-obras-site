import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dataRoot = path.join(root, 'public', 'data');
const manifestBytes = fs.readFileSync(path.join(dataRoot, 'projects-manifest.json'));
const manifest = JSON.parse(manifestBytes);
const cities = [
  { name: 'Rio de Janeiro', uf: 'RJ', slug: 'rio-de-janeiro', ids: ['128622.33-16','7207.33-55'] },
  { name: 'São Paulo', uf: 'SP', slug: 'sao-paulo', ids: ['4902.35-23','59693.35-95'] },
  { name: 'Belo Horizonte', uf: 'MG', slug: 'belo-horizonte', ids: ['45919.31-65','92142.31-00'] },
  { name: 'Salvador', uf: 'BA', slug: 'salvador', ids: ['45892.29-61','60185.29-20'] },
  { name: 'Recife', uf: 'PE', slug: 'recife', ids: ['30125.26-63','41201.26-60'] },
];
const hash = crypto.createHash('sha256').update(manifestBytes);
const rows = [];
for (const file of manifest.files) {
  const bytes = fs.readFileSync(path.join(dataRoot, file.url.replace('/data/', '')));
  const chunk = JSON.parse(bytes);
  if (chunk.length !== file.rows) throw new Error(`Count mismatch ${file.url}`);
  hash.update(bytes);
  rows.push(...chunk);
}
if (rows.length !== manifest.total) throw new Error('Manifest total mismatch');
const byId = new Map();
for (const row of rows) {
  if (!row.id || byId.has(row.id)) throw new Error(`Missing or duplicate ID ${row.id}`);
  if (row.investmentTotal !== null && row.investmentTotal !== undefined && (!Number.isFinite(row.investmentTotal) || row.investmentTotal < 0)) throw new Error(`Invalid investment ${row.id}`);
  byId.set(row.id, row);
}
const normalized = (row) => ({
  id: row.id, name: row.name, city: row.city, uf: row.uf, status: row.status,
  organization: row.organization, address: row.address, start: row.start, end: row.end,
  point: row.point, investmentTotal: row.investmentTotal,
});
const result = { version: 1, sourceHash: hash.digest('hex'), source: manifest.meta,
  cities: cities.map(city => {
    const cityRows = rows.filter(row => row.city === city.name && row.uf === city.uf).map(normalized);
    if (cityRows.length < 100 || city.ids.some(id => !cityRows.some(row => row.id === id))) throw new Error(`Insufficient city coverage ${city.name}`);
    return { name: city.name, uf: city.uf, slug: city.slug, ids: city.ids, rows: cityRows };
  }),
};
const dataPath = path.join(root, 'lib', 'organic-data.json');
fs.writeFileSync(dataPath, JSON.stringify(result));

const detailPath = path.join(root, 'lib', 'organic-details.json');
let details = fs.existsSync(detailPath) ? JSON.parse(fs.readFileSync(detailPath)) : {};
const selected = cities.flatMap(city => city.ids);
if (process.argv.includes('--refresh-details')) {
  const next = {};
  for (const id of selected) {
    const row = byId.get(id);
    const url = `https://api-publica.obrasgov.gestao.gov.br/obras/projeto-investimento?id_projeto_investimento=${encodeURIComponent(id)}&pagina=1&tamanho_da_pagina=2`;
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status} for ${id}`);
    const payload = await response.json();
    const raw = payload?.data?.find(item => item.id_projeto_investimento === id);
    if (!raw || raw.uf_principal !== row.uf || raw.desc_nome !== row.name) throw new Error(`Upstream identity mismatch ${id}`);
    const detail = {
      id, description: raw.desc_projeto || null, actualStart: raw.dt_inicial_efetiva || null,
      actualEnd: raw.dt_final_efetiva || null, sourceSystem: raw.sistema_resp || null,
      intervention: raw.especie_intervencao || null, rawStatus: raw.situacao || null,
      rawStart: raw.dt_inicial_prevista || null, rawEnd: raw.dt_final_prevista || null,
      rawInvestment: Array.isArray(raw.investimentos_previstos) ? raw.investimentos_previstos.map(item => ({
        source: item.desc_nome_fonte_recurso || null, plannedBRL: Number.isFinite(item.vl_investimento_previsto) ? item.vl_investimento_previsto : null,
      })) : [],
      rawOrganization: raw.organizacao_resp || null,
      checkedAt: new Date().toISOString(), sourceUrl: url,
    };
    if (raw.situacao !== row.status || raw.dt_inicial_prevista !== row.start || raw.dt_final_prevista !== row.end || raw.organizacao_resp !== row.organization) {
      detail.snapshotDifference = true;
    }
    next[id] = detail;
  }
  details = next;
  fs.writeFileSync(detailPath, JSON.stringify(details));
}
if (selected.some(id => !details[id])) throw new Error('Missing selected detail; run --refresh-details after checking source');
const pilot = selected.map(id => {
  const row = normalized(byId.get(id));
  const d = details[id];
  return { ...row, description: d.description, actualStart: d.actualStart, actualEnd: d.actualEnd,
    sourceSystem: d.sourceSystem, intervention: d.intervention, detailCheckedAt: d.checkedAt, sourceUrl: d.sourceUrl };
});
fs.mkdirSync(path.join(root, 'public', 'dados'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'dados', 'piloto-obras.json'), JSON.stringify({
  description: 'Dez fichas piloto. Campos de status, previsão, organização e valor vêm do snapshot do mapa; descrição e datas efetivas vêm de consulta complementar à API.',
  sourceSnapshotCollectedAt: manifest.meta.collectedAt, investmentCollectedAt: manifest.meta.investmentCollectedAt,
  rows: pilot,
}));
const fields = ['id','name','city','uf','status','organization','start','end','actualStart','actualEnd','investmentTotal','detailCheckedAt','sourceUrl'];
const csv = [fields.join(','), ...pilot.map(row => fields.map(field => {
  const value = row[field] == null ? '' : String(row[field]);
  return `"${value.replaceAll('"','""')}"`;
}).join(','))].join('\r\n') + '\r\n';
fs.writeFileSync(path.join(root, 'public', 'dados', 'piloto-obras.csv'), '\ufeff' + csv);
console.log(JSON.stringify({ total: rows.length, unique: byId.size, pilot: pilot.length, cities: result.cities.map(city => [city.slug, city.rows.length]), sourceHash: result.sourceHash, refreshed: process.argv.includes('--refresh-details') }));
