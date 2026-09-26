/** Historical document values: never substituted for the current API contract value. */
export function PiritubaContractContext({ id }: { id: string }) {
  if (id !== '4902.35-23') return null;
  return <details className="record-details">
    <summary>Por que o orçamento e o contrato têm valores diferentes?</summary>
    <p>Os documentos da concorrência 02/2021 e do contrato 88154/2021 registram etapas diferentes da contratação do restaurante.</p>
    <dl className="detail-list">
      <div><dt>Orçamento estimado na licitação</dt><dd>R$ 3.629.137,54</dd></div>
      <div><dt>Proposta vencedora homologada em 02/12/2021</dt><dd>R$ 2.988.346,58</dd></div>
      <div><dt>Acréscimo no primeiro aditivo de 2022</dt><dd>R$ 23.048,44</dd></div>
      <div><dt>Valor após esse aditivo</dt><dd>R$ 3.011.395,02</dd></div>
    </dl>
    <p>O primeiro aditivo registra alterações envolvendo piso tátil, CFTV e mudança de localização. Os valores acima reconstituem esses documentos históricos; não representam pagamentos nem garantem que não existam alterações posteriores.</p>
    <p>A diferença entre orçamento e contrato, isoladamente, não comprova economia ou sobrepreço. Uma comparação de custos exige conferir quantidades, serviços, preços de referência, data e condições da contratação. Também há áreas diferentes nos documentos do projeto; por isso não apresentamos custo por metro quadrado.</p>
    <p className="source-caption">Documentos: <a href="https://drive.google.com/file/d/15PLN3ygK4H1I6v1SfwY3sw48S2l6Hi3R/view" target="_blank" rel="noopener noreferrer">edital e anexos (ZIP; planilha orçamentária, p. 5) ↗</a> · <a href="https://drive.google.com/file/d/16l1Im6Gq6B9htWFttynXN_FOryEv9jkG/view" target="_blank" rel="noopener noreferrer">homologação (PDF, p. 1) ↗</a> · <a href="https://contratos.comprasnet.gov.br/gescon/consulta/download-arquivo-contrato/188782" target="_blank" rel="noopener noreferrer">primeiro aditivo (PDF, p. 1) ↗</a>. Pesquisa documental: 25/09/2026.</p>
  </details>;
}
