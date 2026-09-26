import assert from 'node:assert/strict';
const base=process.argv[2]||'http://localhost:3004';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Mutation tests are local-only');
const valid={workId:'4902.35-23',kind:'correction',message:'Teste local: fila privada '+crypto.randomUUID(),email:'local-test@example.com',marketingConsent:true};
// Isolate test quotas. Local Wrangler accepts this fixture header; never run on production.
const testIp=`2001:db8:${crypto.randomUUID().slice(0,4)}::1`;
const send=body=>fetch(base+'/api/contributions',{method:'POST',headers:{'content-type':'application/json','connection':'close','cf-connecting-ip':testIp},body:JSON.stringify(body)});
for(const [body,status] of [[{...valid,workId:'missing'},404],[{...valid,status:'approved'},400],[{...valid,message:'curto'},400],[{...valid,sourceUrl:'javascript:alert(1)'},400],[{...valid,kind:'public_source'},400],[{...valid,kind:'observation'},400],[{...valid,observedOn:'2026-02-31'},400],[{...valid,website:'spam'},400]])assert.equal((await send(body)).status,status);
assert.equal((await fetch(base+'/api/contributions',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(9000)})).status,413);
assert.equal((await fetch(base+'/api/contributions',{method:'POST',headers:{'content-type':'application/json',origin:'https://untrusted.example'},body:JSON.stringify(valid)})).status,403);
for(const body of [{...valid,email:'invalid'},{...valid,email:'',marketingConsent:true},{...valid,emailVerified:true}])assert.equal((await send(body)).status,400);
const saved=await send(valid);assert.equal(saved.status,201);const receipt=await saved.json();assert.match(receipt.receipt,/^[0-9a-f-]{36}$/);assert.ok(!JSON.stringify(receipt).includes(valid.email));
assert.equal((await send(valid)).status,429);
const html=await (await fetch(base+'/obras/4902.35-23/restaurante-estudantil-campus-pirituba')).text();assert.ok(!html.includes(valid.message));
let limited=false;for(let i=0;i<6;i++){const r=await send({...valid,message:valid.message+' '+i});if(r.status===429){limited=true;break;}assert.equal(r.status,201);}assert.ok(limited);
console.log('PASS: validation, same-origin, bounded body, saved receipt, unpublished submissions and rate limit');
