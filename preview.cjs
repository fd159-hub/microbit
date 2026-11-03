// 不需安裝套件。僅綁定本機；只提供網站檔案，避免公開其他資料。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = {'/':'index.html','/guided.css':'guided.css','/guided.js':'guided.js','/guide-steps.js':'guide-steps.js','/index.html':'index.html','/style.css':'style.css','/lesson09.css':'lesson09.css','/app.js':'app.js','/lessons.js':'lessons.js','/sim09.js':'sim09.js','/materials/09/microbit-09吹走.hex':'materials/09/microbit-09吹走.hex','/materials/09/main.blocks':'materials/09/main.blocks'};
for(let i=1;i<=7;i++) files['/assets/step-'+i+'.png']='assets/step-'+i+'.png';
files['/lesson08.html']='lesson08.html';files['/lessons08.js']='lessons08.js';files['/guide-steps08.js']='guide-steps08.js';files['/sim08.js']='sim08.js';files['/materials/08/microbit-08拍手燈.hex']='materials/08/microbit-08拍手燈.hex';for(let i=1;i<=7;i++)files['/assets/08/step-'+i+'.png']='assets/08/step-'+i+'.png';
files['/lesson09.html']='lesson09.html';files['/cover.css']='cover.css';
const mime = {'.png':'image/png','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{const name=files[decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)];if(!name){res.writeHead(404);res.end('Not found');return;}fs.readFile(path.join(__dirname,name),(err,data)=>{if(err){res.writeHead(500);res.end('Read error');return;}res.writeHead(200,{'Content-Type':mime[path.extname(name)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));





