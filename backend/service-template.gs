// micro:bit 教師進度服務。只使用 Apps Script 私有 Properties。
// 部署：以自己身分執行；存取權限：僅校內 Google 帳號。所有進度操作另須教師密碼憑證。
const INITIAL_SALT = '__INITIAL_SALT__';
const INITIAL_VERIFIER = '__INITIAL_VERIFIER__';
const COURSE_STEPS = __COURSE_STEPS__;
const SESSION_HOURS = 8;
const TEACHER_DOCUMENTS = __TEACHER_DOCUMENTS__;
const TEACHER_FILES = __TEACHER_FILES__;
function render_(html) {
  var scripts=[];
  html=html.replace(/<script src="([^"?]+)(?:\?[^\"]*)?" defer><\/script>/g,function(_,name){scripts.push(TEACHER_FILES[name]);return '';});
  html=html.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?[^\"]*)?">/g,function(_,name){return '<style>'+TEACHER_FILES[name]+'</style>';});
  return html.replace('</body>','<script>\n'+scripts.join('\n;\n').replace(/<\/script/gi,'<\\/script')+'\n<\/script></body>');
}
function doGet(e) {
  var p=e&&e.parameter||{},courseId=String(p.id||'');
  var page=p.page==='lesson'&&Object.prototype.hasOwnProperty.call(COURSE_STEPS,courseId)?'lesson':'dashboard';
  var html=TEACHER_DOCUMENTS[page==='lesson'?courseId:'dashboard'];
  var context={hosted:true,hostUrl:ScriptApp.getService().getUrl(),page:page,courseId:courseId,year:Number(p.year||115),classId:String(p['class']||'601')};
  var inject='<base href="https://fd159-hub.github.io/microbit/" target="_top"><script>window.TEACHER_CONFIG='+JSON.stringify(context).replace(/</g,'\\u003c')+';<\/script>';
  return HtmlService.createHtmlOutput(render_(html).replace('<head>','<head>'+inject)).setTitle('micro:bit 教師教學進度');
}
function teacherApi(request) { try { return api_(request); } catch(err) { return {ok:false,code:'REQUEST',error:'請求無法處理，請稍後再試。'}; } }
function doPost(e) {
  try {
    if (!e || !e.postData || e.postData.contents.length > 12000) throw new Error('請求格式不正確');
    return json_(api_(JSON.parse(e.postData.contents)));
  } catch (err) { return json_({ok:false,code:'REQUEST',error:'請求無法處理，請稍後重試。'}); }
}
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function props_() { return PropertiesService.getScriptProperties(); }
function hex_(bytes) { return bytes.map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join(''); }
function hash_(value) { return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value),Utilities.Charset.UTF_8)); }
function random_() { return hash_(Utilities.getUuid()+Utilities.getUuid()+Date.now()); }
function equal_(a,b) { if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;var n=0;for(var i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0; }
function metadata_() {
  var p=props_(),salt=p.getProperty('PASSWORD_SALT');
  if(!salt){var lock=LockService.getScriptLock();lock.waitLock(10000);try{salt=p.getProperty('PASSWORD_SALT');if(!salt){salt=INITIAL_SALT;p.setProperty('PASSWORD_SALT',salt);p.setProperty('PASSWORD_VERIFIER',INITIAL_VERIFIER);}}finally{lock.releaseLock();}}
  return {ok:true,initialized:!!p.getProperty('PASSWORD_VERIFIER'),salt:salt,iterations:150000,minLength:8};
}
function auth_(token) {
  if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return false;
  var p=props_(),raw=p.getProperty('session_'+hash_(token));if(!raw)return false;
  return Number(raw)>Date.now();
}
function session_() {
  var p=props_(),all=p.getProperties(),now=Date.now();
  Object.keys(all).filter(function(k){return k.indexOf('session_')===0;}).forEach(function(k){if(Number(all[k])<=now)p.deleteProperty(k);});
  var sessions=Object.keys(p.getProperties()).filter(function(k){return k.indexOf('session_')===0;});
  if(sessions.length>=30){sessions.sort(function(a,b){return Number(all[a])-Number(all[b]);});p.deleteProperty(sessions[0]);}
  var token=random_(),expires=now+SESSION_HOURS*3600000;p.setProperty('session_'+hash_(token),String(expires));return {ok:true,token:token,expires:expires};
}
function validProof_(proof) { return typeof proof==='string'&&/^[a-f0-9]{64}$/.test(proof); }
function validScope_(year,classId) { return Number.isInteger(year)&&year>=115&&year<=999&&['601','602','603','604','605'].indexOf(classId)>=0; }
function record_(value) {
  if(!value||!validScope_(value.year,value.classId)||!Object.prototype.hasOwnProperty.call(COURSE_STEPS,value.courseId))throw new Error('Invalid record');
  var total=COURSE_STEPS[value.courseId],checked=value.checked;
  if(!Array.isArray(checked)||checked.length>total||checked.some(function(n,i){return n!==i;}))throw new Error('Invalid progress');
  if(!Number.isInteger(value.current)||value.current<0||value.current>Math.min(checked.length,total-1))throw new Error('Invalid current');
  if(typeof value.note!=='string'||value.note.length>500)throw new Error('Invalid note');
  return {year:value.year,classId:value.classId,courseId:value.courseId,current:value.current,checked:checked.slice(),note:value.note};
}
function api_(req) {
  if(!req||typeof req.action!=='string')return {ok:false,code:'REQUEST',error:'請求格式不正確。'};
  var p=props_();
  if(req.action==='metadata')return metadata_();
  if(req.action==='login'){
    metadata_();
    var lock=LockService.getScriptLock();lock.waitLock(10000);
    try{
      if(Number(p.getProperty('LOGIN_LOCK_UNTIL')||0)>Date.now())return {ok:false,code:'RATE_LIMIT',error:'密碼嘗試次數較多，請等一分鐘再試。'};
      if(!validProof_(req.proof))return {ok:false,code:'AUTH',error:'密碼不正確。'};
      if(!equal_(hash_(req.proof),p.getProperty('PASSWORD_VERIFIER'))){
        var failed=Number(p.getProperty('LOGIN_FAILURES')||0)+1;
        if(failed>=8){p.setProperty('LOGIN_LOCK_UNTIL',String(Date.now()+60000));p.setProperty('LOGIN_FAILURES','0');}else p.setProperty('LOGIN_FAILURES',String(failed));
        return {ok:false,code:'AUTH',error:'密碼不正確。'};
      }
      p.deleteProperty('LOGIN_FAILURES');p.deleteProperty('LOGIN_LOCK_UNTIL');return session_();
    }finally{lock.releaseLock();}
  }
  if(!auth_(req.token))return {ok:false,code:'SESSION',error:'登入已逾時，請重新輸入教師密碼。'};
  if(req.action==='logout'){p.deleteProperty('session_'+hash_(req.token));return {ok:true};}
  if(req.action==='read'){
    if(!validScope_(req.year,req.classId))return {ok:false,code:'SCOPE',error:'學年度或班級不正確。'};
    var prefix='progress_'+req.year+'_'+req.classId+'_',all=p.getProperties();
    return {ok:true,records:Object.keys(all).filter(function(k){return k.indexOf(prefix)===0;}).map(function(k){return JSON.parse(all[k]);})};
  }
  if(req.action==='save'){
    var record;try{record=record_(req.record);}catch(err){return {ok:false,code:'VALIDATION',error:'教學進度格式不正確。'};}
    if(!Number.isInteger(req.expectedRevision)||req.expectedRevision<0)return {ok:false,code:'VALIDATION',error:'進度版本不正確。'};
    var saveLock=LockService.getScriptLock();saveLock.waitLock(10000);
    try{
      if(!auth_(req.token))return {ok:false,code:'SESSION',error:'登入已逾時，請重新登入。'};
      var key='progress_'+record.year+'_'+record.classId+'_'+record.courseId,old=p.getProperty(key),revision=old?JSON.parse(old).revision:0;
      if(revision!==req.expectedRevision)return {ok:false,code:'CONFLICT',error:'另一台電腦已更新此課進度，請重新載入後再修改。',record:JSON.parse(old)};
      record.revision=revision+1;record.updatedAt=new Date().toISOString();p.setProperty(key,JSON.stringify(record));return {ok:true,record:record};
    }finally{saveLock.releaseLock();}
  }
  if(req.action==='changePassword'){
    var passwordLock=LockService.getScriptLock();passwordLock.waitLock(10000);
    try{
      if(!auth_(req.token)||!validProof_(req.currentProof)||!equal_(hash_(req.currentProof),p.getProperty('PASSWORD_VERIFIER'))||!validProof_(req.newProof))return {ok:false,code:'AUTH',error:'目前密碼不正確。'};
      p.setProperty('PASSWORD_VERIFIER',hash_(req.newProof));Object.keys(p.getProperties()).filter(function(k){return k.indexOf('session_')===0;}).forEach(function(k){p.deleteProperty(k);});return session_();
    }finally{passwordLock.releaseLock();}
  }
  return {ok:false,code:'ACTION',error:'不支援這個操作。'};
}
