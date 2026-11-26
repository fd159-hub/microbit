const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),catalog=require(path.join(root,'teacher-catalog.js')),data={};
const clean=s=>(s||'').replace(/\\n/g,'\n').trim(),join=(...xs)=>xs.filter(Boolean).join('\n');
for(const c of catalog.courses){
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,c.id==='09'?'lessons.js':`lessons${c.id}.js`),'utf8')+fs.readFileSync(path.join(root,c.id==='09'?'guide-steps.js':`guide-steps${c.id}.js`),'utf8')+';this.exported={steps:GUIDE_STEPS,full:fullProgram};',ctx);
 const s=ctx.exported.steps.map(x=>clean(x.code)),full=clean(ctx.exported.full),snap=[''];
 for(let n=1;n<=c.steps.length;n++){
  let code='';
  if(n===c.steps.length)code=full;
  else switch(c.id){
   case '01':case '04':code=s[n-1];break;
   case '02':code=n<=4?s[n-1]:join(s[3],s[4],n>=6?s[5]:'');break;
   case '03':code=n<=3?s[n-1]:join(s[2],s[3]);break;
   case '05':code=join(n>=2?s[1]:'',n>=3?s[2]:'',n>=4?s[3]:'',n>=5?s[n>=6?5:4]:'');break;
   case '06':code=join(n>=2?s[1]:'',n>=3?s[Math.min(n-1,4)]:'',n>=6?s[n>=7?6:5]:'');break;
   case '07':code=n<=5?s[n-1]:s[4].replace(/\n\}\)\s*$/,()=> '\n'+s[5].slice(s[5].indexOf('\n')+1,s[5].lastIndexOf('\n})'))+'\n})');break;
   case '08':code=n<=3?s[n-1]:join(s[2],s[n-1].replace(/^let 開關 = 0\n/,''));break;
   case '08advanced':code=join(n>=2?s[1]:'',n>=3?s[2]:'',n>=4?(n===6?s[5].replace('    if (餘數','    觸發總次數 += 1\n    餘數 = 觸發總次數 % 3\n    if (餘數'):s[n-1]):'');break;
   case '09':{let loop=n>=3?s[Math.min(n-1,4)]:'';if(n>=6){const nested=s[n>=7?6:5].replace(/^let x = 0\nlet y = 0\n/,'').split('\n').map(x=>'            '+x).join('\n');loop=s[4].replace('            y = randint(0, 4)',()=> '            y = randint(0, 4)\n'+nested);}code=join(n>=2?s[1]:'',loop);break;}
   case '10':code=join(n>=2?s[1]:'',n>=3?s[n>=4?3:2]:'',n>=5?s[4]:'',n>=6?s[5]:'',n>=7?s[6]:'');break;
   case '11':code=n>=7?full:join(n>=2?'let 模式 = 0\nlet 方位 = 0':'',n>=3?s[2]:'',n>=4?s[n-1]:'');break;
   case '12':{const base=clean(vm.runInContext('FOUNDATION_PROJECT.text["main.ts"]',ctx));code=join(base,n>=2?'let 出現 = 0\nlet 分數 = 0\nlet 寶物 = 0':'',n>=3?s[2]:'',n>=4?s[Math.min(n-1,5)]:'',n>=7?s[n-1]:'');break;}
  }
  new vm.Script(code,{filename:`L${c.id}-completed-${n}`});snap.push(code||'');
 }
 assert.equal(snap.at(-1),full);data[c.id]={title:c.title,codes:snap};
}
assert(data['10'].codes[2].includes('setColumnTitles'));assert(!data['10'].codes[2].includes('onButtonPressed'));
assert(data['07'].codes[6].includes('for ('));assert(data['07'].codes[6].includes('Go!'));
fs.writeFileSync(path.join(root,'teacher-snapshots.js'),`(function(root){'use strict';const data=${JSON.stringify(data)};root.TeacherSnapshots={project(courseId,count,scope){const lesson=data[courseId];if(!lesson||!Number.isInteger(count)||count<0||count>=lesson.codes.length)throw Error('示範進度不正確');const name='L'+courseId+' '+lesson.title+' · '+scope.year+scope.term+' '+scope.classId+'班 · 已完成'+count+'步';const dependencies={core:'*',radio:'*',microphone:'*'};if(courseId==='10'&&count>=1)dependencies.datalogger='*';return {header:{name,target:'microbit',targetVersion:'9.0.12',editor:'blocksprj',meta:{},pubId:'',pubCurrent:false},text:{'main.blocks':'', 'main.ts':lesson.codes[count]||'', 'pxt.json':JSON.stringify({name,dependencies,files:['main.blocks','main.ts'],preferredEditor:'blocksprj'})}};}};})(window);\n`);
for(const c of catalog.courses){const file=path.join(root,`lesson${c.id}.html`);let html=fs.readFileSync(file,'utf8');if(!html.includes('src="teacher-snapshots.js'))html=html.replace('<script src="teacher-lesson.js"','<script src="teacher-snapshots.js" defer></script><script src="teacher-lesson.js"');fs.writeFileSync(file,html);}
console.log('PASS: 13 courses; '+Object.values(data).reduce((n,x)=>n+x.codes.length,0)+' cumulative checkpoints; full programs match lesson source.');
