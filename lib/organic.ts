import snapshot from './organic-data.json';
import details from './organic-details.json';

export const ORIGIN = 'https://radar-obras.ricardoguia.com';
export const API = 'https://api-publica.obrasgov.gestao.gov.br/obras';
export const SOURCE_PAGE = 'https://www.gov.br/obrasgov/pt-br/ferramentas-de-gestao-e-transparencia/api-de-dados-abertos-obrasgov-br_novo';
export const data = snapshot;
export type Work = (typeof data.cities)[number]['rows'][number];
export type City = (typeof data.cities)[number];
export const workSlugs: Record<string, string> = {
  '128622.33-16': 'reforma-pavilhao-rocha-lima-fiocruz',
  '7207.33-55': 'redes-esgoto-aguas-pluviais-hospital-bonsucesso',
  '4902.35-23': 'restaurante-estudantil-campus-pirituba',
  '59693.35-95': 'reforma-hospital-ruminantes-usp',
  '45919.31-65': 'anexo-escola-enfermagem-ufmg',
  '92142.31-00': 'manutencao-casa-conde-santa-marinha',
  '45892.29-61': 'escola-de-musica-ufba-segunda-etapa',
  '60185.29-20': 'recuperacao-fachadas-fiocruz-bahia',
  '30125.26-63': 'prevencao-incendio-hospital-clinicas-pe',
  '41201.26-60': 'residenciais-aeronautica-recife',
};
export const displayNames: Record<string,string> = {
  '128622.33-16':'Reforma do Pavilhão Rocha Lima da Fiocruz',
  '7207.33-55':'Redes de esgoto e águas pluviais do Hospital Federal de Bonsucesso',
  '4902.35-23':'Restaurante estudantil do campus Pirituba',
  '59693.35-95':'Reforma do Hospital de Ruminantes da USP',
  '45919.31-65':'Anexo da Escola de Enfermagem da UFMG',
  '92142.31-00':'Manutenção da Casa do Conde de Santa Marinha',
  '45892.29-61':'Segunda etapa da Escola de Música da UFBA',
  '60185.29-20':'Recuperação das fachadas da Fiocruz Bahia',
  '30125.26-63':'Prevenção de incêndio no Hospital das Clínicas de Pernambuco',
  '41201.26-60':'Residenciais da Aeronáutica em Recife',
};
export const detailData = details as Record<string, {
  id: string; description: string | null; actualStart: string | null; actualEnd: string | null;
  sourceSystem: string | null; intervention: string | null; rawStatus: string | null;
  rawStart: string | null; rawEnd: string | null; rawInvestment: {source: string | null; plannedBRL: number | null}[];
  rawOrganization: string | null; checkedAt: string; sourceUrl: string; snapshotDifference?: boolean;
}>;
export function cityPath(city: City) { return `/cidades/${city.uf.toLowerCase()}/${city.slug}`; }
export function workPath(id: string) { return `/obras/${encodeURIComponent(id)}/${workSlugs[id]}`; }
export function getCity(uf: string, slug: string) { return data.cities.find(c => c.uf.toLowerCase() === uf && c.slug === slug); }
export function getWork(id: string) {
  for (const city of data.cities) {
    if (!city.ids.includes(id)) continue;
    const work = city.rows.find(row => row.id === id);
    if (work) return { work, city, detail: detailData[id] };
  }
  return null;
}
export function formatDate(value: string | null | undefined) {
  if (!value) return 'Não informada';
  const [y,m,d] = value.slice(0,10).split('-');
  return y && m && d ? `${d}/${m}/${y}` : value;
}
export function formatMoney(value: number | null | undefined) {
  return typeof value === 'number' && value > 0 ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value) : 'Sem valor positivo informado';
}
export function sourceLink(id: string) { return `${API}/projeto-investimento?id_projeto_investimento=${encodeURIComponent(id)}`; }
export function mapLink(work: Work) {
  return `/radar.html?obra=${encodeURIComponent(work.id)}`;
}
export function jsonLd(value: object) { return JSON.stringify(value).replaceAll('<', '\\u003c'); }
export function breadcrumb(items: {name:string;path:string}[]) {
  return { '@context':'https://schema.org', '@type':'BreadcrumbList', '@id': `${ORIGIN}${items.at(-1)?.path}#breadcrumbs`,
    itemListElement: items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:`${ORIGIN}${item.path}`})) };
}
