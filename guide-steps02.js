const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "三種按法，三種心情",
    "action": "找到「輸入」裡的按鈕事件。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我知道 A、B、A+B 是三個不同事件",
    "hint": "A+B 是同時按兩顆按鈕。",
    "visual": "<div class=\"prep-flow\"><div><b>A</b><p>愛心跳四次</p></div><div><b>B</b><p>難過一秒</p></div><div><b>A+B</b><p>Hello!</p></div></div>"
  },
  {
    "title": "按 A，重複四次",
    "action": "新增 A 事件，在裡面放「重複 4 次」。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "loop",
        "迴圈"
      ]
    ],
    "check": "事件選 A，重複次數是 4",
    "hint": "這裡用固定次數，不是重複無限次。",
    "visual": "<div class=\"block basic\">按 A，重複四次</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index < 4; index++) {\n\n    }\n})"
  },
  {
    "title": "每次一大、一小",
    "action": "在重複裡依序接大愛心、小愛心。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "兩個圖示都在重複 4 次裡面，先大後小",
    "hint": "每輪有兩張圖，總共會顯示八張圖。",
    "visual": "<div class=\"block basic\">每次一大、一小</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index < 4; index++) {\n        basic.showIcon(IconNames.Heart)\n        basic.showIcon(IconNames.SmallHeart)\n    }\n})"
  },
  {
    "title": "四次做完，才清空",
    "action": "在重複 4 次的外面、A 事件裡，接「清空畫面」。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "清空畫面接在重複積木下面，沒有放進重複裡",
    "hint": "放的位置決定什麼時候清空。",
    "visual": "<div class=\"block basic\">四次做完，才清空</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index < 4; index++) {\n        basic.showIcon(IconNames.Heart)\n        basic.showIcon(IconNames.SmallHeart)\n    }\n    basic.clearScreen()\n})"
  },
  {
    "title": "按 B，難過一秒",
    "action": "新增 B 事件：難過圖示 → 暫停 1000 毫秒 → 清空畫面。",
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
    "check": "B 的三塊積木順序正確，暫停是 1000",
    "hint": "1000 毫秒就是 1 秒。",
    "visual": "<div class=\"block basic\">按 B，難過一秒</div>",
    "code": "input.onButtonPressed(Button.B, function () {\n    basic.showIcon(IconNames.Sad)\n    basic.pause(1000)\n    basic.clearScreen()\n})"
  },
  {
    "title": "A+B，說 Hello!",
    "action": "新增 A+B 事件，顯示文字 Hello!。",
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
    "check": "事件選 A+B，文字包含大寫 H 與驚嘆號",
    "hint": "文字積木與顯示數字不同；請保留 Hello! 原文。",
    "visual": "<div class=\"block basic\">A+B，說 Hello!</div>",
    "code": "input.onButtonPressed(Button.AB, function () {\n    basic.showString(\"Hello!\")\n})"
  },
  {
    "title": "分別試三種按法",
    "action": "在右側模擬器分別測試 A、B、A+B。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "A 跳四輪後清空，B 難過後清空，A+B 顯示 Hello!",
    "hint": "實體板 A+B 要同時按；不要把兩個分開的事件當作 A+B。",
    "visual": "<div class=\"block basic\">分別試三種按法</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index < 4; index++) {\n        basic.showIcon(IconNames.Heart)\n        basic.showIcon(IconNames.SmallHeart)\n    }\n    basic.clearScreen()\n})\ninput.onButtonPressed(Button.AB, function () {\n    basic.showString(\"Hello!\")\n})\ninput.onButtonPressed(Button.B, function () {\n    basic.showIcon(IconNames.Sad)\n    basic.pause(1000)\n    basic.clearScreen()\n})\n"
  }
];
