const fullProgram=LESSONS[0].code;
const GUIDE_STEPS=[
  {
    "title": "先認識小寵物",
    "action": "準備 micro:bit V2，找到搖晃事件、Logo 事件與音效類別。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "我知道搖晃會難過，Logo 會開心",
    "hint": "實體音效與 Logo 需要 V2；本課小實驗只顯示動作順序，不播放聲音。",
    "visual": "<div class=\"prep-flow\"><div><b>開機</b><p>睡著＋打呵欠</p></div><div><b>搖晃</b><p>難過，再睡著</p></div><div><b>Logo</b><p>開心，再睡著</p></div></div>"
  },
  {
    "title": "開機先睡覺",
    "action": "當啟動時：顯示睡著，再播放 yawn 音效直到結束。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "睡著圖示在前，yawn 音效在後，播放模式照圖",
    "hint": "yawn 是打呵欠；直到結束表示播完才做下一件事。",
    "visual": "<div class=\"block basic\">開機先睡覺</div>",
    "code": "basic.showIcon(IconNames.Asleep)\nmusic.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)",
    "snippetMode": false
  },
  {
    "title": "搖晃時，顯示難過",
    "action": "新增搖晃事件，顯示難過圖示。",
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
    "check": "搖晃事件裡是難過圖示",
    "hint": "先完成表情，再加入聲音。",
    "visual": "<div class=\"block basic\">搖晃時，顯示難過</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n    basic.showIcon(IconNames.Sad)\n})"
  },
  {
    "title": "難過也有聲音",
    "action": "接在難過圖示下面，播放 sad 音效直到結束。",
    "paths": [
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "音效選 sad，模式選播完才繼續",
    "hint": "請用音效積木，不是自行新增一個單音。",
    "visual": "<div class=\"block basic\">難過也有聲音</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n    basic.showIcon(IconNames.Sad)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)\n})"
  },
  {
    "title": "等兩秒，再回去睡",
    "action": "接著暫停 2000 毫秒，再顯示睡著、播放 yawn 直到結束。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "2000 在難過音效後，最後是睡著＋yawn",
    "hint": "等待從難過音效播完之後開始算。",
    "visual": "<div class=\"block basic\">等兩秒，再回去睡</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n    basic.showIcon(IconNames.Sad)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)\n    basic.pause(2000)\n    basic.showIcon(IconNames.Asleep)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)\n})"
  },
  {
    "title": "Logo 讓寵物開心",
    "action": "新增 Logo 事件（選項照圖），顯示開心、播放 happy 直到結束。",
    "paths": [
      [
        "input",
        "輸入"
      ],
      [
        "basic",
        "基本"
      ],
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "Logo 選項照圖，開心圖示搭配 happy 音效",
    "hint": "原檔事件是 Pressed；請依左圖選項，和 L12 的 Touched 不同。",
    "visual": "<div class=\"block basic\">Logo 讓寵物開心</div>",
    "code": "input.onLogoEvent(TouchButtonEvent.Pressed, function () {\n    basic.showIcon(IconNames.Happy)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)\n})"
  },
  {
    "title": "開心後，也回去睡",
    "action": "在 happy 後面接 2000 毫秒、睡著、yawn 直到結束。",
    "paths": [
      [
        "basic",
        "基本"
      ],
      [
        "music-category",
        "音效"
      ]
    ],
    "check": "Logo 的後半段也會等兩秒、再睡著",
    "hint": "兩個事件各自有自己的等待與睡覺流程。",
    "visual": "<div class=\"block basic\">開心後，也回去睡</div>",
    "code": "input.onLogoEvent(TouchButtonEvent.Pressed, function () {\n    basic.showIcon(IconNames.Happy)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)\n    basic.pause(2000)\n    basic.showIcon(IconNames.Asleep)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)\n})"
  },
  {
    "title": "輪流試兩種互動",
    "action": "先等開機音效播完，再分別測搖晃與 Logo。",
    "paths": [
      [
        "input",
        "輸入"
      ]
    ],
    "check": "兩種互動都有表情與音效，最後回到睡著",
    "hint": "先一次測一種事件，等流程完成再測下一個。實體音量與觸碰需用 V2 驗收。",
    "visual": "<div class=\"block basic\">輪流試兩種互動</div>",
    "code": "input.onGesture(Gesture.Shake, function () {\n    basic.showIcon(IconNames.Sad)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)\n    basic.pause(2000)\n    basic.showIcon(IconNames.Asleep)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)\n})\ninput.onLogoEvent(TouchButtonEvent.Pressed, function () {\n    basic.showIcon(IconNames.Happy)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)\n    basic.pause(2000)\n    basic.showIcon(IconNames.Asleep)\n    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)\n})\nbasic.showIcon(IconNames.Asleep)\nmusic.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.UntilDone)\n"
  }
];
