export const areaKey = value => String(value || '').trim().toLocaleLowerCase('pt-BR');
export const areaSlug = value => areaKey(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const areaPath = value => `/areas/${areaSlug(value)}`;
