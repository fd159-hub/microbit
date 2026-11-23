// 保留上課 HEX 內嵌原碼，逐字比對。
const LESSONS=[{"id":"lesson05","code":"input.onButtonPressed(Button.A, function () {\n    radio.sendString(\"YES\")\n})\nradio.onReceivedString(function (receivedString) {\n    basic.showString(receivedString)\n})\ninput.onButtonPressed(Button.B, function () {\n    radio.sendString(\"NO\")\n})\nradio.setGroup(108)\n"}];
const FOUNDATION_LESSON={"id":"05","title":"悄悄話","buttons":[["A","A：送 YES"],["B","B：送 NO"],["receiveYES","另一台傳來 YES"],["receiveNO","另一台傳來 NO"]]};
