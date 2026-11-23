// 保留上課 HEX 內嵌原碼，逐字比對。
const LESSONS=[{"id":"lesson07","code":"input.onButtonPressed(Button.A, function () {\n    for (let index = 0; index <= 4; index++) {\n        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)\n        basic.showNumber(5 - index)\n    }\n    basic.clearScreen()\n    music.play(music.tonePlayable(392, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)\n    basic.showString(\"Go!\")\n})\n"}];
const FOUNDATION_LESSON={"id":"07","title":"倒數","buttons":[["A","按 A：倒數"]]};
