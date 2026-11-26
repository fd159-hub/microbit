// 驗證實際送入 HtmlService 的14個頁面，不只檢查各原始檔。
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'teacher-private/Code.gs'),'utf8'),ctx);
const ids=['dashboard',...require(path.join(root,'teacher-catalog.js')).courses.map(c=>c.id)];
for(const id of ids){
 const html=vm.runInContext(`render_(TEACHER_DOCUMENTS[${JSON.stringify(id)}])`,ctx);
 const refs=[...html.matchAll(/<script src="https:\/\/fd159-hub.github.io\/microbit\/([^"?]+)\?v=resume-20261126-1" defer><\/script>/g)].map(m=>m[1]);
 assert(refs.length>=4,id+' external scripts missing');
 assert(!html.includes('<script>'),id+' must not inline classroom code');
 for(const ref of refs)new vm.Script(fs.readFileSync(path.join(root,ref),'utf8'),{filename:ref});
 if(id!=='dashboard'){assert(refs.indexOf('teacher-lesson.js')<refs.indexOf('guided.js'));assert(refs.indexOf('teacher-catalog.js')<refs.indexOf('teacher-lesson.js'));}
}
console.log('PASS 14 rendered pages: external defer scripts, unchanged source syntax, dependency order.');
