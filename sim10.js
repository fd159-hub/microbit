// 只呈現原始事件對資料列的影響，不模擬實體 flash、時間欄或 USB。
function createRecordModel(){
    const rows=[];let icon='空白';
    const choices={A:{column:'Boy',icon:'劍'},B:{column:'Girl',icon:'小愛心'},Logo:{column:'Teacher',icon:'笑臉'}};
    return {
        rows,
        get icon(){return icon;},
        record(button){const c=choices[button];if(!c)throw Error('Unknown event');const row={Boy:'',Girl:'',Teacher:''};row[c.column]=1;rows.push(row);icon=c.icon;return row;},
        deleteLog(){rows.length=0;icon='骷髏';},
        reset(){rows.length=0;icon='空白';}
    };
}
