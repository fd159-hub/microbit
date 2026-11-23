'use strict';
// 依原檔保留狹窄的方向範圍與線性絕對值判斷；只示範邏輯，不模擬排程與感測器。
function compassLetter(heading){
    if(heading>=85&&heading<=95)return 'E';
    if(heading>=175&&heading<=185)return 'S';
    if(heading>=265&&heading<=275)return 'W';
    if(heading>=355||heading<=5)return 'N';
    return '';
}
function createCompassModel(random=Math.random){
    return {
        mode:0,heading:0,target:0,found:0,score:0,display:'',
        reset(){this.mode=0;this.heading=0;this.target=0;this.found=0;this.score=0;this.display='';},
        pick(){return Math.floor(random()*361);},
        tick(){if(this.mode===1)this.display=compassLetter(this.heading);else if(this.mode===2){this.found=Math.abs(this.heading-this.target)<20?1:0;this.display=this.found?'☺ 笑臉：找到方向':'棋盤格 → 100 毫秒 → 菱形';}},
        a(){this.mode=1;this.tick();},
        b(){this.mode=2;this.target=this.pick();this.tick();},
        logo(){if(this.found===1){this.found=0;this.target=this.pick();this.score++;this.display=`✓ → ${this.score}`;return true;}return false;}
    };
}
