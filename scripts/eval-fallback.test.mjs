import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../app/api/detail/route.ts';

void test('selected ID keeps last validated snapshot when the source fails',async()=>{
  const before=globalThis.fetch;
  globalThis.fetch=async()=>{throw new Error('simulated source outage')};
  try{
    const response=await GET(new Request('https://radar-obras.ricardoguia.com/api/detail?id=128622.33-16'));
    assert.equal(response.status,200);
    const value=await response.json();
    assert.equal(value.id,'128622.33-16');
    assert.equal(value.detailsChecked,false);
    assert.ok(value.fallbackEndpoints.includes('projeto-investimento'));
    assert.ok(value.seedFallbackCollectedAt);
    assert.ok(value.collectedAt);
  }finally{globalThis.fetch=before;}
});

void test('an ID without a preserved detail reports an upstream failure',async()=>{
  const before=globalThis.fetch;
  globalThis.fetch=async()=>{throw new Error('simulated source outage')};
  try{const response=await GET(new Request('https://radar-obras.ricardoguia.com/api/detail?id=missing-id'));assert.equal(response.status,502);}finally{globalThis.fetch=before;}
});
