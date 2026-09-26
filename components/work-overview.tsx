import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowUpRight, CalendarDays, Camera, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import enrichment from '@/lib/work-enrichment.json';
import { data, formatDate, formatMoney, mapLink, workPath, type Work } from '@/lib/organic';

export function WorkOverview({ work }: { work: Work }) {
  const item = enrichment.projects[work.id as keyof typeof enrichment.projects];
  const reading = item?.executions.length === 1 ? item.executions[0] : null;
  const percent = reading?.percent;
  return <section className="work-overview" aria-label="Resumo da obra">
    <div className="overview-progress" id="situacao-cadastrada">
      <span className="status-label">{work.status || 'Situação não informada'}</span>
      <div className="progress-heading"><h2>Execução física</h2><strong>{percent != null ? `${percent.toLocaleString('pt-BR')}%` : item?.executions.length>1 ? 'Ver medições' : 'Não informada'}</strong></div>
      {percent != null && <Progress value={Math.max(0, Math.min(100,percent))} aria-label="Percentual de execução física informado" className="work-progress" />}
      <p>{reading ? `Registro atualizado em ${formatDate(reading.updatedAt)}.` : item?.executions.length ? 'Consulte os registros disponíveis abaixo.' : 'Não há medição disponível para este ID.'} Percentual físico não confirma entrega ou funcionamento.</p>
      <a href="#execucao-fisica">Ver medição e contexto</a>
    </div>
    <div className="overview-facts"><div><span>Investimento previsto</span><strong>{formatMoney(work.investmentTotal)}</strong><small>Não representa pagamento</small></div><div><span><CalendarDays size={15} aria-hidden="true" /> Término previsto no cadastro</span><strong>{formatDate(work.end)}</strong><small>Previsão vencida não comprova atraso</small></div><div><span>Base consultada</span><strong>{formatDate(data.source.collectedAt)}</strong><small>Cadastro público Obrasgov</small></div></div>
  </section>;
}

function distance(a: number[], b: number[]) {
  const rad = Math.PI / 180;
  const x = Math.sin((b[1]-a[1])*rad/2)**2 + Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin((b[0]-a[0])*rad/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));
}

export function WorkLocation({ work, showNearby = true, nearbyRecords }: { work: Work; showNearby?: boolean; nearbyRecords?: {row:Work;km:number}[] }) {
  const point = work.point;
  const nearby = nearbyRecords ?? (point && showNearby ? data.cities.flatMap<Work>(city=>city.rows).filter(row=>row.id!==work.id && row.point).map(row=>({row,km:distance(point,row.point!)})).filter(x=>x.km<=5).sort((a,b)=>a.km-b.km).slice(0,3) : []);
  const zoom=15;
  const tileX=point ? (point[0]+180)/360*2**zoom : 0;
  const latitude=point ? Math.max(-85,Math.min(85,point[1]))*Math.PI/180 : 0;
  const tileY=(1-Math.asinh(Math.tan(latitude))/Math.PI)/2*2**zoom;
  const tiles=[-1,0,1].flatMap(dy=>[-1,0,1].map(dx=>({x:Math.floor(tileX)+dx,y:Math.floor(tileY)+dy})));
  return <aside className="location-card" id="localizacao" aria-labelledby="location-title">
    <h2 id="location-title"><MapPin size={21} aria-hidden="true" /> Localização</h2>
    <p className="location-address">{work.address?.trim() || `${work.city}/${work.uf} · endereço não informado`}</p>
    {point && <div className="mini-map"><Link href={mapLink(work)} aria-label={`Abrir mapa interativo de ${work.name}`} className="mini-map-surface">{tiles.map(tile=><Image unoptimized key={`${tile.x}-${tile.y}`} src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`} alt="" width={256} height={256} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" style={{position:'absolute',maxWidth:'none',left:`calc(50% + ${(tile.x-tileX)*256}px)`,top:`calc(50% + ${(tile.y-tileY)*256}px)`}} />)}<MapPin className="mini-map-pin" size={36} aria-hidden="true" /><span className="mini-map-hint">Abrir mapa interativo ↗</span></Link><a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></div>}
    <p className="source-caption">Ponto de referência do cadastro; pode ser aproximado ou administrativo.</p>
    <Link className="location-action" href={mapLink(work)}>Explorar esta região no mapa <ArrowUpRight size={17} aria-hidden="true" /></Link>
    {nearby.length>0 && <div className="nearby-works"><h3>Registros próximos</h3><p>Distância em linha reta entre pontos cadastrados, até 5 km. Pontos podem ser administrativos ou aproximados; não confirmam a localização física.</p><ul>{nearby.map(({row,km})=><li key={row.id}><Link href={workPath(row.id)}>{row.name}</Link><span>{km<.1?'Menos de 100 m':`${km.toLocaleString('pt-BR',{maximumFractionDigits:1})} km`} · {row.status || 'Situação não informada'}</span></li>)}</ul></div>}
  </aside>;
}

export function WorkPublicContext({ id }: { id: string }) {
  if (id==='4902.35-23') return <section id="documentos" className="public-context" aria-labelledby="context-title">
    <div className="section-heading"><h2 id="context-title">Fotos e contexto público</h2><span className="history-tag"><Camera size={15} aria-hidden="true" /> Registro histórico</span></div>
    <figure className="work-photo"><Image unoptimized src="/images/obras/pirituba-inauguracao-2023.jpg" width="837" height="628" loading="lazy" decoding="async" alt="Estudantes nas mesas do restaurante do Campus Pirituba em registro publicado pelo IFSP sobre a inauguração de 2023." /><figcaption>Inauguração de 14/09/2023 · Foto publicada pelo IFSP. Não representa uma vistoria atual. <a href="https://ifsp.edu.br/ultimas-noticias/4031-campus-pirituba-inaugura-restaurante-estudantil" target="_blank" rel="noopener noreferrer">Ver publicação e outras fotos ↗</a></figcaption></figure>
    <ol className="work-timeline"><li><time dateTime="2023-09-14">14 set 2023</time><div><h3>Inauguração anunciada pelo IFSP</h3><p>A notícia institucional registra a abertura do restaurante do campus.</p></div></li><li><time dateTime="2025-07-11">11 jul 2025</time><div><h3>Comunicado sobre as refeições</h3><p>O campus anunciou pausa de recesso e retorno previsto em 05/08/2025. <a href="https://ptb.ifsp.edu.br/index.php/noticias-e-publicacoes/item/1881-comunicado-funcionamento-restaurante-e-cantina-de-10-de-julho-a-04-de-agosto" target="_blank" rel="noopener noreferrer">Ler comunicado ↗</a></p></div></li></ol>
    <a className="document-link" href="https://ptb.ifsp.edu.br/index.php/alimentacao-escolar" target="_blank" rel="noopener noreferrer"><FileText size={19} aria-hidden="true" /><span>Alimentação estudantil no portal do campus<small>Consulte os comunicados de funcionamento</small></span><ArrowUpRight size={17} aria-hidden="true" /></a>
    <p className="source-caption">Contexto associado por instituição, campus e objeto. As notícias não citam o ID Obrasgov e não substituem o registro contratual.</p>
  </section>;
  if(id==='45892.29-61') return <section id="documentos" className="public-context"><h2>Documentos públicos</h2><a className="document-link" href="https://www.ufba.br/licitacoes/concorrencia-eletronica-900052024" target="_blank" rel="noopener noreferrer"><FileText size={20} aria-hidden="true" /><span>Licitação da segunda etapa da Escola de Música<small>UFBA · Concorrência 90005/2024</small></span><ArrowUpRight size={17} aria-hidden="true" /></a><p className="source-caption">Contexto institucional associado pelo objeto e número de licitação; a página não cita o ID Obrasgov. Não localizamos foto vinculada com segurança a esta etapa.</p></section>;
  return <section id="documentos" className="public-context"><h2>Fotos e documentos</h2><p>Não há foto verificada vinculada a esta ficha. Os contratos disponíveis aparecem abaixo. Conhece uma publicação pública sobre este projeto? <a href="#colaborar">Envie o link para análise</a>.</p></section>;
}



