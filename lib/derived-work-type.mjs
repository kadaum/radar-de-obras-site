// Prototype outside Site. Produces only a narrow direct-object classification.
// Do not replace official taxonomy. Version rules and retain original title.
export const version='direct-object-prototype-0.2';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
const objects=[
 ['ubs','Unidade básica de saúde','(?:UBS|UNIDADE BASICA DE SAUDE)'],
 ['upa','Unidade de pronto atendimento','(?:UPA|UNIDADE DE PRONTO ATENDIMENTO)'],
 ['caps','Centro de atenção psicossocial','(?:CAPS|CENTRO DE ATENCAO PSICOSSOCIAL)'],
 ['creche','Creche / educação infantil','(?:CRECHE|PRE ESCOLA|ESCOLA DE EDUCACAO INFANTIL)'],
 ['restaurante','Restaurante / refeitório','(?:REFEITORIO|RESTAURANTE UNIVERSITARIO|RESTAURANTE ESTUDANTIL)'],
 ['biblioteca','Biblioteca','BIBLIOTECA'],
];
export function classifyDirectObject(title){
 const text=normalize(title);
 if(/\b(?:NAO|SEM|EXCETO|EXCLUID[AO]|CANCELAD[AO])\b/.test(text))return [];
 return objects.flatMap(([id,label,object])=>{
  const regexp=new RegExp('^(?:PAC 2 )?(?:(?:CONSTRUCAO|REFORMA|AMPLIACAO|IMPLANTACAO|INSTALACAO) (?:DE |DA |DO |DAS |DOS )?'+object+'\\b|'+object+'$)');
  const match=text.match(regexp);return match?[{id,label,rule_version:version,rule_id:'direct-'+id,source_field:'desc_nome',evidence:match[0],status:'derived_explicit',caveat:'Objeto da intervenção; não comprova execução, entrega ou funcionamento.'}]:[];
 });
}
