import Link from 'next/link';
import { formatDate, formatMoney, workPath, type Work } from '@/lib/organic';

export function WorkTable({ rows }: {rows: Work[]; selectedOnly?: boolean}) {
  return <><div className="table-scroll work-table-desktop"><table className="work-table"><caption className="sr-only">Cadastros de obras no recorte</caption><thead><tr><th scope="col">Projeto / identificador</th><th scope="col">Situação informada</th><th scope="col">Órgão responsável</th><th scope="col">Previsão de término</th><th scope="col">Investimento previsto</th></tr></thead><tbody>
    {rows.map(row=><tr key={row.id}><td><strong><Link href={workPath(row.id)} data-analytics-action="abrir_ficha">{row.name}</Link></strong><small>ID {row.id} · {row.city}/{row.uf}</small></td><td>{row.status || 'Não informada'}</td><td>{row.organization || 'Não informado'}</td><td>{formatDate(row.end)}</td><td>{formatMoney(row.investmentTotal)}</td></tr>)}
  </tbody></table></div><div className="work-card-list" aria-label="Cadastros de obras no recorte">{rows.map(row=><article className="work-list-card" key={row.id}><small>{row.city}/{row.uf} · ID {row.id}</small><h3><Link href={workPath(row.id)} data-analytics-action="abrir_ficha">{row.name} <span aria-hidden="true">↗</span></Link></h3><dl><div><dt>Situação</dt><dd>{row.status || 'Não informada'}</dd></div><div><dt>Investimento previsto</dt><dd>{formatMoney(row.investmentTotal)}</dd></div><div><dt>Término previsto</dt><dd>{formatDate(row.end)}</dd></div><div><dt>Órgão</dt><dd>{row.organization || 'Não informado'}</dd></div></dl></article>)}</div></>;
}
