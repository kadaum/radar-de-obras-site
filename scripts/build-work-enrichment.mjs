// Collect the extra official fields used by the ten curated project pages.
// Keep the previous file if an endpoint or identity validation fails.
import fs from 'node:fs';
import path from 'node:path';
import organic from '../lib/organic-data.json' with { type: 'json' };

const root = process.cwd();
const api = 'https://api-publica.obrasgov.gestao.gov.br/obras';
const selected = organic.cities.flatMap(city => city.ids.map(id => ({ id, city,
  row: city.rows.find(row => row.id === id) })));
const routes = ['projeto-investimento', 'execucao-fisica', 'contrato', 'empenho', 'estudo-viabilidade'];

async function json(url) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      return await response.json();
    } catch (error) {
      last = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }
  throw last;
}

async function records(route, id) {
  const result = [];
  for (let page = 1; page <= 10; page++) {
    const url = new URL(`${api}/${route}`);
    url.searchParams.set('id_projeto_investimento', id);
    url.searchParams.set('pagina', String(page));
    url.searchParams.set('tamanho_da_pagina', '100');
    const body = await json(url);
    if (!Array.isArray(body.data) || !Number.isInteger(body.total_pages) || body.total_pages > 10)
      throw new Error(`Invalid pagination: ${route} ${id}`);
    if (body.data.some(item => item.id_projeto_investimento !== id))
      throw new Error(`Wrong project in ${route}: ${id}`);
    result.push(...body.data);
    if (page >= body.total_pages) {
      if (result.length !== body.total_items) throw new Error(`Count mismatch: ${route} ${id}`);
      return result;
    }
  }
  throw new Error(`Too many pages: ${route} ${id}`);
}

const loadBefore = (await json(`${api}/data-atualizacao`)).data_ultima_atualizacao;
if (loadBefore !== organic.source.sourceLoad) throw new Error('Official load changed; refresh the full map snapshot first');
const next = {};
for (const { id, city, row } of selected) {
  if (!row) throw new Error(`Selected project missing: ${id}`);
  const [projects, executions, contracts, commitments, studies] = await Promise.all(routes.map(route => records(route, id)));
  if (projects.length !== 1 || projects[0].desc_nome !== row.name || projects[0].uf_principal !== city.uf)
    throw new Error(`Project identity mismatch: ${id}`);
  const p = projects[0];
  next[id] = {
    id,
    socialFunction: p.desc_funcao_social || null,
    globalGoal: p.desc_meta_global || null,
    classification: (p.eixos_tipos || []).map(item => ({ axis: item.eixo || null, type: item.tipo || null, subtype: item.subtipo || null })),
    responsible: p.organizacao_resp || null,
    repayers: (p.repassadores || []).map(item => item.organizacao_repassador).filter(Boolean),
    takers: (p.tomadores || []).map(item => item.organizacao_tomador).filter(Boolean),
    executors: (p.executores || []).map(item => item.organizacao_executor).filter(Boolean),
    executions: executions.map(item => ({
      id: item.id_execucao_fisica,
      percent: Number.isFinite(item.percentual_execucao_fisica) ? item.percentual_execucao_fisica : null,
      start: item.dt_inicial_execucao || null, end: item.dt_final_execucao || null,
      updatedAt: item.dt_atualizacao_execucao || item.dt_cadastro_execucao || null,
      instrument: item.tipo_instrumento || null,
    })),
    contracts: contracts.map(item => ({
      id: item.id_contrato, number: item.numero_contrato || null,
      object: item.objeto_contrato || null,
      supplier: item.fornecedor_contrato || null,
      supplierCnpj: item.cnpj_fornecedor_contrato || null,
      signedAt: item.data_assinatura_contrato || null,
      startsAt: item.vigencia_inicio_contrato || null, endsAt: item.vigencia_fim_contrato || null,
      globalValue: Number.isFinite(item.valor_global_contrato) ? item.valor_global_contrato : null,
      process: item.processo || null,
      tender: item.licitacao_numero || null,
      officialUrl: typeof item.link_transparencia === 'string' && item.link_transparencia.startsWith('https://') ? item.link_transparencia : null,
    })),
    commitments: commitments.map(item => ({
      number: item.nr_empenho || null, creditor: item.credor || null,
      amount: Number.isFinite(item.valor_empenho) ? item.valor_empenho : null,
      paid: Number.isFinite(item.pago) ? item.pago : null,
      paidPreviousYears: Number.isFinite(item.rppago) ? item.rppago : null,
    })),
    studies: studies.map(item => ({ type: item.tipo_estudo_viabilidade || null,
      specification: item.especificacao_estudo_viabilidade || null })),
  };
}
const loadAfter = (await json(`${api}/data-atualizacao`)).data_ultima_atualizacao;
if (loadBefore !== loadAfter) throw new Error('Official load changed during collection');
const output = { sourceLoad: loadAfter, collectedAt: new Date().toISOString(), projects: next };
const target = path.join(root, 'lib', 'work-enrichment.json');
const temporary = target + '.tmp';
fs.writeFileSync(temporary, JSON.stringify(output));
fs.renameSync(temporary, target);
console.log(JSON.stringify({ ids: Object.keys(next).length, sourceLoad: loadAfter,
  executions: Object.values(next).filter(item => item.executions.length).length,
  contracts: Object.values(next).filter(item => item.contracts.length).length,
  commitments: Object.values(next).filter(item => item.commitments.length).length }));
