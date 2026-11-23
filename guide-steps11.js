const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "先認識四個方向",
    "action": "平放板子，讓上緣朝向要測量的方向。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我知道北 0°、東 90°、南 180°、西 270°",
    "hint": "實體第一次使用會要求校正：依畫面傾斜板子填滿燈點，並遠離金屬。模擬器可轉動羅盤指針。",
    "visual": "<div class=\"prep-flow\"><div><b>N · 0°</b><p>北方</p></div><div><b>E · 90°</b><p>東方</p></div><div><b>S · 180°</b><p>南方</p></div><div><b>W · 270°</b><p>西方</p></div></div>"
  },
  {
    "title": "建立模式與方位",
    "action": "新增「模式」「方位」兩個變數，啟動時都設為 0。",
    "paths": [
      [
        "variable",
        "變數"
      ]
    ],
    "check": "兩個變數名稱正確，啟動值都是 0",
    "hint": "模式 0 表示等待，按 A 才會進入電子羅盤。",
    "visual": "<div class=\"block basic\">建立模式與方位</div>",
    "code": "模式 = 0\n方位 = 0",
    "snippetMode": false
  },
  {
    "title": "按 A，切換到羅盤",
    "action": "加入 A 事件，把模式設為 1。",
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
    "check": "A 事件裡只有「模式設為 1」",
    "hint": "這個事件稍後也要保留到 L12。",
    "visual": "<div class=\"block basic\">按 A，切換到羅盤</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    模式 = 1\n})"
  },
  {
    "title": "一直讀取朝向",
    "action": "重複無限次：如果模式 = 1，就把方位設為「指南針方向」。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "logic",
        "邏輯"
      ],
      [
        "input",
        "輸入"
      ]
    ],
    "check": "讀取方位的積木放在「如果模式 = 1」裡",
    "hint": "指南針回傳 0～359 度；變數「方位」保存這次讀到的角度。",
    "visual": "<div class=\"block basic\">一直讀取朝向</div>",
    "code": "basic.forever(function () {\n    if (模式 == 1) {\n        方位 = input.compassHeading()\n    }\n})"
  },
  {
    "title": "東方：兩個條件都成立",
    "action": "接在讀取方位下面：如果方位 ≥ 85「且」方位 ≤ 95，顯示 E。",
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
    "check": "85、95 都包含在內，中間用「且」",
    "hint": "「且」表示兩個條件要同時成立。先完成這一個方向。",
    "visual": "<div class=\"block basic\">東方：兩個條件都成立</div>",
    "code": "basic.forever(function () {\n    if (模式 == 1) {\n        方位 = input.compassHeading()\n        if (方位 >= 85 && 方位 <= 95) {\n            basic.showString(\"E\")\n        }\n    }\n})"
  },
  {
    "title": "再加南方與西方",
    "action": "按齒輪增加「否則如果」：南方 175～185 顯示 S；西方 265～275 顯示 W。",
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
    "check": "南方和西方各用「且」，顯示字母分別是 S、W",
    "hint": "三組判斷要在同一串「如果／否則如果」裡。",
    "visual": "<div class=\"block basic\">再加南方與西方</div>",
    "code": "basic.forever(function () {\n    if (模式 == 1) {\n        方位 = input.compassHeading()\n        if (方位 >= 85 && 方位 <= 95) { basic.showString(\"E\") }\n        else if (方位 >= 175 && 方位 <= 185) { basic.showString(\"S\") }\n        else if (方位 >= 265 && 方位 <= 275) { basic.showString(\"W\") }\n    }\n})"
  },
  {
    "title": "北方跨過 0°，改用「或」",
    "action": "再加北方：方位 ≥ 355「或」方位 ≤ 5，顯示 N；最後「否則」清空畫面。",
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
    "check": "北方用「或」；最下面的否則接「清空畫面」",
    "hint": "接在西方後面的「否則如果」，保留前面三個方向。北方跨過 0°，必須用「或」。",
    "visual": "<div class=\"block basic\">北方跨過 0°，改用「或」</div>",
    "code": "if (方位 >= 355 || 方位 <= 5) {\n    basic.showString(\"N\")\n} else {\n    basic.clearScreen()\n}"
  },
  {
    "title": "測試完成，準備接 L12",
    "action": "按 A，試 90°、180°、270°、0°，再試 45°。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "四個正方向有字母，45° 空白；我已保存作品",
    "hint": "L12 保留這套羅盤，再加 B 抓寶與 Logo 計分。可在下一課載入相同的 L11 基礎積木。",
    "visual": "<div class=\"block basic\">測試完成，準備接 L12</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    模式 = 1\n})\nlet 模式 = 0\n模式 = 0\nlet 方位 = 0\nbasic.forever(function () {\n    if (模式 == 1) {\n        方位 = input.compassHeading()\n        if (方位 >= 85 && 方位 <= 95) {\n            basic.showString(\"E\")\n        } else if (方位 >= 175 && 方位 <= 185) {\n            basic.showString(\"S\")\n        } else if (方位 >= 265 && 方位 <= 275) {\n            basic.showString(\"W\")\n        } else if (方位 >= 355 || 方位 <= 5) {\n            basic.showString(\"N\")\n        } else {\n            basic.clearScreen()\n        }\n    }\n})\n"
  }
];
