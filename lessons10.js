// 原始 HEX 內嵌程式，保持不變。
const LESSONS = [
  {
    "id": "lesson10",
    "code": "input.onButtonPressed(Button.A, function () {\n    datalogger.log(datalogger.createCV(\"Boy\", 1))\n    basic.showIcon(IconNames.Sword)\n})\ninput.onLogoEvent(TouchButtonEvent.Pressed, function () {\n    datalogger.log(datalogger.createCV(\"Teacher\", 1))\n    basic.showIcon(IconNames.Happy)\n})\ninput.onButtonPressed(Button.AB, function () {\n    datalogger.deleteLog()\n    basic.showIcon(IconNames.Skull)\n})\ninput.onButtonPressed(Button.B, function () {\n    datalogger.log(datalogger.createCV(\"Girl\", 1))\n    basic.showIcon(IconNames.SmallHeart)\n})\ndatalogger.setColumnTitles(\n\"Boy\",\n\"Girl\",\n\"Teacher\"\n)\n"
  }
];
