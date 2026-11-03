// 從上課 HEX 還原，原始程式不修改。
const LESSONS = [
  {
    "id": "lesson08",
    "code": "input.onSound(DetectedSound.Loud, function () {\n    if (開關 == 0) {\n        basic.showLeds(`\n            # # # # #\n            # # # # #\n            # # # # #\n            # # # # #\n            # # # # #\n            `)\n        開關 = 1\n    } else {\n        basic.clearScreen()\n        開關 = 0\n    }\n})\nlet 開關 = 0\ninput.setSoundThreshold(SoundThreshold.Loud, 180)\n開關 = 0\n"
  }
];
