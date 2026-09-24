export function investmentTotal(project){
 if(project.investmentTotal!=null&&project.investmentTotal!==''&&Number.isFinite(Number(project.investmentTotal)))return Number(project.investmentTotal);
 const values=(Array.isArray(project.investments)?project.investments:[])
  .map(item=>Number(item?.vl_investimento_previsto))
  .filter(Number.isFinite);
 return values.length?values.reduce((total,value)=>total+value,0):null;
}

const text=value=>String(value??'').trim();
const number=value=>value!=null&&value!==''&&Number.isFinite(Number(value))?Number(value):null;
const date=value=>value?Date.parse(value):null;

function sortValue(project,key){
 if(key==='name')return text(project.name);
 if(key==='location')return text([project.city,project.uf].filter(Boolean).join(' '));
 if(key==='status')return text(project.status);
 if(key==='investment')return investmentTotal(project);
 if(key==='end')return date(project.end);
 if(key==='progress')return number(project.execution?.percentual_execucao_fisica);
 return null;
}

export function sortProjects(projects,key,direction='asc'){
 if(!key)return [...projects];
 const factor=direction==='desc'?-1:1;
 return projects.map((project,index)=>({project,index})).sort((a,b)=>{
  const left=sortValue(a.project,key),right=sortValue(b.project,key);
  const leftMissing=left==null||left==='';
  const rightMissing=right==null||right==='';
  if(leftMissing!==rightMissing)return leftMissing?1:-1;
  if(leftMissing)return a.index-b.index;
  const comparison=typeof left==='number'&&typeof right==='number'
   ? left-right
   : String(left).localeCompare(String(right),'pt-BR',{sensitivity:'base',numeric:true});
  return comparison?comparison*factor:a.index-b.index;
 }).map(item=>item.project);
}
