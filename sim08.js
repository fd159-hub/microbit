// 模擬一次 Loud 事件的程式結果，不模擬實體麥克風、事件間隔或音量偵測。
function createClapModel(){
    const pixels=Array(25).fill(false);
    let state=0;
    return {
        pixels,
        get state(){return state;},
        loudEvent(){
            if(state===0){pixels.fill(true);state=1;}
            else{pixels.fill(false);state=0;}
            return state;
        },
        reset(){pixels.fill(false);state=0;}
    };
}
