import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {buildProjectContext} from './source/project-context.mjs';
const candidate=path.resolve(process.argv[2]||'');
const report=JSON.parse(fs.readFileSync(path.join(candidate,'validation.json')));
const manifest=JSON.parse(fs.readFileSync('public/data/projects-manifest.json'));
if(report.status!=='validated'||report.loadAfter!==manifest.meta.sourceLoad||report.count!==manifest.total)throw new Error('Source does not match published snapshot');
const db=new DatabaseSync(path.join(candidate,'source.sqlite'),{readOnly:true});
try{console.log(JSON.stringify(buildProjectContext(db,'public/data',report.loadAfter)));}finally{db.close();}
