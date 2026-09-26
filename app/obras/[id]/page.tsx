import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { DiscoveryShell, PageSchema } from '@/components/discovery';
import { formatDate, formatMoney, getWork, workPath, sourceLink, SOURCE_PAGE } from '@/lib/organic';
import { nationalWork, nationalManifest } from '@/lib/national-work';
import { pageMetadata } from '@/lib/metadata';
import {WorkClassification} from '@/components/work-classification';
import {NationalProjectContext} from '@/components/national-context';
import {OfficialWorkRecords} from '@/components/official-work-records';
import {nationalNearby} from '@/lib/national-nearby';
import {WorkLocation, WorkOverview} from '@/components/work-overview';
import {WorkNavigation} from '@/components/work-navigation';
import {officialPageRecords} from '@/lib/official-page-cache.mjs';
import type {PageRecords} from '@/components/official-work-records';
import {DerivedWorkType} from '@/components/derived-work-type';
import {indexableNationalWork} from '@/lib/national-eligibility.mjs';

type Props={params:Promise<{id:string}>};
export async function generateMetadata({params}:Props){
 const {id}=await params;const work=await nationalWork(id);if(!work)return {};
 return pageMetadata(`/obras/${id}`,`${work.name} — ${id} | Radar de Obras`,`${work.name}, ${work.city || work.uf || 'localização não informada'}. Situação informada: ${work.status}. Investimento previsto, localização e órgão responsável. Cadastro Obrasgov ${id}.`,{index:indexableNationalWork(work),follow:true});
}
export default async function NationalWorkPage({params}:Props){
 const {id}=await params;if(getWork(id))permanentRedirect(workPath(id));
 const work=await nationalWork(id);if(!work)notFound();
 const path=`/obras/${id}`;
 const nearby=await nationalNearby(work);
 const records=await officialPageRecords(id) as PageRecords;
 const execution=records.executions.complete && records.executions.rows.length===1 ? records.executions.rows[0] : null;
 return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Fichas',path:'/obras'},{name:`Projeto ${id}`,path}]}>
  <PageSchema path={path} name={work.name} description={`Cadastro Obrasgov ${id}. Situação informada: ${work.status}.`} />
  <article className="work-page work-with-navigation"><WorkNavigation sections={[{id:'resumo',label:'Resumo'},{id:'cadastro',label:'Dados do cadastro'},{id:'sobre',label:'Sobre a obra'},{id:'classificacao-oficial',label:'Classificação'},{id:'responsaveis',label:'Responsáveis'},{id:'localizacao',label:'Localização'},{id:'contratos-andamento',label:'Contratos'},{id:'execucao-fisica',label:'Andamento'},{id:'empenhos',label:'Empenhos e pagamentos'},{id:'estudos',label:'Estudos'},{id:'fontes',label:'Fontes e atualização'}]}/><div className="work-content"><header id="resumo" className="work-heading"><div className="eyebrow">{work.city || work.uf} · Projeto {id}</div><h1>{work.name}</h1><WorkClassification id={id} classification={work.context.classification.map(x=>({type:x.tipo}))}/><div className="work-heading-actions"><Link prefetch={false} href={`/radar.html?obra=${encodeURIComponent(id)}`}>Abrir no mapa ↗</Link><Link prefetch={false} href="/radar.html?view=list">Voltar à lista de obras</Link></div></header>
   <WorkOverview work={work} collectedAt={nationalManifest.collectedAt} official={{percent:execution?.percentual_execucao_fisica??null,updatedAt:execution?.dt_atualizacao_execucao||execution?.dt_cadastro_execucao||null,multiple:records.executions.rows.length>1,complete:records.executions.complete}}/>
   <div className="work-reading"><section id="cadastro" className="enrichment-section"><h2>Resumo do cadastro</h2><dl className="detail-list">
    <div><dt>Situação informada</dt><dd>{work.status || 'Não informada'}</dd></div>
    <div><dt>Investimento previsto</dt><dd>{formatMoney(work.investmentTotal)}</dd></div>
    <div><dt>Organização responsável</dt><dd>{work.organization || 'Não informada'}</dd></div>
    <div><dt>Localização informada</dt><dd>{work.address || work.city || work.uf || 'Não informada'}</dd></div>
    <div><dt>Início previsto</dt><dd>{formatDate(work.start)}</dd></div><div><dt>Término previsto</dt><dd>{formatDate(work.end)}</dd></div>
   </dl><p className="context-note">Investimento previsto não é pagamento. Previsões vencidas não comprovam atraso. O endereço pode ser uma referência administrativa.</p></section>
   <NationalProjectContext context={work.context}/>
   <DerivedWorkType title={work.name}/>
   <WorkLocation work={work} nearbyRecords={nearby}/>
   <OfficialWorkRecords id={id} records={records}/>
   <div className="work-heading-actions"><Link prefetch={false} href={`/radar.html?obra=${encodeURIComponent(id)}`}>Ver no mapa e consultar detalhes atualizados</Link><Link prefetch={false} href="/radar.html?view=list">Voltar à lista de obras</Link></div>
   <section id="fontes" className="enrichment-section"><h2>Fonte e atualização</h2><p>Esta ficha preserva o cadastro da carga {formatDate(nationalManifest.sourceLoad)}. A consulta complementar de contratos e andamento tem data própria; falhas dessa consulta não apagam o cadastro preservado.</p><a href={SOURCE_PAGE}>Sobre a base pública Obrasgov ↗</a><details className="record-details"><summary>Registro técnico da fonte</summary><a href={sourceLink(id)}>Consultar dados brutos deste projeto (JSON) ↗</a></details></section>
  </div></div></article>
 </DiscoveryShell>;
}
