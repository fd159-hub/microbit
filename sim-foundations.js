'use strict';
// 網頁單次動作示意：不模擬硬體、播放時長、廣播環境與事件同時觸發。
function createFoundationModel(course,random=Math.random){
    const icon=value=>({kind:'icon',value}),pause=value=>({kind:'pause',value});
    const sound=value=>({kind:'sound',value,mode:'UntilDone'});
    const clear=()=>({kind:'clear'});
    const model={
        count:0,remainder:0,trace:[],position:0,
        reset(){this.count=0;this.remainder=0;this.position=0;this.trace=course==='06'?[icon('Asleep'),sound('yawn')]:course==='05'?[{kind:'group',value:108}]:course==='08advanced'?[{kind:'threshold',value:160},clear()]:[];},
        run(event){
            let trace=[];
            if(course==='01'&&event==='cycle')trace=[icon('Heart'),icon('SmallHeart')];
            else if(course==='02'){
                if(event==='A'){for(let i=0;i<4;i++)trace.push(icon('Heart'),icon('SmallHeart'));trace.push(clear());}
                else if(event==='B')trace=[icon('Sad'),pause(1000),clear()];
                else if(event==='AB')trace=[{kind:'text',value:'Hello!'}];
            }else if(course==='03'){
                if(event==='shake')trace=[{kind:'number',value:Math.floor(random()*6)+1}];
                else if(event==='A')trace=[clear()];
            }else if(course==='04'&&event==='P0')trace=[{kind:'number',value:Math.floor(random()*101)}];
            else if(course==='05'){
                if(event==='A'||event==='B')trace=[{kind:'send',value:event==='A'?'YES':'NO'}];
                else if(event==='receiveYES'||event==='receiveNO')trace=[{kind:'text',value:event==='receiveYES'?'YES':'NO'}];
            }else if(course==='06'&&(event==='shake'||event==='Logo'))trace=[icon(event==='shake'?'Sad':'Happy'),sound(event==='shake'?'sad':'happy'),pause(2000),icon('Asleep'),sound('yawn')];
            else if(course==='07'&&event==='A'){
                for(let i=0;i<=4;i++)trace.push({kind:'tone',value:262,beat:'Quarter',mode:'UntilDone'},{kind:'number',value:5-i});
                trace.push(clear(),{kind:'tone',value:392,beat:'Whole',mode:'InBackground'},{kind:'text',value:'Go!'});
            }else if(course==='08advanced'&&event==='loud'){
                this.count++;this.remainder=this.count%3;
                trace=[this.remainder===1?icon('SmallHeart'):this.remainder===2?icon('Heart'):clear(),pause(1000)];
            }
            this.trace=trace;this.position=0;
        },
        next(){if(this.position<this.trace.length-1)this.position++;}
    };
    model.reset();return model;
}
function describeFoundationAction(action){
    if(!action)return '等待操作';
    const names={Heart:'♥ 大愛心',SmallHeart:'♡ 小愛心',Sad:'☹ 難過',Happy:'☺ 開心',Asleep:'☾ 睡著'};
    if(action.kind==='icon')return '顯示 '+names[action.value];
    if(action.kind==='clear')return '清空畫面';
    if(action.kind==='pause')return `暫停 ${action.value} 毫秒`;
    if(action.kind==='number')return `顯示數字 ${action.value}`;
    if(action.kind==='text')return `顯示文字 ${action.value}`;
    if(action.kind==='send')return `送出 ${action.value}（自己不顯示）`;
    if(action.kind==='group')return `廣播群組設為 ${action.value}`;
    if(action.kind==='threshold')return `大聲門檻設為 ${action.value}`;
    if(action.kind==='sound')return `播放 ${action.value} 音效，播完才繼續`;
    if(action.kind==='tone')return `${action.value} Hz · ${action.beat==='Quarter'?'1/4':'1'} 拍 · ${action.mode==='UntilDone'?'播完才繼續':'背景播放'}`;
    return '';
}
