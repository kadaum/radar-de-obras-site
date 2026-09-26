const key='radar-list-state-v1';
export function normalizeListState(raw){
 if(!raw||raw.version!==1)return null;
 return {version:1,query:typeof raw.query==='string'?raw.query.slice(0,500):'',
  uf:/^[A-Z]{2}$/.test(raw.uf??'')?raw.uf:'',
  status:['Todas','Em execução','Cadastrada','Paralisada','Concluída','Inacabada','Cancelada'].includes(raw.status)?raw.status:'Todas',
  expired:raw.expired===true,
  sort:['name','location','status','investment','end','progress'].includes(raw.sort)?raw.sort:null,
  direction:raw.direction==='desc'?'desc':'asc'};
}
export function readListState(storage){try{return normalizeListState(JSON.parse(storage.getItem(key)));}catch{return null;}}
export function saveListState(storage,state){try{storage.setItem(key,JSON.stringify(normalizeListState({version:1,...state})));}catch{/* Storage may be disabled; navigation remains available. */}}
