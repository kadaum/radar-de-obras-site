// Minimal completeness gate, not a promise of ranking or proof of data accuracy.
export function indexableNationalWork(work){
 return !!work && typeof work.name==='string'&&work.name.trim().length>0&&work.name!=='Projeto sem título informado'
  &&!!work.organization?.trim()&&!!work.uf?.trim()&&!!(work.city?.trim()||work.address?.trim())
  &&!!work.context?.description?.trim();
}
