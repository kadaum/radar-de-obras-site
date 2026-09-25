import enrichment from '@/lib/work-enrichment.json';
import Link from 'next/link';
import { formatDate } from '@/lib/organic';

type RecordItem = {
  id: string;
  socialFunction: string | null;
  globalGoal: string | null;
  classification: { axis: string | null; type: string | null; subtype: string | null }[];
  responsible: string | null;
  repayers: string[];
  takers: string[];
  executors: string[];
  executions: { id: number; percent: number | null; start: string | null; end: string | null; updatedAt: string | null; instrument: string | null }[];
  contracts: { id: number; number: string | null; object: string | null; supplier: string | null; supplierCnpj: string | null; signedAt: string | null; startsAt: string | null; endsAt: string | null; globalValue: number | null; process: string | null; tender: string | null; officialUrl: string | null }[];
  commitments: { number: string | null; creditor: string | null; amount: number | null; paid: number | null; paidPreviousYears: number | null }[];
  studies: { type: string | null; specification: string | null }[];
};

const records = enrichment.projects as Record<string, RecordItem>;
const endpoint = (route: string, id: string) => `https://api-publica.obrasgov.gestao.gov.br/obras/${route}?id_projeto_investimento=${encodeURIComponent(id)}`;
const source = (route: string, id: string, label: string) => <a href={endpoint(route,id)} target="_blank" rel="noopener noreferrer">{label} ↗</a>;
const cleaned = (value: string) => value.replace(/([.!?])(?=[A-ZÀ-Ý])/g, '$1 ');
const names = (values: string[]) => values.length ? [...new Set(values)].join('; ') : 'Não informado neste cadastro';
const money = (value: number | null) => value == null ? 'Não informado' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);

export function EvidenceNote({ id }: { id: string }) {
  if (id !== '4902.35-23') return null;
  return <aside className="evidence-note" aria-labelledby="evidence-title">
    <h2 id="evidence-title">O restaurante já foi inaugurado?</h2>
    <p><strong>Sim, segundo o IFSP.</strong> A instituição informou a inauguração em 14/09/2023. Ao mesmo tempo, o cadastro Obrasgov ainda traz a situação “Em execução”, enquanto seu registro de execução física informa 100%.</p>
    <p>São fontes e conceitos distintos. A inauguração publicada pelo IFSP não corrige automaticamente o campo de situação do Obrasgov nem define a data contratual de conclusão.</p>
    <ul>
      <li><a href="https://ifsp.edu.br/ultimas-noticias/4031-campus-pirituba-inaugura-restaurante-estudantil" target="_blank" rel="noopener noreferrer">IFSP: inauguração em setembro de 2023 ↗</a></li>
      <li>{source('projeto-investimento',id,'Obrasgov: situação cadastrada')}</li>
      <li>{source('execucao-fisica',id,'Obrasgov: execução física registrada')}</li>
    </ul>
  </aside>;
}

export function WorkEnrichment({ id }: { id: string }) {
  const item = records[id];
  if (!item) return null;
  return <>
    <section className="enrichment-section" aria-labelledby="purpose-title">
      <h2 id="purpose-title">O que o projeto pretende entregar</h2>
      {item.globalGoal && <div className="editorial-block"><h3>Meta declarada</h3><p>{cleaned(item.globalGoal)}</p></div>}
      {item.socialFunction && <div className="editorial-block"><h3>Finalidade social informada</h3><p>{cleaned(item.socialFunction)}</p></div>}
      {!!item.classification.length && <p className="data-caption">Classificação na fonte: {item.classification.map(x => [x.axis,x.type,x.subtype].filter(Boolean).join(' › ')).join('; ')}.</p>}
      <p className="source-caption">Textos e classificação declarados pelo órgão no {source('projeto-investimento',id,'cadastro oficial')}. Não são verificação independente do benefício entregue.</p>
    </section>
    <section className="enrichment-section" aria-labelledby="actors-title">
      <h2 id="actors-title">Quem participa</h2>
      <dl className="detail-list">
        <div><dt>Organização responsável</dt><dd>{item.responsible || 'Não informada'}</dd></div>
        <div><dt>Repassador informado</dt><dd>{names(item.repayers)}</dd></div>
        <div><dt>Tomador informado</dt><dd>{names(item.takers)}</dd></div>
        <div><dt>Executor informado</dt><dd>{names(item.executors)}</dd></div>
      </dl>
      <p className="source-caption">Esses papéis vêm do {source('projeto-investimento',id,'cadastro do projeto')}. A empresa contratada, quando informada, aparece nos contratos abaixo.</p>
    </section>
    <section className="enrichment-section" aria-labelledby="progress-title">
      <h2 id="progress-title">Execução física registrada</h2>
      {item.executions.length ? <div className="record-grid">{item.executions.map((execution,index) => <article key={`${execution.id}-${index}`} className="record-card">
        <strong>{execution.percent == null ? 'Percentual não informado' : `${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(execution.percent)}% informado`}</strong>
        <dl className="compact-list"><div><dt>Início registrado</dt><dd>{formatDate(execution.start)}</dd></div><div><dt>Fim registrado</dt><dd>{formatDate(execution.end)}</dd></div><div><dt>Atualização do registro</dt><dd>{formatDate(execution.updatedAt)}</dd></div>{execution.instrument && <div><dt>Instrumento</dt><dd>{execution.instrument}</dd></div>}</dl>
      </article>)}</div> : <p>Não há medição de execução física retornada pela API para este ID.</p>}
      <p className="source-caption">{source('execucao-fisica',id,'Consultar registros de execução física')}. Percentual informado pelo gestor; pode se referir a um instrumento específico e não confirma entrega ou funcionamento.</p>
    </section>
    <section className="enrichment-section" aria-labelledby="contracts-title">
      <h2 id="contracts-title">Contratos vinculados</h2>
      {item.contracts.length ? <div className="record-grid">{item.contracts.map((contract,index) => <article key={`${contract.id}-${index}`} className="record-card">
        <h3>Contrato {contract.number || contract.id}</h3>
        <dl className="compact-list"><div><dt>Empresa contratada</dt><dd>{contract.supplier || 'Não informada'}</dd></div><div><dt>Valor global do contrato</dt><dd>{money(contract.globalValue)}</dd></div><div><dt>Assinatura</dt><dd>{formatDate(contract.signedAt)}</dd></div><div><dt>Vigência informada</dt><dd>{formatDate(contract.startsAt)} a {formatDate(contract.endsAt)}</dd></div>{contract.tender && <div><dt>Licitação</dt><dd>{contract.tender}</dd></div>}{contract.process && <div><dt>Processo</dt><dd>{contract.process}</dd></div>}</dl>
        {contract.object && <details><summary>Ver objeto do contrato</summary><p>{cleaned(contract.object)}</p></details>}
        {contract.officialUrl && <p><a href={contract.officialUrl} target="_blank" rel="noopener noreferrer">Documento de transparência do contrato ↗</a></p>}
      </article>)}</div> : <p>Nenhum contrato foi retornado pela API para este ID. Isso não prova que não houve contratação.</p>}
      <p className="source-caption">{source('contrato',id,'Consultar contratos na API')}. Valor global contratual, investimento previsto e pagamento são medidas diferentes.</p>
    </section>
    <section className="enrichment-section" aria-labelledby="commitments-title">
      <h2 id="commitments-title">Empenhos e estudos</h2>
      {item.commitments.length ? <details className="record-details"><summary>{item.commitments.length} empenho(s) vinculado(s): ver registros</summary><div className="table-scroll"><table className="record-table"><thead><tr><th>Número</th><th>Credor</th><th>Valor do empenho</th><th>Pago informado</th><th>Restos a pagar pagos</th></tr></thead><tbody>{item.commitments.map((commitment,index) => <tr key={`${commitment.number}-${index}`}><td>{commitment.number || 'Não informado'}</td><td>{commitment.creditor || 'Não informado'}</td><td>{money(commitment.amount)}</td><td>{money(commitment.paid)}</td><td>{money(commitment.paidPreviousYears)}</td></tr>)}</tbody></table></div></details> : <p>Nenhum empenho foi retornado pela API para este ID.</p>}
      <p className="source-caption">{source('empenho',id,'Consultar empenhos na API')}. Os valores são mostrados por registro; não foram somados, pois campos de exercícios e situações diferentes podem se sobrepor.</p>
      {item.studies.length ? <details className="record-details"><summary>{item.studies.length} registro(s) de estudo de viabilidade</summary><ul>{item.studies.map((study,index) => <li key={index}><strong>{study.type || 'Tipo não informado'}:</strong> {study.specification || 'Sem especificação'}</li>)}</ul></details> : <p>Não há estudo de viabilidade retornado pela API para este ID.</p>}
      <p className="source-caption">{source('estudo-viabilidade',id,'Consultar estudos na API')}. A existência de um registro não equivale a acesso ao documento integral.</p>
    </section>
    <p className="context-note">Dados complementares coletados em {formatDate(enrichment.collectedAt)} da carga oficial {formatDate(enrichment.sourceLoad)}. “Não retornado” significa ausência no endpoint consultado, não inexistência do fato. <Link href="/guia-de-interpretacao">Como interpretar</Link>.</p>
  </>;
}
