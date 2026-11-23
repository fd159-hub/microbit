const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "先看倒數順序",
    "action": "本課按 A 才開始：5、4、3、2、1，最後 Go!。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "我知道最後是 1 接 Go!，沒有顯示 0",
    "hint": "聲音以拍長控制，原程式不是每秒倒數。",
    "visual": "<div class=\"prep-flow\"><div><b>A</b><p>開始</p></div><div><b>5→1</b><p>一輪一個數字</p></div><div><b>Go!</b><p>出發</p></div></div>"
  },
  {
    "title": "A 裡放索引迴圈",
    "action": "在 A 事件放索引迴圈，讓 index 從 0 到 4。",
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
    "check": "起點 0、終點 4，總共做五次",
    "hint": "迴圈上限包含 4，所以不是四次。",
    "visual": "<div class=\"block basic\">A 裡放索引迴圈</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n    }\n})"
  },
  {
    "title": "用 5 減 index",
    "action": "在迴圈裡顯示數字「5 − index」。",
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
    "check": "顯示的是 5 減 index，不是 index 或固定的 5",
    "hint": "index = 0、1、2、3、4，結果就是 5、4、3、2、1。",
    "visual": "<div class=\"block basic\">用 5 減 index</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n        basic.showNumber(5 - index)\n    }\n})"
  },
  {
    "title": "每個數字前，先播短音",
    "action": "在顯示數字上面插入播放單音：262 Hz、1/4 拍、直到結束。",
    "paths": [
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "短音在顯示數字前面，而且放在迴圈裡",
    "hint": "每一輪都先播短音再顯示數字；不要另外加一秒暫停。",
    "visual": "<div class=\"block basic\">每個數字前，先播短音</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)\n        basic.showNumber(5 - index)\n    }\n})"
  },
  {
    "title": "倒數結束，清空畫面",
    "action": "在索引迴圈下面、A 事件裡接清空畫面。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "清空畫面放在迴圈外面，倒數五次後才執行",
    "hint": "不要放進迴圈裡，否則每個數字後都會被清空。",
    "visual": "<div class=\"block basic\">倒數結束，清空畫面</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)\n        basic.showNumber(5 - index)\n    }\n    basic.clearScreen()\n})"
  },
  {
    "title": "長音搭配 Go!",
    "action": "清空後：392 Hz、1 拍、背景播放，再顯示文字 Go!。",
    "paths": [
      [
        "music-category",
        "音效"
      ],
      [
        "basic",
        "基本"
      ]
    ],
    "check": "最後音效是背景播放，文字是 Go!",
    "hint": "背景播放會讓程式繼續顯示 Go!，與迴圈內的直到結束不同。",
    "visual": "<div class=\"block basic\">長音搭配 Go!</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    music.play(music.tonePlayable(392, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)\n    basic.showString(\"Go!\")\n})"
  },
  {
    "title": "按 A，確認完整順序",
    "action": "在右側執行，依序觀察 5 到 1、清空、Go!。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "有五個數字與五個短音，最後長音搭配 Go!",
    "hint": "原檔的數字顯示及播放本身會花時間；不把它當成精準秒表。",
    "visual": "<div class=\"block basic\">按 A，確認完整順序</div>",
    "code": "input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)\n        basic.showNumber(5 - index)\n    }\n    basic.clearScreen()\n    music.play(music.tonePlayable(392, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)\n    basic.showString(\"Go!\")\n})\n"
  }
];
