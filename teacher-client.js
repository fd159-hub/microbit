(function(root){
    'use strict';
    async function request(action,body={}){
        if(!root.TEACHER_CONFIG?.hosted||!root.google?.script?.run)throw new Error('請從校內 Google 教師入口登入。');
        let timer;
        try{
            const result=await new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(new Error('雲端回應較慢，請稍後再試；尚未確認儲存。')),35000);root.google.script.run.withSuccessHandler(resolve).withFailureHandler(()=>reject(new Error('雲端服務暫時無法回應，請稍後再試。'))).teacherApi({action,...body});});
            if(!result.ok){const error=new Error(result.error||'雲端操作失敗');error.code=result.code;error.record=result.record;throw error;}return result;
        }finally{clearTimeout(timer);}
    }
    function route(page,scope={}){const url=new URL(root.TEACHER_CONFIG.hostUrl);url.search=new URLSearchParams({page,...scope});return url.href;}
    root.TeacherClient={route,identity:()=>request('identity'),loggedIn:()=>!!root.TEACHER_CONFIG?.email,read:async(year,classId)=>(await request('read',{year,classId})).records,save:async record=>(await request('save',{record:TeacherCatalog.normalize(record),expectedRevision:record.revision||0})).record};
})(window);
