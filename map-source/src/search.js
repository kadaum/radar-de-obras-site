const stateNames={AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins'};

export function normalizeSearch(value){
 return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}

export function matchesProjectSearch(project,query){
 const normalized=normalizeSearch(query);if(!normalized)return true;
 const fields=[project.name,project.id,project.city,project.uf,stateNames[project.uf],project.address,project.cep,project.organization];
 const text=normalizeSearch(fields.join(' '));
 const tokens=normalized.split(' ');
 if(tokens.every(token=>text.includes(token)))return true;
 const compactQuery=normalized.replaceAll(' ','');
 return compactQuery.length>=5&&[project.id,project.cep].some(value=>normalizeSearch(value).replaceAll(' ','').includes(compactQuery));
}

// A municipality name can also be a state name (for example, São Paulo).
// Keep that comparison separate from broad text search so callers can give an
// exact municipality match precedence without losing the general search mode.
export function matchesExactMunicipality(project,query){
 const normalized=normalizeSearch(query);
 return !!normalized&&normalizeSearch(project.city)===normalized;
}
