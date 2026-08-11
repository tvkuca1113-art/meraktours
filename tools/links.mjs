import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const files=[];(function walk(d){for(const f of readdirSync(d,{withFileTypes:true})){const p=join(d,f.name);f.isDirectory()?walk(p):p.endsWith('.html')&&files.push(p);}})('dist');
const missing=new Set(), internal=new Set();
for(const f of files){
  const s=readFileSync(f,'utf8');
  for(const m of s.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)){
    const u=m[1]; internal.add(u);
    let t=join('dist',u);
    if(existsSync(t)&&statSync(t).isDirectory()) t=join(t,'index.html');
    if(!existsSync(t)&&!u.startsWith('/#')) missing.add(u+'  <- '+f);
  }
}
console.log('internal refs:',internal.size);
console.log(missing.size?('MISSING:\n'+[...missing].join('\n')):'all internal links resolve');
process.exit(missing.size ? 1 : 0);
