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
import {WorkLocation} from '@/components/work-overview';
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
 return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Fichas',path:'/obras'},{name:`Projeto ${id}`,path}]}>
  <PageSchema path={path} name={work.name} description={`Cadastro Obrasgov ${id}. Situação informada: ${work.status}.`} />
  <article className="work-page"><header className="work-heading"><div className="eyebrow">{work.city || work.uf} · Projeto {id}</div><h1>{work.name}</h1><WorkClassification id={id} classification={work.context.classification.map(x=>({type:x.tipo}))}/><p>Dados do cadastro público, consultados em {formatDate(nationalManifest.collectedAt)}.</p></header>
   <section className="enrichment-section"><h2>Resumo do cadastro</h2><dl className="detail-list">
    <div><dt>Situação informada</dt><dd>{work.status || 'Não informada'}</dd></div>
    <div><dt>Investimento previsto</dt><dd>{formatMoney(work.investmentTotal)}</dd></div>
    <div><dt>Organização responsável</dt><dd>{work.organization || 'Não informada'}</dd></div>
    <div><dt>Localização informada</dt><dd>{work.address || work.city || work.uf || 'Não informada'}</dd></div>
    <div><dt>Início previsto</dt><dd>{formatDate(work.start)}</dd></div><div><dt>Término previsto</dt><dd>{formatDate(work.end)}</dd></div>
   </dl><p className="context-note">Investimento previsto não é pagamento. Previsões vencidas não comprovam atraso. O endereço pode ser uma referência administrativa.</p></section>
   <NationalProjectContext context={work.context}/>
   <DerivedWorkType title={work.name}/>
   <WorkLocation work={work} nearbyRecords={nearby}/>
   <OfficialWorkRecords id={id}/>
   <div className="work-heading-actions"><Link prefetch={false} href={`/radar.html?obra=${encodeURIComponent(id)}`}>Ver no mapa e consultar detalhes atualizados</Link><Link prefetch={false} href="/radar.html?view=list">Voltar à lista de obras</Link></div>
   <section className="enrichment-section"><h2>Fonte e atualização</h2><p>Esta ficha preserva o cadastro da carga {formatDate(nationalManifest.sourceLoad)}. A consulta complementar de contratos e andamento tem data própria; falhas dessa consulta não apagam o cadastro preservado.</p><a href={SOURCE_PAGE}>Sobre a base pública Obrasgov ↗</a><details className="record-details"><summary>Registro técnico da fonte</summary><a href={sourceLink(id)}>Consultar dados brutos deste projeto (JSON) ↗</a></details></section>
  </article>
 </DiscoveryShell>;
}
