import fs from 'node:fs';
const path = 'public/assets/index-Cx3WXIQT.js';
const input = fs.readFileSync(path, 'utf8');
const before = 'await LP(),FP(),setInterval(LP,3e5);';
const after = 'await LP(),FP();const deepId=new URLSearchParams(window.location.search).get(`obra`);if(deepId&&eP.some(project=>project.id===deepId))MP(deepId);setInterval(LP,3e5);';
const paths = {
  '128622.33-16': '/obras/128622.33-16/reforma-pavilhao-rocha-lima-fiocruz',
  '7207.33-55': '/obras/7207.33-55/redes-esgoto-aguas-pluviais-hospital-bonsucesso',
  '4902.35-23': '/obras/4902.35-23/restaurante-estudantil-campus-pirituba',
  '59693.35-95': '/obras/59693.35-95/reforma-hospital-ruminantes-usp',
  '45919.31-65': '/obras/45919.31-65/anexo-escola-enfermagem-ufmg',
  '92142.31-00': '/obras/92142.31-00/manutencao-casa-conde-santa-marinha',
  '45892.29-61': '/obras/45892.29-61/escola-de-musica-ufba-segunda-etapa',
  '60185.29-20': '/obras/60185.29-20/recuperacao-fachadas-fiocruz-bahia',
  '30125.26-63': '/obras/30125.26-63/prevencao-incendio-hospital-clinicas-pe',
  '41201.26-60': '/obras/41201.26-60/residenciais-aeronautica-recife',
};
let output = input;
if (!output.includes(after)) {
  if (output.split(before).length !== 2) throw new Error('Expected a single map initialization target; inspect upstream bundle');
  output = output.replace(before, after);
}
const detailBefore = 'n.innerHTML=`<div class="detail-toolbar"';
const detailAfter = `const publicPath=${JSON.stringify(paths)}[t.id];n.innerHTML=\`<div class="detail-toolbar"`;
if (!output.includes(detailAfter)) {
  if (output.split(detailBefore).length !== 2) throw new Error('Expected a single detail header target; inspect upstream bundle');
  output = output.replace(detailBefore, detailAfter);
}
const scrollBefore = '<div class="detail-scroll">${e?';
const scrollAfter = '<div class="detail-scroll">${publicPath?`<a class="source-link" href="${publicPath}" target="_top">Ver ficha pública e dados para citação ↗</a>`:``}${e?';
if (!output.includes(scrollAfter)) {
  if (output.split(scrollBefore).length !== 2) throw new Error('Expected a single detail scroll target; inspect upstream bundle');
  output = output.replace(scrollBefore, scrollAfter);
}
if (output !== input) fs.writeFileSync(path, output);
console.log('Map project links installed');
