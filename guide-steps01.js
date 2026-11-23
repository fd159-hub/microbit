const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "先看看，愛心怎麼跳",
    "action": "在右側建立空白專案，找到「基本」類別。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "我已找到基本類別與積木工作區",
    "hint": "本課只用兩個圖示，順序會影響看到的動畫。",
    "visual": "<div class=\"prep-flow\"><div><b>♥</b><p>大愛心</p></div><div><b>♡</b><p>小愛心</p></div><div><b>↻</b><p>一直重複</p></div></div>"
  },
  {
    "title": "留下重複無限次",
    "action": "在工作區保留「重複無限次」，把圖示放進去。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "我找到重複無限次，知道積木要放在裡面",
    "hint": "「當啟動時」可留空；圖示要放在重複無限次。",
    "visual": "<div class=\"block basic\">留下重複無限次</div>",
    "code": "basic.forever(function () {\n\n})"
  },
  {
    "title": "先顯示大愛心",
    "action": "把「顯示圖示」放進重複無限次，選大愛心。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "圖示是大愛心，而且接在迴圈裡",
    "hint": "不要把顯示圖示放在迴圈外。",
    "visual": "<div class=\"block basic\">先顯示大愛心</div>",
    "code": "basic.forever(function () {\n    basic.showIcon(IconNames.Heart)\n})"
  },
  {
    "title": "下面接小愛心",
    "action": "在大愛心下面再接一個顯示圖示，選小愛心。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "上面大愛心，下面小愛心",
    "hint": "原程式沒有額外暫停；先照原圖組合。",
    "visual": "<div class=\"block basic\">下面接小愛心</div>",
    "code": "basic.forever(function () {\n    basic.showIcon(IconNames.Heart)\n    basic.showIcon(IconNames.SmallHeart)\n})\n"
  },
  {
    "title": "看它一直跳動",
    "action": "啟動右側模擬器，觀察大、小愛心不斷交替。",
    "paths": [
      [
        "basic",
        "基本"
      ]
    ],
    "check": "不用按按鈕，兩個愛心就會持續交替",
    "hint": "先分辨「做一次」和「一直做」的差別。",
    "visual": "<div class=\"block basic\">看它一直跳動</div>",
    "code": "basic.forever(function () {\n    basic.showIcon(IconNames.Heart)\n    basic.showIcon(IconNames.SmallHeart)\n})\n"
  }
];
