// Conservative first-wave gate for search indexing. This is an editorial
// threshold, not a Google word-count rule or a promise of ranking.
export function indexableNationalWork(work){
 const description=work?.context?.description?.trim()||'';
 const normalize=text=>text.trim().toLocaleLowerCase('pt-BR').replace(/\s+/g,' ');
 return !!work && typeof work.name==='string'&&work.name.trim().length>0&&work.name!=='Projeto sem título informado'
  &&!!work.organization?.trim()&&!!work.uf?.trim()&&!!(work.city?.trim()||work.address?.trim())
  &&description.length>=150&&normalize(description)!==normalize(work.name);
}
