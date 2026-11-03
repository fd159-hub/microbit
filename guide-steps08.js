// 第 08 課依原始 HEX 編排，與第 09 課使用相同的逐步檢查機制。
const fullProgram=LESSONS[0].code;
const block=(color,text,extra='')=>`<div class="block ${color} ${extra}">${text}</div>`;
const slot=x=>`<span class="slot">${x}</span>`;
const nest=(color,inside)=>`<div class="nest ${color}-border">${inside}</div>`;
const fullLeds='basic.showLeds(`\n# # # # #\n# # # # #\n# # # # #\n# # # # #\n# # # # #\n`)';
const eventCode=body=>'let 開關 = 0\ninput.onSound(DetectedSound.Loud, function () {\n'+body+'\n})';
const testCondition=inside=>block('logic',`如果 ${slot('開關 = 0')} 那麼`)+nest('logic',inside||'　')+block('logic','否則')+nest('logic','　');
const GUIDE_STEPS=[
 {title:'準備好，找到工具箱',action:'右邊準備一個拍手燈練習區，先找到「輸入」。',paths:[],visual:'<div class="prep-flow"><div><b>1</b><p>等待右側編輯器載入</p></div><div><b>2</b><p>找到粉紅色「輸入」</p></div><div><b>3</b><p>這一課使用 micro:bit V2</p></div></div>',check:'我已看到右側的積木工具箱',hint:'兩課的作品分開保存。第一次是空白專案，再次進來會保留你的作品。'},
 {title:'先設定大聲門檻',action:'在「當啟動時」，將大聲門檻設為 180。',paths:[['basic','基本'],['input','輸入']],visual:block('basic','當啟動時','hat')+nest('basic',block('input',`設定 ${slot('大聲')} 門檻為 ${slot(180)}`,'new')),code:'input.setSoundThreshold(SoundThreshold.Loud, 180)',check:'門檻數字是 180，聲音種類是「大聲」',hint:'在「輸入」找聲音門檻積木；找不到時再展開「更多」。'},
 {title:'用「開關」記住亮或暗',action:'建立變數「開關」，在啟動時設為 0。',paths:[['variable','變數']],visual:block('basic','當啟動時','hat')+nest('basic',block('input',`設定 ${slot('大聲')} 門檻為 ${slot(180)}`)+block('variable',`變數 ${slot('開關')} 設為 ${slot(0)}`,'new')),code:'let 開關 = 0\ninput.setSoundThreshold(SoundThreshold.Loud, 180)\n開關 = 0',check:'變數名稱是「開關」，啟動時的值是 0',hint:'先按「建立一個變數」，名稱輸入「開關」，再拖出設定積木。'},
 {title:'聽到大聲音，才開始做',action:'從「輸入」拖出大聲事件，放在啟動積木旁邊。',paths:[['input','輸入']],visual:block('input',`當 ${slot('大聲')} 聲音發生`,'hat new')+nest('input','　'),code:'input.onSound(DetectedSound.Loud, function () {\n})',check:'我選的是「大聲」事件，沒有放進啟動積木裡',hint:'原始程式不是按 A，也不是使用重複無限次。'},
 {title:'判斷：現在是關著嗎？',action:'在大聲事件內，放入「如果 開關 = 0／否則」。',paths:[['logic','邏輯'],['variable','變數']],visual:block('input',`當 ${slot('大聲')} 聲音發生`,'hat')+nest('input',testCondition()),code:eventCode('    if (開關 == 0) {\n    } else {\n    }'),check:'我有「否則」，比較的是「開關 = 0」',hint:'把變數「開關」拖進比較積木左邊；需要「否則」時按齒輪或加號調整。'},
 {title:'原本關著 → 亮燈',action:'在「如果」裡顯示全亮，再把開關設為 1。',paths:[['basic','基本'],['variable','變數']],visual:testCondition(block('basic','顯示 LED<div class="leds25">'+Array(25).fill('<span></span>').join('')+'</div>','new')+block('variable',`變數 ${slot('開關')} 設為 ${slot(1)}`,'new')),code:eventCode('    if (開關 == 0) {\n'+fullLeds+'\n        開關 = 1\n    } else {\n    }'),check:'上半部有 25 格全亮，而且開關改成 1',hint:'顯示全亮後，一定要記得把開關改成 1。'},
 {title:'原本亮著 → 熄燈',action:'在「否則」裡清空畫面，再把開關設為 0。',paths:[['basic','基本'],['variable','變數']],visual:block('logic',`如果 ${slot('開關 = 0')} 那麼`)+nest('logic','<span style="color:#526958;font-size:12px">　全亮 → 開關設為 1</span>')+block('logic','否則')+nest('logic',block('basic','清空畫面','new')+block('variable',`變數 ${slot('開關')} 設為 ${slot(0)}`,'new')),code:eventCode('    if (開關 == 0) {\n'+fullLeds+'\n        開關 = 1\n    } else {\n        basic.clearScreen()\n        開關 = 0\n    }'),check:'下半部是清空畫面，而且開關改回 0',hint:'亮燈那邊設為 1，熄燈這邊設為 0，不要放反。'},
 {title:'拍一下亮，再拍一下暗',action:'在 MakeCode 模擬兩次大聲事件，觀察亮滅交替。',paths:[],visual:'<div class="prep-flow"><div><b>0</b><p>啟動：燈是暗的</p></div><div><b>1</b><p>第一次大聲事件 → 亮燈</p></div><div><b>0</b><p>第二次大聲事件 → 熄燈</p></div></div>',code:fullProgram,check:'第一次大聲事件會亮，第二次會暗',hint:'使用實體 V2 時，兩次拍手中間先停一下；其他大聲音也可能觸發。'}
];
