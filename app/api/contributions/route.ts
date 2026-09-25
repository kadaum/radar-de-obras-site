import { env } from 'cloudflare:workers';
import { getWork, ORIGIN } from '@/lib/organic';

export async function POST(request: Request) {
  const fail=(error:string,status=400)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
  const origin=request.headers.get('origin');
  if(origin && ![new URL(request.url).origin,ORIGIN,'https://radar-de-obras-brasil.ricardo-guia.chatgpt.site'].includes(origin))return fail('Origem não permitida.',403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return fail('Formato não aceito.',415);
  let body;
  try {
    const reader=request.body?.getReader();if(!reader)return fail('Preencha a contribuição.');
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){await reader.cancel();return fail('Texto muito longo.',413);}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    body=JSON.parse(new TextDecoder().decode(bytes));
  }catch{return fail('Não foi possível ler a contribuição.');}
  if(!body || typeof body!=='object' || Array.isArray(body))return fail('Dados inválidos.');
  if(body.website)return fail('Não foi possível enviar esta contribuição.');
  if(typeof body.workId!=='string'||!getWork(body.workId))return fail('Ficha não encontrada.',404);
  if(!['correction','observation','public_source'].includes(body.kind))return fail('Escolha um tipo de contribuição.');
  if(typeof body.message!=='string'||body.message.trim().length<20||body.message.length>2000)return fail('Escreva entre 20 e 2.000 caracteres.');
  if(body.status!==undefined||body.reviewNote!==undefined)return fail('Campo não permitido.');
  const observedOn=body.observedOn || null;
  if(observedOn && (typeof observedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(observedOn)||!Number.isFinite(Date.parse(observedOn))||new Date(observedOn).toISOString().slice(0,10)!==observedOn||observedOn>new Date().toISOString().slice(0,10)))return fail('Informe uma data válida, até hoje.');
  if(body.kind==='observation'&&!observedOn)return fail('Informe a data da observação.');
  let sourceUrl:string|null=null;
  if(body.sourceUrl){try{if(typeof body.sourceUrl!=='string'||body.sourceUrl.length>1500)throw new Error();const url=new URL(body.sourceUrl);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||!url.hostname.includes('.')||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(url.hostname))throw new Error();sourceUrl=url.href;}catch{return fail('Use um link público válido, começando com https://.');}}
  if(body.kind==='public_source'&&!sourceUrl)return fail('Inclua o link da foto ou documento público.');
  try {
    if(!env.DB)return fail('O envio está indisponível. Tente novamente mais tarde.',503);
    const now=Date.now();const id=crypto.randomUUID();
    const hashBytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode((request.headers.get('cf-connecting-ip') || 'local')+'|'+new Date().toISOString().slice(0,10)));
    const reporterHash=Array.from(new Uint8Array(hashBytes),x=>x.toString(16).padStart(2,'0')).join('');
    const result=await env.DB.prepare("INSERT INTO contributions (id,work_id,kind,message,observed_on,source_url,status,created_at,reporter_hash) SELECT ?,?,?,?,?,?,'pending',?,? WHERE (SELECT COUNT(*) FROM contributions WHERE reporter_hash=? AND created_at>?)<5").bind(id,body.workId,body.kind,body.message.trim(),observedOn,sourceUrl,now,reporterHash,reporterHash,now-3600000).run();
    if(result.meta.changes!==1)return fail('Limite de envios atingido. Tente novamente em uma hora.',429);
    // Retention cleanup must never turn an already-saved submission into an error.
    await env.DB.prepare("UPDATE contributions SET reporter_hash='' WHERE created_at<? AND reporter_hash<>''").bind(now-172800000).run().catch(()=>{});
    return Response.json({receipt:id},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch{return fail('Não foi possível salvar a contribuição. Tente novamente; seus dados continuam no formulário.',503);}
}
