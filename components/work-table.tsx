import Link from 'next/link';
import { formatDate, formatMoney, getWork, sourceLink, workPath, type Work } from '@/lib/organic';

export function WorkTable({ rows, selectedOnly = false }: {rows: Work[]; selectedOnly?: boolean}) {
  return <div className="table-scroll"><table className="work-table"><caption className="sr-only">Cadastros de obras no recorte</caption><thead><tr><th scope="col">Projeto / identificador</th><th scope="col">Situação informada</th><th scope="col">Órgão responsável</th><th scope="col">Previsão de término</th><th scope="col">Investimento previsto</th></tr></thead><tbody>
    {rows.map(row=><tr key={row.id}><td><strong>{getWork(row.id) || selectedOnly ? <Link href={workPath(row.id)} data-analytics-action="abrir_ficha">{row.name}</Link> : row.name}</strong><small>ID {row.id} · {row.city}/{row.uf}</small>{!getWork(row.id) && <a className="source-inline" href={sourceLink(row.id)} target="_blank" rel="noopener noreferrer" data-analytics-action="abrir_fonte">Dados brutos (JSON) ↗</a>}</td><td>{row.status || 'Não informada'}</td><td>{row.organization || 'Não informado'}</td><td>{formatDate(row.end)}</td><td>{formatMoney(row.investmentTotal)}</td></tr>)}
  </tbody></table></div>;
}
