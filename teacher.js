(function(){
    'use strict';
    const $=id=>document.getElementById(id),C=TeacherCatalog,A=TeacherClient;
    if(!window.TEACHER_CONFIG?.hosted){const host=window.TEACHER_CONFIG?.hostUrl;if(host){document.querySelector('main').textContent='正在開啟校內 Google 教師入口…';location.replace(host);}else $('loginStatus').textContent='教師雲端服務尚未設定。';return;}
    let activeScope={year:115,term:'上',classId:'601'},loadVersion=0;
    const dirty=new Set(),cards=new Map();
    const time=value=>value?new Date(value).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false}):'尚無雲端紀錄';
    const message=(el,text,error=false)=>{el.textContent=text;el.classList.toggle('error',error);};
    function showLogin(){ $('dashboard').hidden=true;message($('loginStatus'),'無法確認登入帳號，請重新開啟教師入口。',true); }
    function setBusy(value){$('loadScope').disabled=value;$('schoolYear').disabled=value;$('classId').disabled=value;$('courseProgress').inert=value;}
    function fieldsChanged(card){const record=card.record;return Number(card.select.value)!==record.checked.length||card.note.value!==record.note;}
    function editedRecord(card){const count=Number(card.select.value),record=card.record;return C.normalize({...record,checked:Array.from({length:count},(_,i)=>i),current:count===record.checked.length?record.current:Math.min(count,card.course.steps.length-1),note:card.note.value});}
    async function saveCard(card){
        if(card.busy)return false;
        card.busy=true;card.save.disabled=true;card.resume.disabled=true;message(card.status,'正在儲存到雲端…');
        try{card.record=await A.save(editedRecord(card));dirty.delete(card.course.id);renderSummary(card);message(card.status,'已儲存');return true;}
        catch(error){message(card.status,error.message,true);return false;}
        finally{card.busy=false;card.save.disabled=false;card.resume.disabled=false;}
    }
    function renderSummary(card){const n=card.record.checked.length,total=card.course.steps.length;card.summary.textContent=n===total?'本課已完成':n===0?'尚未開始':`已完成 ${n} / ${total} 步`;card.updated.textContent=`更新：${time(card.record.updatedAt)}`;}
    function renderCourse(course,record){
        const article=document.createElement('article');article.className='progress-card';article.dataset.course=course.id;
        const number=document.createElement('span');number.className='course-number';number.textContent=`LESSON ${course.label}`;
        const title=document.createElement('h3');title.textContent=course.title;
        const summary=document.createElement('p');summary.className='progress-summary';
        const selectLabel=document.createElement('label');selectLabel.textContent='已完成的步驟';
        const select=document.createElement('select');select.setAttribute('aria-label',`${course.title}：已完成的步驟`);
        for(let i=0;i<=course.steps.length;i++){const option=document.createElement('option');option.value=String(i);option.textContent=i===0?'尚未開始':i===course.steps.length?`本課完成（${i} 步）`:`第 ${i} 步：${course.steps[i-1]}`;select.append(option);}select.value=String(record.checked.length);selectLabel.append(select);
        const noteLabel=document.createElement('label');noteLabel.textContent='教學備註（選填）';
        const note=document.createElement('textarea');note.maxLength=500;note.rows=3;note.value=record.note;note.placeholder='例如：下次先複習按鈕事件';note.setAttribute('aria-label',`${course.title}：教學備註`);noteLabel.append(note);
        const actions=document.createElement('div');actions.className='actions';const save=document.createElement('button');save.type='button';save.className='button';save.textContent='儲存進度';const resume=document.createElement('a');resume.className='button primary';resume.textContent='接續上課';resume.target='_top';resume.href=A.route('lesson',{id:course.id,year:String(record.year),term:record.term,class:record.classId});actions.append(save,resume);
        const updated=document.createElement('p');updated.className='updated';const status=document.createElement('p');status.setAttribute('role','status');
        article.append(number,title,summary,selectLabel,noteLabel,actions,updated,status);
        const card={course,record,select,note,save,resume,summary,updated,status,article,busy:false};cards.set(course.id,card);renderSummary(card);
        const mark=()=>{if(fieldsChanged(card)){dirty.add(course.id);message(status,'已修改，請儲存進度。');}else{dirty.delete(course.id);message(status,'');}};
        select.addEventListener('change',mark);note.addEventListener('input',mark);save.addEventListener('click',()=>saveCard(card));
        resume.addEventListener('click',event=>{if(card.busy||fieldsChanged(card)){event.preventDefault();message(card.status,'請先儲存這一課的修改，再接續上課。',true);}});
        return article;
    }
    async function loadScope(){
        if(dirty.size){message($('cloudStatus'),'請先儲存已修改的課程，再切換班級。',true);return;}
        const scope=$('schoolYear').value,year=Number(scope.slice(0,-1)),term=scope.slice(-1),classId=$('classId').value;
        if(!C.validScope(year,classId,term)){message($('cloudStatus'),'請選擇115起的學年度／學期，班級限601～605。',true);return;}
        const version=++loadVersion;setBusy(true);message($('cloudStatus'),'正在讀取雲端進度…');
        try{const records=await A.read(year,classId,term);if(version!==loadVersion)return;activeScope={year,term,classId};cards.clear();$('scopeTitle').textContent=`${year}${term} · ${classId} 班`;
            const byId=new Map(records.map(r=>[r.courseId,C.normalize(r)])),courses=C.courses.filter(c=>c.year===year&&c.term===term);$('courseProgress').replaceChildren(...courses.map(course=>renderCourse(course,byId.get(course.id)||C.empty(year,classId,course.id,term))));$('emptyCourses').hidden=courses.length>0;
            try{localStorage.setItem('microbit-teacher-scope-v2-'+TEACHER_CONFIG.userId,JSON.stringify(activeScope));}catch{}
            message($('cloudStatus'),'已讀取雲端進度');
        }catch(error){message($('cloudStatus'),error.message,true);if(error.code==='SESSION')showLogin();}finally{if(version===loadVersion)setBusy(false);}
    }
    async function openDashboard(){ $('dashboard').hidden=false;await loadScope(); }
    const currentYear=new Date().getFullYear()-1911,configuredYear=Number(TEACHER_CONFIG.year||115);
    for(let year=115;year<=Math.min(999,Math.max(118,currentYear+2,configuredYear));year++)for(const term of ['上','下']){const option=document.createElement('option');option.value=String(year)+term;option.textContent=String(year)+term;$('schoolYear').append(option);}
    const proposed={year:configuredYear,term:TEACHER_CONFIG.term||'上',classId:TEACHER_CONFIG.classId||'601'};
    if(C.validScope(proposed.year,proposed.classId,proposed.term)){$('schoolYear').value=String(proposed.year)+proposed.term;$('classId').value=proposed.classId;}
    $('loadScope').addEventListener('click',loadScope);
    window.addEventListener('beforeunload',event=>{if(dirty.size){event.preventDefault();event.returnValue='';}});
    if(A.loggedIn()){ $('teacherIdentity').textContent=TEACHER_CONFIG.email;openDashboard(); }else showLogin();
})();
