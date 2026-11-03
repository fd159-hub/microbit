// 依提供的 HEX 還原；原始 main.ts 保持不變。
const LESSONS = [
  {
    "id": "lesson09",
    "name": "09 吹走",
    "intro": "這節課用 micro:bit V2 的音量感測、隨機座標與條件判斷，讓亮點像被風吹走一樣向上移動。教材依「microbit-09吹走.hex」中的原始程式製作。",
    "steps": [
      "開機時畫面是空白。按 A，讓 25 顆 LED 全部亮起；原始程式沒有 B 按鈕功能。",
      "比較音量 180 與 181：只有音量大於 180，才進行後續的隨機座標操作。",
      "x 與 y 分別隨機取 0～4。若該座標沒有亮點，就不做任何事。",
      "若該點亮著，先熄滅 (x, y)，再點亮 (x, y − 1)，表示向上移動一格。",
      "最上排 y = 0 時，下一格是 −1，超出點陣範圍不會點亮，因此亮點消失。",
      "forever 會不斷重複；每輪 for 迴圈做 4 次判斷，並不是吹一次就固定移動 4 顆。"
    ],
    "challenge": "先記錄音量 180 與 181 的差別。再思考：亮點移到已亮的位置時，亮點總數會增加、相同，還是減少？最後在 MakeCode 複製專案，嘗試修改音量門檻，保留上課原檔。",
    "hint": "先按 A 點亮全部 LED，再調整模擬音量。用「執行一輪」觀察 4 次判斷，或開始慢速連續觀察。",
    "code": "let x = 0\nlet y = 0\ninput.onButtonPressed(Button.A, function () {\n    basic.showLeds(`\n        # # # # #\n        # # # # #\n        # # # # #\n        # # # # #\n        # # # # #\n        `)\n})\nbasic.forever(function () {\n    for (let index = 0; index < 4; index++) {\n        if (input.soundLevel() > 180) {\n            x = randint(0, 4)\n            y = randint(0, 4)\n            if (led.point(x, y)) {\n                led.unplot(x, y)\n                led.plot(x, y - 1)\n            }\n        }\n    }\n})\n",
    "questions": [
      {
        "question": "音量剛好是 180，程式會移動亮點嗎？",
        "answers": [
          "會，因為達到 180",
          "不會，必須大於 180"
        ],
        "correct": 1,
        "explanation": "原始條件是 soundLevel() > 180，不包含等於。"
      },
      {
        "question": "亮點在 (2, 3)，執行後會往哪裡移動？",
        "answers": [
          "(2, 2)，往上",
          "(2, 4)，往下",
          "(1, 3)，往左"
        ],
        "correct": 0,
        "explanation": "x 不變，y 減 1，所以向上移動到 (2, 2)。"
      },
      {
        "question": "隨機選到的位置沒有亮點時會怎樣？",
        "answers": [
          "自動產生新亮點",
          "重新點亮全部 LED",
          "略過這次，不改變畫面"
        ],
        "correct": 2,
        "explanation": "只有 led.point(x, y) 為真，才會執行熄滅與點亮。"
      },
      {
        "question": "為什麼最上排的亮點會消失？",
        "answers": [
          "y − 1 變成 −1，超出顯示範圍",
          "音量變成 0",
          "按了 B 按鈕"
        ],
        "correct": 0,
        "explanation": "先熄滅原點後，範圍外的 plot 不會點亮任何 LED。"
      }
    ]
  }
];
