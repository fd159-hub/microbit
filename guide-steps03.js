const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "搖一搖才擲骰",
    "action": "找到輸入類別中的姿勢事件。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我知道搖晃會抽點數，A 只負責清空",
    "hint": "模擬器可用搖晃（Shake）控制；實體板輕輕搖動。",
    "visual": "<div class=\"prep-flow\"><div><b>搖晃</b><p>抽 1～6</p></div><div><b>A</b><p>清空畫面</p></div></div>"
  },
  {
    "title": "加入搖晃事件",
    "action": "新增「當搖晃」事件。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "姿勢下拉選單選的是搖晃",
    "hint": "不是按鈕 A，也不是重複無限次。",
    "visual": "<div class=\"block basic\">加入搖晃事件</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n\n})"
  },
  {
    "title": "抽 1～6，再顯示",
    "action": "把 1～6 的隨機取數放進「顯示數字」裡。",
    "paths": [
      [
        "math",
        "數學"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "顯示數字裡是隨機取數，下界 1、上界 6",
    "hint": "1 和 6 都可能抽到；同一個數字也可能連續出現。",
    "visual": "<div class=\"block basic\">抽 1～6，再顯示</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n    basic.showNumber(randint(1, 6))\n})"
  },
  {
    "title": "按 A，清空畫面",
    "action": "另外新增 A 事件，只接清空畫面。",
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
    "check": "A 事件裡是清空畫面，不是重新抽點數",
    "hint": "兩個事件分開放在工作區。",
    "visual": "<div class=\"block basic\">按 A，清空畫面</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    basic.clearScreen()\n})"
  },
  {
    "title": "試著擲幾次骰子",
    "action": "搖晃幾次看點數，最後按 A。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "點數在 1～6，按 A 後畫面空白",
    "hint": "抽到相同點數是正常的隨機結果。",
    "visual": "<div class=\"block basic\">試著擲幾次骰子</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    basic.clearScreen()\n})\ninput.onGesture(Gesture.Shake, function () {\n    basic.showNumber(randint(1, 6))\n})\n"
  }
];
