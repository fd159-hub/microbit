(function(root){
    'use strict';
    const KEY='microbit-teacher-session-v1';
    let session=null,meta=null;
    try{session=JSON.parse(sessionStorage.getItem(KEY)||'null');if(!session||session.expires<=Date.now())session=null;}catch{session=null;}
    function setSession(value){session=value;try{if(value)sessionStorage.setItem(KEY,JSON.stringify(value));else sessionStorage.removeItem(KEY);}catch{}root.dispatchEvent(new CustomEvent('teacher:session',{detail:{loggedIn:!!value}}));}
    async function request(action,body={}){
        if(!root.TEACHER_CONFIG?.hosted||!root.google?.script?.run)throw new Error('請從校內 Google 教師入口登入。');
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),35000);
        try{
            const data={action,...body,...(!['metadata','login'].includes(action)?{token:session?.token||''}:{})};
            const result=await new Promise((resolve,reject)=>{controller.signal.addEventListener('abort',()=>reject(new DOMException('Timeout','AbortError')),{once:true});root.google.script.run.withSuccessHandler(resolve).withFailureHandler(()=>reject(new Error('雲端服務暫時無法回應，請稍後再試。'))).teacherApi(data);});
            if(!result.ok){if(result.code==='SESSION')setSession(null);const error=new Error(result.error||'雲端操作失敗');error.code=result.code;error.record=result.record;throw error;}
            return result;
        }catch(error){if(error.name==='AbortError')throw new Error('雲端回應較慢，請稍後再試；尚未確認儲存。');if(error instanceof TypeError)throw new Error('無法連上教師雲端，請確認網路後再試。');throw error;}finally{clearTimeout(timer);}
    }
    async function metadata(){if(!meta)meta=await request('metadata');return meta;}
    async function proof(password){const m=await metadata();const encoder=new TextEncoder(),key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(m.salt),iterations:m.iterations,hash:'SHA-256'},key,256);return Array.from(new Uint8Array(bits),v=>v.toString(16).padStart(2,'0')).join('');}
    async function login(password){const result=await request('login',{proof:await proof(password)});setSession({token:result.token,expires:result.expires});}
    async function logout(){try{if(session)await request('logout');}finally{setSession(null);}}
    async function changePassword(currentPassword,newPassword){if(newPassword.length<8||newPassword.length>128)throw new Error('新密碼請使用8～128個字元。');const result=await request('changePassword',{currentProof:await proof(currentPassword),newProof:await proof(newPassword)});setSession({token:result.token,expires:result.expires});}
    function route(page,scope={}){const url=new URL(root.TEACHER_CONFIG.hostUrl);url.search=new URLSearchParams({page,...scope});return url.href;}
    root.TeacherClient={metadata,login,logout,changePassword,route,loggedIn:()=>!!session&&session.expires>Date.now(),read:async(year,classId)=>(await request('read',{year,classId})).records,save:async record=>(await request('save',{record:TeacherCatalog.normalize(record),expectedRevision:record.revision||0})).record};
})(window);
