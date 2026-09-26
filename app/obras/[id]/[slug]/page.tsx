import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DiscoveryShell, PageSchema } from '@/components/discovery';
import { EvidenceNote, TechnicalSources, WorkEnrichment } from '@/components/work-enrichment';
import { WorkOverview, WorkLocation, WorkPublicContext } from '@/components/work-overview';
import { ContributionForm } from '@/components/contribution-form';
import { DerivedWorkType } from '@/components/derived-work-type';
import { WorkNavigation } from '@/components/work-navigation';
import { WorkClassification } from '@/components/work-classification';
import { cityPath, data, displayNames, formatDate, getWork, mapLink, workPath, workSlugs } from '@/lib/organic';
import { pageMetadata } from '@/lib/metadata';

type Props={params:Promise<{id:string;slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id,slug}=await params;const found=getWork(id);if(!found||workSlugs[id]!==slug)return {};
  return pageMetadata(workPath(id),displayNames[id]+' | Radar de Obras',displayNames[id]+' em '+found.city.name+'/'+found.city.uf+': situação, prazo, responsáveis, contratos e execução física quando informados. Projeto '+id+', com fontes oficiais.');
}
export default async function WorkPage({params}:Props){
  const {id,slug}=await params;const found=getWork(id);if(!found||workSlugs[id]!==slug)notFound();
  const {work,city,detail}=found;const path=workPath(id);
  const inconsistent=!!detail.actualEnd && !!work.start && detail.actualEnd<work.start;
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Cidades',path:'/cidades'},{name:city.name+', '+city.uf,path:cityPath(city)},{name:'Projeto '+id,path}]}>
    <PageSchema path={path} name={displayNames[id]} description={'Projeto '+id+' do snapshot Obrasgov. Situação informada: '+work.status} />
    <article className="work-page work-with-navigation"><WorkNavigation sections={[{id:"resumo",label:"Resumo"},{id:"sobre",label:"Sobre a obra"},{id:"purpose-title",label:"Objetivos e classificação"},{id:"actors-title",label:"Responsáveis"},{id:"execucao-fisica",label:"Andamento"},{id:"contracts-title",label:"Contratos"},{id:"commitments-title",label:"Empenhos e estudos"},{id:"datas",label:"Datas"},{id:"localizacao",label:"Localização"},{id:"documentos",label:"Fotos e documentos"},{id:"colaborar",label:"Contribuir"},{id:"fontes",label:"Fontes e atualização"}]} /><div className="work-content">
      <header className="work-heading" id="resumo"><div className="eyebrow"><Link href={cityPath(city)}>{city.name} / {city.uf}</Link> · Projeto {id}</div><h1>{displayNames[id]}</h1><WorkClassification id={id} /><div className="work-heading-actions"><a href="#colaborar">Enviar atualização</a><Link href={mapLink(work)} data-analytics-action="explorar_mapa">Abrir no mapa ↗</Link></div></header>
      <WorkOverview work={work} />
      <EvidenceNote id={id} />
      <div className="work-reading">
        <section id="sobre" className="description-section"><h2>Sobre a obra</h2><div className="project-description"><p>{detail.description || 'A API consultada não informou uma descrição complementar para este projeto.'}</p>{work.name !== detail.description && <p><strong>Nome cadastrado:</strong> {work.name}</p>}<p><strong>Órgão:</strong> {work.organization || 'Não informado'}</p><p className="context-note">Descrição transcrita do cadastro. Não é verificação independente da execução.</p></div></section>
        <WorkEnrichment id={id} />
        <DerivedWorkType title={work.name}/>
        <section id="datas" className="description-section"><h2>Datas informadas</h2><dl className="detail-list"><div><dt>Início previsto</dt><dd>{formatDate(work.start)}</dd></div><div><dt>Término previsto</dt><dd>{formatDate(work.end)}</dd></div><div><dt>Início efetivo</dt><dd>{formatDate(detail.actualStart)}</dd></div><div><dt>Término efetivo</dt><dd>{formatDate(detail.actualEnd)}</dd></div></dl><p className="context-note">Consulta complementar em {formatDate(detail.checkedAt)}. {inconsistent?'A data efetiva fornecida é anterior ao início previsto no snapshot. ':''}Previsões vencidas não comprovam atraso; situação e datas podem estar desatualizadas ou inconsistentes.</p></section>
        <WorkLocation work={work} /><WorkPublicContext id={id} />
        <ContributionForm workId={id} />
        <section id="fontes" className="provenance"><h2>Fonte e atualização</h2><dl className="detail-list"><div><dt>ID estável na fonte</dt><dd>{id}</dd></div><div><dt>Sistema informado</dt><dd>{detail.sourceSystem || 'Não informado'}</dd></div><div><dt>Tipo informado</dt><dd>{detail.intervention || 'Não informado'}</dd></div><div><dt>Snapshot de projetos</dt><dd>{formatDate(data.source.collectedAt)}</dd></div><div><dt>Valores coletados</dt><dd>{formatDate(data.source.investmentCollectedAt)}</dd></div><div><dt>Detalhe consultado</dt><dd>{formatDate(detail.checkedAt)}</dd></div></dl><p>Fonte: API pública Obrasgov, projeto {id}. {detail.snapshotDifference?'A consulta complementar difere de um ou mais campos do snapshot; esta ficha rotula cada período.':'Os campos principais conferem com a consulta complementar realizada.'}</p><TechnicalSources id={id} /></section>
      </div>
      <div className="related"><h2>Continue a exploração</h2><p><Link href={cityPath(city)}>Todos os registros associados a {city.name}/{city.uf}</Link> · <Link href="/obras">Outras fichas</Link> · <Link href="/guia-de-interpretacao">Como interpretar os dados</Link></p></div>
    </div></article>
  </DiscoveryShell>;
}
