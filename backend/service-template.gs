// micro:bit 教師進度服務。只使用 Apps Script 私有 Properties。
// 部署：以自己身分執行；僅校內 Google 帳號。後端每次讀寫驗證登入者網域。
const COURSE_STEPS = __COURSE_STEPS__;
const COURSE_TERMS = __COURSE_TERMS__;
const TEACHER_DOCUMENTS = __TEACHER_DOCUMENTS__;
const TEACHER_FILES = __TEACHER_FILES__;
function render_(html) {
  var scripts=[];
  html=html.replace(/<script src="([^"?]+)(?:\?[^\"]*)?" defer><\/script>/g,function(_,name){scripts.push(TEACHER_FILES[name]);return '';});
  html=html.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?[^\"]*)?">/g,function(_,name){return '<style>'+TEACHER_FILES[name]+'</style>';});
  return html.replace('</body>','<script>\n'+scripts.join('\n;\n').replace(/<\/script/gi,'<\\/script')+'\n<\/script></body>');
}
function doGet(e) {
  var identity=identity_();if(!identity.ok)return HtmlService.createHtmlOutput('<h1>無法進入教師專區</h1><p>請使用 @fdes.tyc.edu.tw Google 帳號登入；若仍無法辨識帳號，請聯絡管理者。</p>');
  var p=e&&e.parameter||{},courseId=String(p.id||'');
  var page=p.page==='lesson'&&Object.prototype.hasOwnProperty.call(COURSE_STEPS,courseId)?'lesson':'dashboard';
  var html=TEACHER_DOCUMENTS[page==='lesson'?courseId:'dashboard'];
  var context={email:identity.email,userId:identity.userId,hosted:true,hostUrl:ScriptApp.getService().getUrl(),page:page,courseId:courseId,year:Number(p.year||115),term:String(p.term||'上'),classId:String(p['class']||'601')};
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
function identity_() {
  var email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  if(!/^[^@\s]+@fdes\.tyc\.edu\.tw$/.test(email))return {ok:false,code:'SESSION',error:'請使用 @fdes.tyc.edu.tw Google 帳號登入，系統無法確認目前帳號。'};
  return {ok:true,email:email,userId:hash_(email)};
}
function validScope_(year,classId,term) { return [undefined,'上','下'].indexOf(term)>=0&& Number.isInteger(year)&&year>=115&&year<=999&&['601','602','603','604','605'].indexOf(classId)>=0; }
function record_(value) {
  if(!value||!validScope_(value.year,value.classId,value.term)||!Object.prototype.hasOwnProperty.call(COURSE_STEPS,value.courseId))throw new Error('Invalid record');
  var term=value.term||'上',assigned=COURSE_TERMS[value.courseId];
  if(assigned.year!==value.year||assigned.term!==term)throw new Error('Course not assigned to semester');
  var total=COURSE_STEPS[value.courseId],checked=value.checked;
  if(!Array.isArray(checked)||checked.length>total||checked.some(function(n,i){return n!==i;}))throw new Error('Invalid progress');
  if(!Number.isInteger(value.current)||value.current<0||value.current>Math.min(checked.length,total-1))throw new Error('Invalid current');
  if(typeof value.note!=='string'||value.note.length>500)throw new Error('Invalid note');
  return {term:term,year:value.year,classId:value.classId,courseId:value.courseId,current:value.current,checked:checked.slice(),note:value.note};
}
function api_(req) {
  if(!req||typeof req.action!=='string')return {ok:false,code:'REQUEST',error:'請求格式不正確。'};
  var identity=identity_();if(!identity.ok)return identity;
  var p=props_(),ownerPrefix='teacher_'+identity.userId+'_';
  if(req.action==='identity')return identity;
  if(req.action==='read'){
    if(!validScope_(req.year,req.classId,req.term))return {ok:false,code:'SCOPE',error:'學年度或班級不正確。'};
    var prefix=ownerPrefix+'progress_'+req.year+'_'+req.classId+'_',all=p.getProperties();
    return {ok:true,records:Object.keys(all).filter(function(k){return k.indexOf(prefix)===0;}).map(function(k){var r=JSON.parse(all[k]);r.term=r.term||'上';return r;}).filter(function(r){return r.term===(req.term||'上');})};
  }
  if(req.action==='save'){
    var record;try{record=record_(req.record);}catch(err){return {ok:false,code:'VALIDATION',error:'教學進度格式不正確。'};}
    if(!Number.isInteger(req.expectedRevision)||req.expectedRevision<0)return {ok:false,code:'VALIDATION',error:'進度版本不正確。'};
    var saveLock=LockService.getScriptLock();saveLock.waitLock(10000);
    try{
      var key=ownerPrefix+'progress_'+record.year+'_'+record.classId+'_'+record.courseId+(record.term==='下'?'_lower':''),old=p.getProperty(key),revision=old?JSON.parse(old).revision:0;
      if(revision!==req.expectedRevision)return {ok:false,code:'CONFLICT',error:'另一台電腦已更新此課進度，請重新載入後再修改。',record:JSON.parse(old)};
      record.revision=revision+1;record.updatedAt=new Date().toISOString();p.setProperty(key,JSON.stringify(record));return {ok:true,record:record};
    }finally{saveLock.releaseLock();}
  }
  return {ok:false,code:'ACTION',error:'不支援這個操作。'};
}
