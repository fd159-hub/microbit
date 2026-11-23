const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "找出 P0 與 GND",
    "action": "看板子下緣：找到 0（P0）與 GND。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我能分辨 P0 與 GND 的位置",
    "hint": "實體一手接觸 GND，另一手觸碰 P0 後在 1 秒內放開。模擬器直接點 P0。",
    "visual": "<div class=\"prep-flow\"><div><b>P0</b><p>板子下緣的 0</p></div><div><b>GND</b><p>另一手接觸此處</p></div><div><b>→</b><p>觸碰 P0，抽一個數字</p></div></div>"
  },
  {
    "title": "新增 P0 觸碰事件",
    "action": "在輸入找到引腳事件，下拉選 P0。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "事件的引腳是 P0",
    "hint": "P0 是板子的觸碰引腳，不是按鈕 A。",
    "visual": "<div class=\"block basic\">新增 P0 觸碰事件</div>",
    "code": "input.onPinPressed(TouchPin.P0, function () {\n})"
  },
  {
    "title": "顯示 0～100 的隨機數",
    "action": "在事件裡放顯示數字，裡面接隨機取數 0～100。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "math",
        "數學"
      ]
    ],
    "check": "範圍是 0～100，隨機積木嵌在顯示數字裡",
    "hint": "0 和 100 都可能出現。較長的數字會捲動顯示。",
    "visual": "<div class=\"block basic\">顯示 0～100 的隨機數</div>",
    "code": "input.onPinPressed(TouchPin.P0, function () {\n    basic.showNumber(randint(0, 100))\n})\n"
  },
  {
    "title": "試試觸碰 P0",
    "action": "在右側模擬器點 P0，觀察不同數字。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "觸碰 P0 後會出現 0～100 的數字",
    "hint": "網頁的練習按鈕只示範邏輯，實體觸碰仍要用板子測試。",
    "visual": "<div class=\"block basic\">試試觸碰 P0</div>",
    "code": "input.onPinPressed(TouchPin.P0, function () {\n    basic.showNumber(randint(0, 100))\n})\n"
  }
];
