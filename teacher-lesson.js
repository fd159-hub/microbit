(function(root){
    'use strict';
    const query=new URLSearchParams(location.search),active=!!root.TEACHER_CONFIG?.hosted&&root.TEACHER_CONFIG.page==='lesson';
    if(!active){root.TeacherLesson={active:false};return;}
    const year=Number(root.TEACHER_CONFIG.year),classId=root.TEACHER_CONFIG.classId,valid=TeacherCatalog.validScope(year,classId);
    let bridge=null,record=null,ready=false,applying=false,generation=0,savedGeneration=0,timer=null,writing=null,failed=false;
    let banner,status,saveButton,reloadButton,workspace;
    function say(text,error=false){if(status){status.textContent=text;status.classList.toggle('error',error);}}
    function lock(value){if(workspace)workspace.inert=value;const select=document.getElementById('courseSelect');if(select)select.disabled=value;}
    function onChange(snapshot){
        if(!ready||applying||!record)return;
        if(record.current===snapshot.current&&JSON.stringify(record.checked)===JSON.stringify(snapshot.checked))return;
        record={...record,current:snapshot.current,checked:[...snapshot.checked]};generation++;failed=false;say('有新進度，正在準備同步…');clearTimeout(timer);timer=setTimeout(()=>flush(),900);
    }
    async function flush(){
        clearTimeout(timer);
        if(!ready)return false;if(writing)return writing;
        writing=(async()=>{
            while(savedGeneration<generation){
                const target=generation,snapshot={...record,checked:[...record.checked]};say('正在儲存教師進度…');saveButton.disabled=true;
                try{const saved=await TeacherClient.save(snapshot);record={...record,revision:saved.revision,updatedAt:saved.updatedAt};savedGeneration=target;failed=false;say(`已同步 ${new Date(saved.updatedAt).toLocaleTimeString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})}`);}
                catch(error){failed=true;say(error.message,true);reloadButton.hidden=error.code!=='CONFLICT';if(error.code==='SESSION'){ready=false;lock(true);}return false;}
                finally{saveButton.disabled=false;}
            }
            return !failed;
        })();try{return await writing;}finally{writing=null;}
    }
    async function load(){
        if(!valid){say('學年度或班級不正確，請返回教師專區重新選擇。',true);return;}
        if(!TeacherClient.loggedIn()){say('請先登入教師專區，再接續這一班的課程。',true);return;}
        ready=false;lock(true);say('正在讀取本班雲端進度…');
        try{const records=await TeacherClient.read(year,classId);record=TeacherCatalog.normalize(records.find(r=>r.courseId===bridge.courseId)||TeacherCatalog.empty(year,classId,bridge.courseId));applying=true;bridge.restore(record);applying=false;generation=0;savedGeneration=0;failed=false;ready=true;reloadButton.hidden=true;lock(false);say(record.updatedAt?'已載入本班雲端進度':'本班尚未開始這一課');}
        catch(error){applying=false;say(error.message,true);}
    }
    async function navigate(url){if(await flush())location.href=urlForCourse(url);}
    function urlForCourse(file){const url=new URL(file,location.href);url.search=new URLSearchParams({teacher:'1',year:String(year),class:classId||''});return url.href;}
    function attach(api){
        bridge=api;workspace=document.querySelector('.workspace');document.body.classList.add('teacher-mode');
        banner=document.createElement('aside');banner.className='teacher-banner';banner.setAttribute('aria-label','教師教學模式');
        const label=document.createElement('strong');label.textContent=valid?`教師模式 · ${year} 學年度 · ${classId} 班`:'教師模式';
        status=document.createElement('span');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
        const manage=document.createElement('a');manage.className='button';manage.textContent='班級進度／教師登入';manage.target='_top';manage.href=TeacherClient.route('dashboard',{year:String(valid?year:115),class:valid?classId:'601'});
        manage.addEventListener('click',event=>{if(ready&&savedGeneration<generation){event.preventDefault();flush().then(ok=>{if(ok)say('已同步，請再按一次「班級進度」返回。');});}});
        const headerTeacher=document.querySelector('header a[href="teacher.html"]');if(headerTeacher){headerTeacher.href=manage.href;headerTeacher.target='_top';headerTeacher.textContent='教師進度';headerTeacher.addEventListener('click',event=>{if(ready&&savedGeneration<generation){event.preventDefault();flush().then(ok=>{if(ok)say('已同步，請再按一次「教師進度」返回。');});}});}
        saveButton=document.createElement('button');saveButton.className='button';saveButton.textContent='立即同步';saveButton.addEventListener('click',()=>{if(!ready)load();else flush();});
        reloadButton=document.createElement('button');reloadButton.className='button';reloadButton.textContent='重新載入雲端';reloadButton.hidden=true;reloadButton.title='捨棄本視窗尚未同步的修改，改用雲端最新進度';reloadButton.addEventListener('click',()=>load());
        banner.append(label,status,saveButton,reloadButton,manage);document.querySelector('.topline').after(banner);
        document.getElementById('clearUsage').hidden=true;document.getElementById('resetGuide').hidden=true;
        document.getElementById('courseSelect').closest('label').hidden=true;
        const storageStatus=document.getElementById('storageStatus');storageStatus.textContent='教師教學進度保存在雲端；MakeCode 作品依本機班級分開保存。';
        const studentFooter=document.querySelector('footer');studentFooter.textContent='教師模式 · 教學進度跨電腦同步 · MakeCode 作品保存在目前瀏覽器';
        lock(true);load();
    }
    root.TeacherLesson={active,year,classId,onChange,attach,navigate,urlForCourse,projectKey:course=>`microbit-teacher-projects-${year}-${classId}-${course}-v1`};
    root.addEventListener('beforeunload',event=>{if(savedGeneration<generation){event.preventDefault();event.returnValue='';}});
})(window);
