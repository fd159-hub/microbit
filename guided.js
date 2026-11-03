'use strict';
const $=id=>document.getElementById(id);
const COURSE_ID=document.body.dataset.lesson||'09';
const KEY=`microbit${COURSE_ID}-guided-v1`;
const ORIGIN='https://makecode.microbit.org';
let current=0,checked=[];
// 由官方 renderblocks 產生並隨網站保存，離線仍可看圖。
const images=new Map(Array.from({length:GUIDE_STEPS.length-1},(_,i)=>[i+1,COURSE_ID==='09'?`assets/step-${i+1}.png`:`assets/${COURSE_ID}/step-${i+1}.png`]));
// MakeCode 官方 controller 協定：內嵌完整編輯器由本頁提供本機專案儲存。
// 僅接受指定 iframe 與官方 origin，不向外部服務同步學生程式。
const PROJECT_KEY=`microbit${COURSE_ID}-makecode-projects-v1`;
let editorProjects=[];
try{const saved=JSON.parse(localStorage.getItem(PROJECT_KEY)||'[]');if(Array.isArray(saved))editorProjects=saved.filter(p=>p&&typeof p==='object'&&p.text&&typeof p.text==='object');}catch{$('editorSaveStatus').textContent='專案紀錄無法讀取，請下載 HEX 保存。';}
window.addEventListener('message',ev=>{
    if(ev.origin!==ORIGIN||ev.source!==$('makecode').contentWindow||!ev.data||ev.data.type!=='pxthost')return;
    const message=ev.data;
    if(message.action==='workspacesync'){
        $('makecode').contentWindow.postMessage({...message,projects:editorProjects},ORIGIN);
    }else if(message.action==='workspacesave'&&message.project&&typeof message.project.text==='object'){
        const p=message.project,id=p.header?.id||p.id||'current';
        const index=editorProjects.findIndex(q=>(q.header?.id||q.id||'current')===id);
        if(index>=0)editorProjects[index]=p;else editorProjects.push(p);
        try{localStorage.setItem(PROJECT_KEY,JSON.stringify(editorProjects));$('editorSaveStatus').textContent='專案已保存在這個瀏覽器';}
        catch{$('editorSaveStatus').textContent='無法保留專案，離開前請下載 HEX。';}
    }
});
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');current=Number.isInteger(saved.current)&&saved.current>=0&&saved.current<GUIDE_STEPS.length?saved.current:0;checked=Array.isArray(saved.checked)?saved.checked.filter(x=>Number.isInteger(x)&&x>=0&&x<GUIDE_STEPS.length):[];}catch{$('storageStatus').textContent='瀏覽器無法保留紀錄，仍可照常上課。';}
function save(){try{localStorage.setItem(KEY,JSON.stringify({current,checked}));}catch{$('storageStatus').textContent='無法儲存步驟紀錄。';}}
// 只能前往第一個尚未確認的步驟；舊版跳著勾選的紀錄只保留連續完成的部分。
function unlockedStep(){const first=GUIDE_STEPS.findIndex((_,i)=>!checked.includes(i));return first===-1?GUIDE_STEPS.length-1:first;}
let completedPrefix=0;
while(completedPrefix<GUIDE_STEPS.length&&checked.includes(completedPrefix))completedPrefix++;
checked=Array.from({length:completedPrefix},(_,i)=>i);
current=Math.min(current,unlockedStep());
function updateControls(){
    const confirmed=checked.includes(current),last=current===GUIDE_STEPS.length-1;
    $('prev').disabled=current===0;
    $('next').disabled=!confirmed||last;
    $('next').textContent=last?(confirmed?'本課完成 ✓':'完成最後檢查'):confirmed?'下一步 →':'請先檢查並打勾';
    $('journey').textContent=checked.length===GUIDE_STEPS.length?`第 ${COURSE_ID} 課已完成 ✓`:`已檢查 ${checked.length} / ${GUIDE_STEPS.length} 步`;
    $('stepDots').querySelectorAll('button').forEach((b,j)=>{
        b.disabled=j>unlockedStep();
        b.classList.toggle('active',j===current);
        b.classList.toggle('done',checked.includes(j));
        b.setAttribute('aria-current',j===current?'step':'false');
        b.title=b.disabled?'請先完成前面的檢查':`第 ${j+1} 步`;
    });
}
GUIDE_STEPS.forEach((s,i)=>{const b=document.createElement('button');b.className='step-dot';b.setAttribute('aria-label',`第 ${i+1} 步：${s.title}`);b.addEventListener('click',()=>show(i));$('stepDots').append(b);});
function renderImage(){
    const s=GUIDE_STEPS[current],uri=images.get(current);
    $('diagram').classList.toggle('has-official',!!uri);
    $('officialBlocks').hidden=!uri;
    $('pictureZoom').hidden=!uri;
    if(uri){
        $('pictureZoom').href=uri;
        $('officialBlocks').src=uri;
        $('officialBlocks').alt=`第 ${current+1} 步：${s.title}，官方 MakeCode 積木圖`;
        $('renderStatus').textContent='官方積木圖';
    }else{
        $('officialBlocks').removeAttribute('src');
        $('renderStatus').textContent=s.code?'位置示意 · 請保留 assets 資料夾':'看圖，跟著做。';
    }
}
function show(i){if(!Number.isInteger(i)||i<0||i>unlockedStep())return;current=i;const s=GUIDE_STEPS[i];$('stepNumber').textContent=`STEP ${String(i+1).padStart(2,'0')} / ${String(GUIDE_STEPS.length).padStart(2,'0')}`;$('stepTitle').textContent=s.title;$('instruction').textContent=s.action;$('categoryPath').replaceChildren(...s.paths.map(([color,name])=>{const span=document.createElement('span');span.className=`chip ${color}`;span.textContent=name;return span;}));$('fallbackBlocks').innerHTML=s.visual;$('checkText').textContent=s.check;$('stepCheck').checked=checked.includes(i);$('stepHint').textContent=s.hint;$('counter').textContent=`${i+1} / ${GUIDE_STEPS.length}`;updateControls();$('guideScroll').scrollTop=0;renderImage();save();}
$('officialBlocks').addEventListener('error',()=>{images.delete(current);renderImage();});
$('prev').addEventListener('click',()=>{if(current>0)show(current-1);});
$('next').addEventListener('click',()=>{if(checked.includes(current)&&current<GUIDE_STEPS.length-1)show(current+1);});
$('stepCheck').addEventListener('change',()=>{
    // 取消前面的確認時，後續步驟也要重新檢查。
    checked=checked.filter(x=>x<current);
    if($('stepCheck').checked)checked.push(current);
    updateControls();save();
});
$('layoutToggle').addEventListener('click',()=>{const compact=document.body.classList.toggle('compact');$('layoutToggle').textContent=compact?'恢復左右對照':'教學放大';$('layoutToggle').setAttribute('aria-pressed',String(compact));});
$('originalCode').textContent=fullProgram;
$('resetGuide').addEventListener('click',()=>{checked=[];show(0);$('storageStatus').textContent='已清除步驟勾選，右側 MakeCode 專案不受影響。';});
const demo=COURSE_ID==='08'?createClapModel():createBlowModel();
for(let i=0;i<25;i++){const p=document.createElement('span');p.className='pixel';$('demoGrid').append(p);}
function renderDemo(){[...$('demoGrid').children].forEach((p,i)=>p.classList.toggle('on',demo.pixels[i]));$('demoGrid').setAttribute('aria-label',`目前 ${demo.pixels.filter(Boolean).length} 顆 LED 亮起`);}
if(COURSE_ID==='08'){
    $('demoClap').addEventListener('click',()=>{demo.loudEvent();renderDemo();$('demoStatus').textContent=`開關 = ${demo.state} → ${demo.state===1?'亮燈':'熄燈'}`;});
    $('demoReset').addEventListener('click',()=>{demo.reset();renderDemo();$('demoStatus').textContent='開機：開關 = 0，燈是熄滅的。';});
    $('demoStatus').textContent='開機：開關 = 0，燈是熄滅的。';
}else{
$('demoA').addEventListener('click',()=>{demo.fill();renderDemo();$('demoStatus').textContent='25 顆全亮。接著試試音量 180 和 181。';});$('demoReset').addEventListener('click',()=>{demo.reset();renderDemo();$('trace').replaceChildren();$('demoStatus').textContent='開機空白，先按 A。';});
$('sound').addEventListener('input',()=>{$('soundValue').textContent=$('sound').value;});$('demoRound').addEventListener('click',()=>{const level=Number($('sound').value);const log=demo.round(level);renderDemo();$('demoStatus').textContent=level<=180?'還不夠大聲！要超過 180 才會動。':`完成一輪，目前 ${demo.pixels.filter(Boolean).length} 顆亮起。`;$('trace').replaceChildren(...log.map(r=>{const li=document.createElement('li');li.textContent=r.kind==='quiet'?'音量 ≤ 180，不動作。':r.kind==='empty'?`(${r.x}, ${r.y}) 沒有亮點，略過。`:r.kind==='out'?`(${r.x}, 0) → 移出上緣。`:`(${r.x}, ${r.y}) → (${r.x}, ${r.destination})`;return li;}));});
}
if($('courseSelect')){
    $('courseSelect').value=COURSE_ID==='08'?'lesson08.html':'lesson09.html';
    $('courseSelect').addEventListener('change',()=>{save();window.location.href=$('courseSelect').value;});
}
// 同站分頁一併重設；替換 iframe，避免舊編輯器的延遲存檔寫回已清除的內容。
const RESET_SIGNAL='microbit-classroom-reset-event';
let resetChannel=null,lastResetId='';
try{lastResetId=localStorage.getItem(RESET_SIGNAL)||'';}catch{}
try{resetChannel=new BroadcastChannel('microbit-classroom-reset');}catch{}
function clearUsage(resetId,announce=false){
    if(resetId===lastResetId)return;
    lastResetId=resetId;
    editorProjects=[];
    const oldFrame=$('makecode');
    const cleanFrame=oldFrame.cloneNode(false);
    oldFrame.replaceWith(cleanFrame);
    let storageCleared=true;
    try{
        const keys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i));
        for(const key of keys){
            if(/^microbit\d{2}-(guided|makecode-projects)-v\d+$/.test(key)||['microbit-classroom-v1','microbit-actual-lessons-v1'].includes(key))localStorage.removeItem(key);
        }
        if(announce)localStorage.setItem(RESET_SIGNAL,resetId);
    }catch{storageCleared=false;}
    checked=[];current=0;show(0);
    demo.reset();renderDemo();
    if($('trace'))$('trace').replaceChildren();
    if($('sound')){$('sound').value='180';$('soundValue').textContent='180';}
    $('demoStatus').textContent=COURSE_ID==='08'?'開機：開關 = 0，燈是熄滅的。':'開機空白，先按 A。';
    $('storageStatus').textContent='';
    $('editorSaveStatus').textContent='正在開啟空白練習區…';
    $('clearStatus').textContent=storageCleared?'已清除本站兩課進度與積木。':'已重設目前畫面，但瀏覽器未允許清除存檔。';
    if(announce&&resetChannel)resetChannel.postMessage({type:'clear-usage',id:resetId});
}
$('clearUsage').addEventListener('click',()=>clearUsage(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36),true));
window.addEventListener('storage',ev=>{if(ev.key===RESET_SIGNAL&&ev.newValue)clearUsage(ev.newValue);});
if(resetChannel)resetChannel.addEventListener('message',ev=>{if(ev.data?.type==='clear-usage'&&typeof ev.data.id==='string')clearUsage(ev.data.id);});
show(current);renderDemo();


