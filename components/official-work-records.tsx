import {officialRecords} from '@/lib/official-records.mjs';
import {officialPageRecords} from '@/lib/official-page-cache.mjs';
import {formatDate} from '@/lib/organic';
type Result=Awaited<ReturnType<typeof officialRecords>>;
const money=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(x):'Não informado';
function documentUrl(value:unknown){try{if(typeof value!=='string')return null;const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
function Completeness({result,label}:{result:Result;label:string}){
 if(result.complete)return null;
 return <p className="context-note">{result.rows.length?`${label}: consulta parcial. Há registros adicionais ou indisponíveis.`:`${label}: a consulta está indisponível. Isso não significa ausência de registros.`}</p>;
}
export async function OfficialWorkRecords({id}:{id:string}){
 const {contracts,executions,checkedAt}=await officialPageRecords(id) as {contracts:Result;executions:Result;checkedAt:string};
 return <section className="enrichment-section" id="contratos-andamento"><h2>Contratos e andamento</h2>
  <p className="source-caption">Consulta complementar ao Obrasgov em {formatDate(checkedAt)}. Pode ser mais recente que o cadastro acima. Resultados completos podem ser reutilizados por até 6 horas.</p>
  <Completeness result={contracts} label="Contratos"/>
  {contracts.rows.length>0?<details className="record-details"><summary>{contracts.rows.length} contrato(s): empresas, valores e documentos{!contracts.complete?' — parcial':''}</summary><div className="record-grid">{contracts.rows.map((c,index)=>{const url=documentUrl(c.link_transparencia);return <article className="record-card" key={`${c.id_contrato}-${index}`}><h3>Contrato {c.numero_contrato||'sem número informado'}</h3><dl className="compact-list"><div><dt>Empresa contratada</dt><dd>{c.fornecedor_contrato||'Não informada'}</dd></div><div><dt>CNPJ da empresa</dt><dd>{c.cnpj_fornecedor_contrato||'Não informado'}</dd></div><div><dt>Valor global do contrato</dt><dd>{money(c.valor_global_contrato)}</dd></div><div><dt>Vigência informada</dt><dd>{formatDate(c.vigencia_inicio_contrato)} a {formatDate(c.vigencia_fim_contrato)}</dd></div><div><dt>Licitação</dt><dd>{c.licitacao_numero||'Não informada'}</dd></div><div><dt>Processo</dt><dd>{c.processo||'Não informado'}</dd></div></dl>{c.objeto_contrato&&<p>{c.objeto_contrato}</p>}{url&&<a href={url} target="_blank" rel="noopener noreferrer">Documento oficial do contrato ↗</a>}</article>;})}</div><p className="context-note">O objeto e a vigência definem o vínculo da empresa. Não afirmam atuação atual. Valor contratual e investimento previsto são medidas diferentes.</p></details>:contracts.complete&&<p>Nenhum contrato retornado nesta consulta. Isso não prova que não houve contratação.</p>}
  <Completeness result={executions} label="Andamento"/>
  {executions.rows.length>0?<details className="record-details"><summary>{executions.rows.length} medição(ões) de execução física{!executions.complete?' — parcial':''}</summary>{executions.rows.map((e,index)=><dl className="detail-list" key={`${e.id_execucao_fisica}-${index}`}><div><dt>Execução física informada</dt><dd>{typeof e.percentual_execucao_fisica==='number'?`${e.percentual_execucao_fisica.toLocaleString('pt-BR')}%`:'Não informada'}</dd></div><div><dt>Atualização do registro</dt><dd>{formatDate(e.dt_atualizacao_execucao||e.dt_cadastro_execucao)}</dd></div><div><dt>Início registrado</dt><dd>{formatDate(e.dt_inicial_execucao)}</dd></div><div><dt>Fim registrado</dt><dd>{formatDate(e.dt_final_execucao)}</dd></div></dl>)}<p className="context-note">Medições podem se referir a instrumentos diferentes. Não foram somadas e não comprovam entrega ou funcionamento.</p></details>:executions.complete&&<p>Nenhuma medição retornada nesta consulta.</p>}
 </section>;
}

