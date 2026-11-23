const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "兩台板子，一送一收",
    "action": "準備兩台 micro:bit，都載入本課同一份程式。",
    "paths": [
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "我知道兩台都要有程式，而且群組要相同",
    "hint": "同群組可能有多台一起收到；「悄悄話」是課程名稱，不是加密私訊。",
    "visual": "<div class=\"prep-flow\"><div><b>甲</b><p>按 A 或 B 傳送</p></div><div><b>108</b><p>兩台使用同一群組</p></div><div><b>乙</b><p>顯示收到的文字</p></div></div>"
  },
  {
    "title": "啟動時，群組設 108",
    "action": "在當啟動時接「廣播設定群組」，填 108。",
    "paths": [
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "群組是 108，放在當啟動時",
    "hint": "兩台都設成 108。本課沿用上課原檔，不改群組編號。",
    "visual": "<div class=\"block basic\">啟動時，群組設 108</div>",
    "code": "radio.setGroup(108)",
    "snippetMode": false
  },
  {
    "title": "按 A，送出 YES",
    "action": "新增 A 事件，廣播傳送文字 YES。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "A 事件傳送的是文字 YES，都是大寫",
    "hint": "送出文字不等於在自己的畫面顯示文字。",
    "visual": "<div class=\"block basic\">按 A，送出 YES</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    radio.sendString(\"YES\")\n})"
  },
  {
    "title": "按 B，送出 NO",
    "action": "新增 B 事件，廣播傳送文字 NO。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "B 事件傳送 NO，沒有改到 A 的 YES",
    "hint": "兩個事件都用傳送文字，不是傳送數字。",
    "visual": "<div class=\"block basic\">按 B，送出 NO</div>",
    "code": "input.onButtonPressed(Button.B, function () {\n    radio.sendString(\"NO\")\n})"
  },
  {
    "title": "新增接收文字事件",
    "action": "在廣播類別找到「當收到文字」事件。",
    "paths": [
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "選的是收到文字，事件裡帶 receivedString",
    "hint": "receivedString 保存這次收到的內容。",
    "visual": "<div class=\"block basic\">新增接收文字事件</div>",
    "code": "radio.onReceivedString(function (receivedString) {\n})"
  },
  {
    "title": "顯示收到的內容",
    "action": "把事件裡的 receivedString 拖進「顯示文字」。",
    "paths": [
      [
        "radio-category",
        "廣播"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "顯示文字使用 receivedString，不是自己打 YES",
    "hint": "這樣收到 YES 就顯示 YES，收到 NO 就顯示 NO。",
    "visual": "<div class=\"block basic\">顯示收到的內容</div>",
    "code": "radio.onReceivedString(function (receivedString) {\n    basic.showString(receivedString)\n})"
  },
  {
    "title": "交換傳送與接收",
    "action": "甲按 A，乙看 YES；甲按 B，乙看 NO，再交換角色。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "radio-category",
        "廣播"
      ]
    ],
    "check": "兩台都能傳送與接收；兩邊群組都是 108",
    "hint": "下方小實驗把送出與收到分開示範；實體無線收訊仍需兩塊板子驗證。",
    "visual": "<div class=\"block basic\">交換傳送與接收</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    radio.sendString(\"YES\")\n})\nradio.onReceivedString(function (receivedString) {\n    basic.showString(receivedString)\n})\ninput.onButtonPressed(Button.B, function () {\n    radio.sendString(\"NO\")\n})\nradio.setGroup(108)\n"
  }
];
