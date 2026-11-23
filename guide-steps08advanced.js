const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "從兩種，升級成三種",
    "action": "先完成 L08 拍手燈，再在這一課新建專案。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我知道這課是小愛心 → 大愛心 → 熄燈",
    "hint": "這課獨立保存作品，不會覆蓋 L08。請用新專案依圖重做，別保留基礎版的切換事件。",
    "visual": "<div class=\"prep-flow\"><div><b>第1次</b><p>小愛心</p></div><div><b>第2次</b><p>大愛心</p></div><div><b>第3次</b><p>熄燈，再循環</p></div></div><p><a class=\"button\" href=\"lesson08.html\">先看 L08 基礎課 →</a></p>"
  },
  {
    "title": "建立兩個記錄變數",
    "action": "新增「觸發總次數」與「餘數」；開機初值都是 0。",
    "paths": [
      [
        "variable",
        "變數"
      ]
    ],
    "check": "兩個名稱正確，初值都是 0",
    "hint": "原專案的數字變數會以 0 初始化；不要沿用基礎課的開關變數。",
    "visual": "<div class=\"block basic\">建立兩個記錄變數</div>",
    "code": "let 觸發總次數 = 0\nlet 餘數 = 0",
    "snippetMode": false
  },
  {
    "title": "開機設定門檻與熄燈",
    "action": "在當啟動時設定大聲門檻 160，再清空畫面。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "門檻是 160，之後接清空畫面",
    "hint": "160 是相對音量門檻，不是分貝；原檔使用 V2 麥克風。",
    "visual": "<div class=\"block basic\">開機設定門檻與熄燈</div>",
    "code": "input.setSoundThreshold(SoundThreshold.Loud, 160)\nbasic.clearScreen()",
    "snippetMode": false
  },
  {
    "title": "每次大聲，總次數加 1",
    "action": "新增大聲事件，把觸發總次數改變 1。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "variable",
        "變數"
      ]
    ],
    "check": "使用改變 1，不是每次設成 1",
    "hint": "一次事件加一次；下方練習按鈕代表一次事件，並非實際聲音辨識。",
    "visual": "<div class=\"block basic\">每次大聲，總次數加 1</div>",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    觸發總次數 += 1\n})"
  },
  {
    "title": "除以 3，留下餘數",
    "action": "接著把餘數設為「觸發總次數 除以 3 的餘數」。",
    "paths": [
      [
        "variable",
        "變數"
      ],
      [
        "math",
        "數學"
      ]
    ],
    "check": "取的是餘數，不是一般除法；先加總次數再算餘數",
    "hint": "1、2、3、4、5、6 的餘數依序為 1、2、0、1、2、0。",
    "visual": "<div class=\"block basic\">除以 3，留下餘數</div>",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    觸發總次數 += 1\n    餘數 = 觸發總次數 % 3\n})"
  },
  {
    "title": "三個餘數，三種畫面",
    "action": "如果餘數 1：小愛心；否則如果 2：大愛心；否則如果 0：清空。",
    "paths": [
      [
        "logic",
        "邏輯"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "順序是 1 小愛心、2 大愛心、0 清空",
    "hint": "使用同一串如果／否則如果。請保留明確的餘數 = 0 判斷。",
    "visual": "<div class=\"block basic\">三個餘數，三種畫面</div>",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    if (餘數 == 1) { basic.showIcon(IconNames.SmallHeart) }\n    else if (餘數 == 2) { basic.showIcon(IconNames.Heart) }\n    else if (餘數 == 0) { basic.clearScreen() }\n})"
  },
  {
    "title": "判斷做完，停一秒",
    "action": "在整串條件判斷下面接暫停 1000 毫秒，仍放在大聲事件裡。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "1000 毫秒在條件判斷外面、事件裡面",
    "hint": "三種畫面都會走到最後這個暫停。原檔沒有把總次數歸零。",
    "visual": "<div class=\"block basic\">判斷做完，停一秒</div>",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    觸發總次數 += 1\n    餘數 = 觸發總次數 % 3\n    if (餘數 == 1) { basic.showIcon(IconNames.SmallHeart) }\n    else if (餘數 == 2) { basic.showIcon(IconNames.Heart) }\n    else if (餘數 == 0) { basic.clearScreen() }\n    basic.pause(1000)\n})"
  },
  {
    "title": "試六次，看兩輪循環",
    "action": "每次等事件完成，再觸發下一次大聲，觀察六次的畫面。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "六次依序是小、大、空白、小、大、空白",
    "hint": "實體聲音環境可能造成不同事件次數，先在模擬器逐次測試邏輯。",
    "visual": "<div class=\"block basic\">試六次，看兩輪循環</div>",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    // 1. 記錄觸發總次數\n    觸發總次數 += 1\n    // 2. 計算總次數除以 3 的餘數\n    餘數 = 觸發總次數 % 3\n    // 3. 根據餘數決定畫面\n    if (餘數 == 1) {\n        basic.showIcon(IconNames.SmallHeart)\n    } else if (餘數 == 2) {\n        basic.showIcon(IconNames.Heart)\n    } else if (餘數 == 0) {\n        basic.clearScreen()\n    }\n    basic.pause(1000)\n})\nlet 餘數 = 0\nlet 觸發總次數 = 0\ninput.setSoundThreshold(SoundThreshold.Loud, 160)\nbasic.clearScreen()\n"
  }
];
