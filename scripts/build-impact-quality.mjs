import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
const values={beneficiaries:[],jobs:[]};
for(const bucket of manifest.buckets){
 for(const row of Object.values(JSON.parse(fs.readFileSync(`source-data/context/${bucket}.json`)))){
  for(const key of Object.keys(values))if(Number.isSafeInteger(row[key])&&row[key]>0)values[key].push(row[key]);
 }
}
const fields={};
for(const [key,list] of Object.entries(values)){
 list.sort((a,b)=>a-b);
 const threshold=list.length?list[Math.ceil(list.length*0.995)-1]:null;
 fields[key]={positiveRecords:list.length,threshold,flagged:list.filter(value=>value>threshold).length};
}
fs.writeFileSync('lib/impact-quality.json',JSON.stringify({version:1,sourceLoad:manifest.sourceLoad,percentile:99.5,fields},null,2)+'\n');
console.log(JSON.stringify({impactQuality:fields}));
