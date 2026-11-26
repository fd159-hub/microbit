'use strict';
// 密碼只從標準輸入讀取，不列印、不寫入產物；產物只保存PBKDF2衍生值的雜湊。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const secret=JSON.parse(fs.readFileSync(0,'utf8'));
if(typeof secret.initialPassword!=='string'||secret.initialPassword.length<8||secret.initialPassword.length>128)throw new Error('初始密碼需8～128字元');
const C=require(path.join(root,'teacher-catalog.js'));
const docs={dashboard:fs.readFileSync(path.join(root,'teacher.html'),'utf8')};
for(const c of C.courses)docs[c.id]=fs.readFileSync(path.join(root,`lesson${c.id}.html`),'utf8');
const files={};for(const html of Object.values(docs))for(const m of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g))files[m[1]]=fs.readFileSync(path.join(root,m[1]),'utf8');
const salt=crypto.randomBytes(32).toString('hex'),proof=crypto.pbkdf2Sync(secret.initialPassword,salt,150000,32,'sha256').toString('hex'),verifier=crypto.createHash('sha256').update(proof).digest('hex');
const output=fs.readFileSync(path.join(__dirname,'service-template.gs'),'utf8').replace('__INITIAL_SALT__',salt).replace('__INITIAL_VERIFIER__',verifier).replace('__COURSE_STEPS__',JSON.stringify(Object.fromEntries(C.courses.map(c=>[c.id,c.steps.length])))).replace('__TEACHER_DOCUMENTS__',JSON.stringify(docs)).replace('__TEACHER_FILES__',JSON.stringify(files));
const dir=path.join(root,'teacher-private');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'Code.gs'),output);
console.log('已產生 teacher-private/Code.gs（不含原始密碼，請勿提交產物）');
