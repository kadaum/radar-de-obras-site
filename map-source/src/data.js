import {geographyCheck} from './geography.js';
export const API='https://api-publica.obrasgov.gestao.gov.br/obras';
export function validPoint(p){return Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=-74&&p[0]<=-28&&p[1]>=-34&&p[1]<=6;}
export function coordinates(pins){
 const result=[];
 for(const pin of pins??[]){
  const direct=[Number(pin.longitude),Number(pin.latitude)];
  const wkt=String(pin.pin??'').match(/POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
  const parsed=wkt?[Number(wkt[1]),Number(wkt[2])]:null;
  if(validPoint(direct)&&validPoint(parsed)&&Math.hypot(direct[0]-parsed[0],direct[1]-parsed[1])>0.0001) continue;
  if(validPoint(direct)) result.push({point:direct,method:'Campos de latitude e longitude da fonte'});
  else if(validPoint(parsed)) result.push({point:parsed,method:'Coordenada lida do POINT da própria fonte; campos numéricos inconsistentes'});
 }
 return result;
}
export function normalize(raw,details={},collectedAt){
 const candidatePoints=coordinates(raw.pins).map(p=>({...p,geography:geographyCheck(p.point)}));
 const points=candidatePoints.filter(p=>p.geography!=='outside');
 for(const p of points)if(p.geography==='near-boundary')p.method+=' · Perto da costa ou fronteira da malha simplificada do IBGE; localização requer conferência';
 const executions=details['execucao-fisica']??[];
 const execution=[...executions].sort((a,b)=>String(b.dt_atualizacao_execucao??'').localeCompare(String(a.dt_atualizacao_execucao??'')))[0]??null;
 return {id:raw.id_projeto_investimento,name:raw.desc_nome||'Projeto sem título informado',description:raw.desc_projeto,
  uf:raw.uf_principal,status:raw.situacao||'Não informada',address:raw.desc_endereco,cep:raw.nr_cep,
  city:[...new Set((details.geometria??[]).map(g=>g.no_municipio).filter(Boolean))].join(' / ')||null,localities:details.geometria??[],start:raw.dt_inicial_prevista,end:raw.dt_final_prevista,
  actualStart:raw.dt_inicial_efetiva,actualEnd:raw.dt_final_efetiva,organization:raw.organizacao_resp,
  organizationCnpj:raw.cnpj_organizacao_resp,kind:raw.especie_intervencao,sourceSystem:raw.sistema_resp,
  points,rejectedPoints:candidatePoints.filter(p=>p.geography==='outside'),point:points[0]?.point??null,locationMethod:points.length>1?'Projeto com múltiplos pontos; exibindo o primeiro ponto aceito na triagem. Municípios referem-se ao conjunto do projeto.':points[0]?.method??(candidatePoints.length?'Ponto fora da malha do Brasil: requer conferência. A malha simplificada do IBGE pode excluir ilhas e pontos costeiros.':'Coordenada ausente, inválida ou divergente; requer conferência'),
  investments:raw.investimentos_previstos??[],executors:raw.executores??[],execution,
  commitments:details.empenho??[],contracts:details.contrato??[],history:details['historico-situacao-cancelada-paralisada']??[],
  detailsChecked:!!details.geometria,detailErrors:[],collectedAt,sourceUrl:`${API}/projeto-investimento?id_projeto_investimento=${encodeURIComponent(raw.id_projeto_investimento)}`};
}
export function expired(project,today=new Date().toISOString().slice(0,10)){
 return !!project.end&&project.end<today&&!['Concluída','Cancelada'].includes(project.status);
}
