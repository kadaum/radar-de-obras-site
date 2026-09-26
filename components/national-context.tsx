import type {NationalContext} from '@/lib/national-work';
export function NationalProjectContext({context:c}:{context:NationalContext}){
 const prose=[['Descrição do projeto',c.description],['Meta declarada',c.goal],['Finalidade social',c.socialFunction],['Público beneficiado',c.beneficiaryDescription]];
 const seen=new Set<string>();
 const impact=[['População beneficiada declarada',c.beneficiaries],['Empregos gerados declarados',c.jobs]] as const;
 const reportedImpact=impact.filter(([,value])=>typeof value==='number'&&Number.isFinite(value));
 const sections=prose.filter(([,value])=>{if(!value?.trim()||seen.has(value.trim()))return false;seen.add(value.trim());return true;});
 return <section className="enrichment-section"><h2>Sobre a intervenção</h2>
  <p>{[c.nature,c.intervention].filter(Boolean).join(' · ') || 'Natureza e intervenção não informadas'}</p>
  {reportedImpact.length>0&&<details className="record-details"><summary>População e empregos declarados</summary><dl className="detail-list">{reportedImpact.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value!.toLocaleString('pt-BR')}{(!Number.isInteger(value)||value!<0)&&' — valor inconsistente'}</dd></div>)}</dl><p className="context-note">Valores reproduzidos do cadastro, sem confirmação independente. A fonte pode conter erros de escala ou preenchimento e não permite confirmar se são estimativas ou resultados realizados. Não usamos esses números para comparar a eficiência das obras ou somar pessoas beneficiadas.</p></details>}
  {sections.length>0 && <details className="record-details"><summary>Descrição, metas e público beneficiado</summary>{sections.map(([label,value])=><div className="editorial-block" key={label}><h3>{label}</h3><p>{value}</p></div>)}<p className="source-caption">Textos declarados pelo órgão. Não são verificação independente da entrega ou dos benefícios.</p></details>}
  <details className="record-details" id="classificacao-oficial"><summary>Eixo, tipo e subtipo oficiais</summary>{c.classification.length?<ul>{c.classification.map((x,i)=><li key={i}>{[x.eixo,x.tipo,x.subtipo].filter(Boolean).join(' › ')}</li>)}</ul>:<p>Classificação não informada.</p>}<p className="source-caption">Preservamos a classificação da fonte, inclusive quando parece divergir do objeto descrito.</p></details>
  <details className="record-details"><summary>Quem administra, repassa e responde pela execução</summary><dl className="detail-list">
   <div><dt>Executor no cadastro</dt><dd>{[...new Set(c.executors.map(x=>x.organizacao_executor).filter(Boolean))].join('; ')||'Não informado'}</dd></div>
   <div><dt>Tomador dos recursos</dt><dd>{[...new Set(c.takers.map(x=>x.organizacao_tomador).filter(Boolean))].join('; ')||'Não informado'}</dd></div>
   <div><dt>Repassador dos recursos</dt><dd>{[...new Set(c.repayers.map(x=>x.organizacao_repassador).filter(Boolean))].join('; ')||'Não informado'}</dd></div>
  </dl><p>Executor é a organização responsável pela intervenção. Tomador administra os recursos e repassador os transfere. A empresa contratada deve ser identificada no contrato; não é necessariamente o executor deste cadastro.</p></details>
 </section>;
}
