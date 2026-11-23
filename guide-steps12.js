const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "從 L11 的羅盤接著做",
    "action": "按下方「載入 L11 基礎積木」，或在右側匯入你保存的 L11 作品。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "右側已有 L11：兩個變數、A 事件與羅盤迴圈",
    "hint": "載入會另建基礎專案；此課與 L11 的作品分開保存。先等右側編輯器完成載入。",
    "visual": "<div class=\"prep-flow\"><div><b>保留 L11</b><p>A → 電子羅盤</p></div><div><b>新增 L12</b><p>B → 尋寶<br>Logo → 計分</p></div></div><button id=\"loadFoundation\" class=\"button primary\" type=\"button\">載入 L11 基礎積木</button><p id=\"foundationStatus\" role=\"status\"></p>"
  },
  {
    "title": "增加出現、分數、寶物",
    "action": "新增三個變數；在原本啟動積木下面，把出現與分數都設為 0。",
    "paths": [
      [
        "variable",
        "變數"
      ]
    ],
    "check": "模式、方位、出現、分數在啟動時都是 0；也已新增寶物",
    "hint": "寶物稍後由 B 按鈕抽籤決定。請保留原來的 A 事件和羅盤迴圈。",
    "visual": "<div class=\"block basic\">增加出現、分數、寶物</div>",
    "code": "模式 = 0\n方位 = 0\n出現 = 0\n分數 = 0",
    "snippetMode": false
  },
  {
    "title": "按 B，開始抓寶",
    "action": "新增 B 事件：模式設為 2，寶物設為 0～360 的隨機整數。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "variable",
        "變數"
      ],
      [
        "math",
        "數學"
      ]
    ],
    "check": "B 先切模式 2，再抽 0～360；沒有把分數歸零",
    "hint": "寶物存的是方向角度。這個遊戲靠轉動朝向找寶，不需要移動位置。",
    "visual": "<div class=\"block basic\">按 B，開始抓寶</div>",
    "code": "input.onButtonPressed(Button.B, function () {\n    模式 = 2\n    寶物 = randint(0, 360)\n})"
  },
  {
    "title": "另外新增一個無限迴圈",
    "action": "再拉一個「重複無限次」，裡面先放「如果模式 = 2」。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "logic",
        "邏輯"
      ]
    ],
    "check": "畫面上有兩個重複無限次：模式 1 羅盤、模式 2 抓寶",
    "hint": "不要把 L11 的模式 1 改成 2；兩段功能要一起保留。",
    "visual": "<div class=\"block basic\">另外新增一個無限迴圈</div>",
    "code": "basic.forever(function () {\n    if (模式 == 2) {\n    }\n})"
  },
  {
    "title": "算一算，離寶物差幾度",
    "action": "在模式 2 裡再放「如果」：方位感測值（°）減寶物，取絕對值，再判斷 < 20。",
    "paths": [
      [
        "logic",
        "邏輯"
      ],
      [
        "math",
        "數學"
      ],
      [
        "input",
        "輸入"
      ]
    ],
    "check": "順序是「方向 − 寶物」→「絕對值」→「< 20」",
    "hint": "例如寶物 90°：朝向 109° 差 19，找到；朝向 110° 差 20，還沒找到。",
    "visual": "<div class=\"block basic\">算一算，離寶物差幾度</div>",
    "code": "basic.forever(function () {\n    if (模式 == 2) {\n        if (Math.abs(input.compassHeading() - 寶物) < 20) {\n        }\n    }\n})"
  },
  {
    "title": "找到顯示笑臉，否則繼續找",
    "action": "成立：出現設 1、顯示笑臉。否則：出現設 0、棋盤格、暫停 100 毫秒、菱形。",
    "paths": [
      [
        "logic",
        "邏輯"
      ],
      [
        "variable",
        "變數"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "兩個分支都有設定出現；100 毫秒放在棋盤格與菱形之間",
    "hint": "出現 = 1 表示可以抓寶；出現 = 0 表示還沒對準。",
    "visual": "<div class=\"block basic\">找到顯示笑臉，否則繼續找</div>",
    "code": "basic.forever(function () {\n    if (模式 == 2) {\n        if (Math.abs(input.compassHeading() - 寶物) < 20) {\n            出現 = 1\n            basic.showIcon(IconNames.Happy)\n        } else {\n            出現 = 0\n            basic.showIcon(IconNames.Chessboard)\n            basic.pause(100)\n            basic.showIcon(IconNames.Diamond)\n        }\n    }\n})\n"
  },
  {
    "title": "碰 Logo，先確認能不能抓",
    "action": "新增 Logo 事件（選項照圖），裡面放「如果出現 = 1」。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "logic",
        "邏輯"
      ]
    ],
    "check": "Logo 選項照左圖；裡面有「如果出現 = 1」",
    "hint": "本課原檔是 Touched 事件，和 L10 的 Pressed 不同；請用 micro:bit V2。",
    "visual": "<div class=\"block basic\">碰 Logo，先確認能不能抓</div>",
    "code": "input.onLogoEvent(TouchButtonEvent.Touched, function () {\n    if (出現 == 1) {\n    }\n})"
  },
  {
    "title": "抓到後，換下一個寶物",
    "action": "在條件裡依序：出現設 0 → 寶物重新隨機 → 顯示打勾。",
    "paths": [
      [
        "variable",
        "變數"
      ],
      [
        "basic",
        "基本"
      ],
      [
        "math",
        "數學"
      ]
    ],
    "check": "先把出現清為 0，再抽下一個寶物方向",
    "hint": "這裡還不會加分，下一步接在打勾圖示下面。",
    "visual": "<div class=\"block basic\">抓到後，換下一個寶物</div>",
    "code": "input.onLogoEvent(TouchButtonEvent.Touched, function () {\n    if (出現 == 1) {\n        出現 = 0\n        寶物 = randint(0, 360)\n        basic.showIcon(IconNames.Yes)\n    }\n})"
  },
  {
    "title": "分數加 1，再顯示分數",
    "action": "接在打勾圖示下面：分數改變 1，顯示數字分數。",
    "paths": [
      [
        "variable",
        "變數"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "使用「分數改變 1」，不是每次設為 1",
    "hint": "整段都要放在「如果出現 = 1」裡；沒找到時碰 Logo 不加分。",
    "visual": "<div class=\"block basic\">分數加 1，再顯示分數</div>",
    "code": "input.onLogoEvent(TouchButtonEvent.Touched, function () {\n    if (出現 == 1) {\n        出現 = 0\n        寶物 = randint(0, 360)\n        basic.showIcon(IconNames.Yes)\n        分數 += 1\n        basic.showNumber(分數)\n    }\n})"
  },
  {
    "title": "試玩兩種模式",
    "action": "按 A 看羅盤；按 B 轉動找笑臉，再碰 Logo 抓寶。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "羅盤、抓寶、加分都測過；按 B 不會清掉累積分數",
    "hint": "保留原程式的絕對值算法：359° 與 0° 不會算成只差 1°。完整程式可看大圖或展開教師備註。",
    "visual": "<div class=\"block basic\">試玩兩種模式</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    模式 = 1\n})\ninput.onButtonPressed(Button.B, function () {\n    模式 = 2\n    寶物 = randint(0, 360)\n})\ninput.onLogoEvent(TouchButtonEvent.Touched, function () {\n    if (出現 == 1) {\n        出現 = 0\n        寶物 = randint(0, 360)\n        basic.showIcon(IconNames.Yes)\n        分數 += 1\n        basic.showNumber(分數)\n    }\n})\nlet 寶物 = 0\nlet 分數 = 0\nlet 出現 = 0\nlet 模式 = 0\n模式 = 0\nlet 方位 = 0\n出現 = 0\n分數 = 0\nbasic.forever(function () {\n    if (模式 == 1) {\n        方位 = input.compassHeading()\n        if (方位 >= 85 && 方位 <= 95) {\n            basic.showString(\"E\")\n        } else if (方位 >= 175 && 方位 <= 185) {\n            basic.showString(\"S\")\n        } else if (方位 >= 265 && 方位 <= 275) {\n            basic.showString(\"W\")\n        } else if (方位 >= 355 || 方位 <= 5) {\n            basic.showString(\"N\")\n        } else {\n            basic.clearScreen()\n        }\n    }\n})\nbasic.forever(function () {\n    if (模式 == 2) {\n        if (Math.abs(input.compassHeading() - 寶物) < 20) {\n            出現 = 1\n            basic.showIcon(IconNames.Happy)\n        } else {\n            出現 = 0\n            basic.showIcon(IconNames.Chessboard)\n            basic.pause(100)\n            basic.showIcon(IconNames.Diamond)\n        }\n    }\n})\n"
  }
];
