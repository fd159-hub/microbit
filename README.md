# micro:bit 互動教室

繁體中文的國小高年級 MakeCode 圖解教學網站。由課程封面選擇教材，左邊看積木圖，右邊跟著做。

網站：https://fd159-hub.github.io/microbit/

## 課程

- **08 拍手燈**：大聲事件、開關變數、如果／否則。一次事件亮燈，再一次事件熄燈。
- **09 吹走**：音量、隨機座標、LED 點陣。亮點向上移動。

兩課均有八個圖解步驟。檢查並打勾後才能前進；無法從上方進度列跳過檢查。可返回查看，取消先前勾選會重新鎖定後續步驟。

## 學生操作

1. 選課，等待右側 MakeCode 載入。
2. 看左側指令與積木圖，在右側工具箱組合。
3. 檢查這一步、打勾，按「下一步」。
4. 換人前按「清除使用痕跡」，清除本站兩課進度、小實驗與內嵌 MakeCode 練習專案。

右側若被瀏覽器或校園網路限制，可另開 MakeCode 並排操作；另開視窗的專案是獨立的，不會自動同步或被本站清除。

## 儲存與使用限制

- 不用登入，不收集姓名、座號或成績；檢查勾選代表學生自我確認，不是自動評分。
- 進度與兩課的練習作品分別保存在目前瀏覽器 localStorage，沒有跨裝置同步。
- 一鍵清除只處理本站資料，不會清除瀏覽器歷史、已下載檔案或官方 MakeCode 網站內的其他專案。同站的新版分頁會同步重設。
- 實體操作需 micro:bit V2，兩課均使用內建麥克風。程式判斷聲音大小，不是拍手或吹氣辨識器。
- 小實驗是概念練習，不會執行右側學生程式，也不代表實機速度或事件觸發次數。
- MakeCode 需要網路；官方積木圖已隨網站保存。

## 維護與預覽

- 封面：index.html、cover.css。
- 課程頁：lesson08.html、lesson09.html。
- 教學步驟：guide-steps08.js、guide-steps.js。
- 操作邏輯：guided.js；小實驗：sim08.js、sim09.js。
- 上課原始程式資料：lessons08.js、lessons.js。
- 積木圖片：assets/08/ 與 assets/。修改片段時需同步重製積木圖。
- 使用 Node.js 執行 node preview.cjs，開啟 http://127.0.0.1:4173/ 。不需安裝套件。
- main 分支更新後，由 .github/workflows/pages.yml 部署到 GitHub Pages。

## 來源

教材依上課提供的 HEX 內嵌程式製作；原始程式資料保持不變。積木圖片由 Microsoft MakeCode 官方 renderblocks 引擎將教材片段轉成繁體中文圖像。網站未內含 MakeCode 編輯器程式本體，使用官方網頁嵌入。

- [MakeCode 積木繪圖](https://makecode.microbit.org/blocks-embed)
- [大聲事件與 V2](https://makecode.microbit.org/reference/input/on-sound)
- [音量門檻](https://makecode.microbit.org/reference/input/set-sound-threshold)
- [LED 座標](https://makecode.microbit.org/reference/led/plot)

本站非 micro:bit 官方網站。
