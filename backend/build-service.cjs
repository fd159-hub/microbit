'use strict';
// 將課程與教師頁面打包為校內 Google 登入服務。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const C=require(path.join(root,'teacher-catalog.js'));
const docs={dashboard:fs.readFileSync(path.join(root,'teacher.html'),'utf8')};
for(const c of C.courses)docs[c.id]=fs.readFileSync(path.join(root,`lesson${c.id}.html`),'utf8');
const files={};for(const html of Object.values(docs))for(const m of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g))files[m[1]]=fs.readFileSync(path.join(root,m[1]),'utf8');
const output=fs.readFileSync(path.join(__dirname,'service-template.gs'),'utf8').replace('__COURSE_STEPS__',JSON.stringify(Object.fromEntries(C.courses.map(c=>[c.id,c.steps.length])))).replace('__COURSE_TERMS__',JSON.stringify(Object.fromEntries(C.courses.map(c=>[c.id,{year:c.year,term:c.term}])))).replace('__TEACHER_DOCUMENTS__',JSON.stringify(docs)).replace('__TEACHER_FILES__',JSON.stringify(files));
const dir=path.join(root,'teacher-private');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'Code.gs'),output);
console.log('已產生 teacher-private/Code.gs（請勿提交產物）');
