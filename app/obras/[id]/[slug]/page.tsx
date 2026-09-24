import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DiscoveryShell, PageSchema } from '@/components/discovery';
import { cityPath, data, displayNames, formatDate, formatMoney, getWork, mapLink, sourceLink, workPath, workSlugs } from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';

type Props={params:Promise<{id:string;slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id,slug}=await params;const found=getWork(id);if(!found||workSlugs[id]!==slug)return {};
  return pageMetadata(workPath(id),`${displayNames[id]} | Radar de Obras`,`Ficha do cadastro ${id} em ${found.city.name}/${found.city.uf}: situação informada, responsável, previsões, investimento previsto e fonte oficial.`);
}
export default async function WorkPage({params}:Props){
  const {id,slug}=await params;const found=getWork(id);if(!found||workSlugs[id]!==slug)notFound();
  const {work,city,detail}=found;const path=workPath(id);
  const inconsistent=!!detail.actualEnd && !!work.start && detail.actualEnd<work.start;
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Cidades',path:'/cidades'},{name:`${city.name}, ${city.uf}`,path:cityPath(city)},{name:`Projeto ${id}`,path}]}>
    <PageSchema path={path} name={displayNames[id]} description={`Projeto ${id} do snapshot Obrasgov, associado a ${city.name}/${city.uf}. Situação informada: ${work.status}.`} />
    <div className="eyebrow">Ficha Obrasgov · ID {id}</div><h1>{displayNames[id]}</h1><p className="source-name">Nome no cadastro: {work.name}</p>
    <p className="lead">No snapshot do Radar, este projeto aparece como <strong>{work.status || 'situação não informada'}</strong>, associado a <Link href={cityPath(city)}>{city.name}/{city.uf}</Link>. O cadastro indica <strong>{formatMoney(work.investmentTotal)}</strong> de investimento previsto. Esse valor não representa gasto ou pagamento.</p>
    <div className="action-row"><Link className="primary-action" href={mapLink(work)} data-analytics-action="explorar_mapa">Abrir no mapa ↗</Link><a href={sourceLink(id)} target="_blank" rel="noopener noreferrer" data-analytics-action="abrir_fonte">Consultar fonte oficial ↗</a><Link href={cityPath(city)}>Ver cidade</Link></div>
    <div className="fact-grid work-facts"><div><span>Situação informada</span><strong>{work.status || 'Não informada'}</strong></div><div><span>Investimento previsto</span><strong>{formatMoney(work.investmentTotal)}</strong></div><div><span>Órgão responsável</span><strong>{work.organization || 'Não informado'}</strong></div></div>
    <div className="detail-grid"><section><h2>Datas informadas</h2><dl className="detail-list"><div><dt>Início previsto</dt><dd>{formatDate(work.start)}</dd></div><div><dt>Término previsto</dt><dd>{formatDate(work.end)}</dd></div><div><dt>Início efetivo</dt><dd>{formatDate(detail.actualStart)}</dd></div><div><dt>Término efetivo</dt><dd>{formatDate(detail.actualEnd)}</dd></div></dl><p className="context-note">Datas efetivas vêm da consulta complementar à API em {formatDate(detail.checkedAt)}. {inconsistent?'A data efetiva fornecida é anterior ao início previsto no snapshot; confira diretamente a fonte. ':''}Previsões vencidas não comprovam atraso; situação e datas podem estar desatualizadas ou inconsistentes.</p></section>
      <section><h2>Localização informada</h2><dl className="detail-list"><div><dt>Município associado</dt><dd><Link href={cityPath(city)}>{city.name}/{city.uf}</Link></dd></div><div><dt>Endereço</dt><dd>{work.address?.trim() || 'Não informado'}</dd></div><div><dt>Coordenada</dt><dd>{work.point ? `${work.point[1].toFixed(5)}, ${work.point[0].toFixed(5)}`:'Não informada'}</dd></div></dl><p className="context-note">O ponto pode representar referência aproximada ou endereço administrativo; não confirma o local exato do canteiro.</p></section></div>
    <section className="description-section"><h2>Descrição registrada</h2><p>{detail.description || 'A API consultada não informou uma descrição complementar para este projeto.'}</p><p className="context-note">Descrição transcrita do cadastro. Não é verificação independente da execução.</p></section>
    <section className="provenance"><h2>Fonte e atualização</h2><dl className="detail-list"><div><dt>ID estável na fonte</dt><dd>{id}</dd></div><div><dt>Sistema informado</dt><dd>{detail.sourceSystem || 'Não informado'}</dd></div><div><dt>Tipo informado</dt><dd>{detail.intervention || 'Não informado'}</dd></div><div><dt>Snapshot de projetos</dt><dd>{formatDate(data.source.collectedAt)}</dd></div><div><dt>Valores coletados</dt><dd>{formatDate(data.source.investmentCollectedAt)}</dd></div><div><dt>Detalhe consultado</dt><dd>{formatDate(detail.checkedAt)}</dd></div></dl><p>Fonte: <a href={sourceLink(id)} target="_blank" rel="noopener noreferrer">API pública Obrasgov, projeto {id} ↗</a>. {detail.snapshotDifference?'A consulta complementar difere de um ou mais campos do snapshot; esta ficha rotula cada período.':'Os campos principais conferem com a consulta complementar realizada.'}</p></section>
    <div className="related"><h2>Continue a exploração</h2><p><Link href={cityPath(city)}>Todos os registros associados a {city.name}/{city.uf}</Link> · <Link href="/obras">Outras fichas</Link> · <Link href="/guia-de-interpretacao">Como interpretar os dados</Link></p></div>
  </DiscoveryShell>;
}
