import Link from 'next/link';
import {classifyDirectObject} from '@/lib/derived-work-type.mjs';

export function DerivedWorkType({title}:{title:string}){
 const types=classifyDirectObject(title);
 if(!types.length)return null;
 return <details className="record-details" data-classification="derived" data-rule-version={types[0].rule_version}>
  <summary>Tipo identificado no título: {types.map(type=>type.label).join(' · ')}</summary>
  <p>Indicação automática do equipamento citado diretamente no início do nome cadastrado, por regras fixas de leitura. A classificação oficial é mantida separadamente.</p>
  <blockquote>{title}</blockquote>
  <p className="source-caption">Pode representar uma reforma ou ampliação de parte do equipamento. Não comprova entrega, funcionamento ou o escopo completo da obra.</p>
  <Link href="/metodologia#tipo-derivado">Como identificamos o tipo e quais são os limites →</Link>
 </details>;
}
