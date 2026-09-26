import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {networkIdentifiers,networkContext,contributionInsertSql} from '../lib/contribution-network.mjs';
const secret='test-only-network-secret-at-least-32-characters';
void test('network pseudonyms depend on secret and day, without exposing an IP',async()=>{
 const before=Date.parse('2026-09-25T23:59:59Z'),after=before+2000;
 const a=await networkIdentifiers('192.0.2.1',secret,before),b=await networkIdentifiers('192.0.2.1',secret,after);
 assert.equal(a[0],b[1]);assert.notEqual(a[0],b[0]);assert.match(a[0],/^[a-f0-9]{64}$/);
 assert.notEqual(a[0],(await networkIdentifiers('192.0.2.1',secret+'other',before))[0]);
 await assert.rejects(()=>networkIdentifiers('192.0.2.1',''));
});
void test('production does not trust forwarded-for or share a fallback identity',()=>{
 const request=new Request('https://radar-obras.ricardoguia.com/api/contributions',{headers:{'x-forwarded-for':'192.0.2.1'}});
 assert.equal(networkContext(request,secret).ip,null);
 assert.equal(networkContext(request,undefined).secret,null);
 const local=networkContext(new Request('http://127.0.0.1:3005/api/contributions'),undefined);assert.ok(local.ip&&local.secret);
});
void test('atomic rolling quota spans UTC midnight and submissions remain pending',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync('drizzle/0000_mighty_stepford_cuckoos.sql','utf8').replaceAll('--> statement-breakpoint',''));
 const submit=async(now,index)=>{const [current,previous]=await networkIdentifiers('192.0.2.1',secret,now);return db.prepare(contributionInsertSql).run(String(index),'4902.35-23','correction','test',null,null,now,current,current,previous,now-3600000).changes;};
 const before=Date.parse('2026-09-25T23:59:00Z');
 for(let i=0;i<5;i++)assert.equal(await submit(before,i),1);
 assert.equal(await submit(before+120000,5),0);
 assert.equal(await submit(before+3600001,6),1);
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM contributions WHERE status<>'pending'").get().n,0);db.close();
});
