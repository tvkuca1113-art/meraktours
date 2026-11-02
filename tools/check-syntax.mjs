import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):/\.(mjs|js)$/.test(e.name)?[join(d,e.name)]:[]);
const files=['build.mjs',...walk('src'),...walk('tools'),...walk('tests')];
for(const file of files){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0){process.stderr.write(r.stderr);process.exit(1);}}
console.log(`Syntax checked ${files.length} JavaScript modules`);
