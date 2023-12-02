let activeCellId = null;
const activeCellElement = document.getElementById("selected-cell");

const form = document.querySelector(".form");

let state = {};

form.addEventListener("change", onChangeFormData);

const defaultStyle = {
    fontFamily : "poppins-regular",
    fontSize : 16,
    isBold : false,
    isItalic : false,
    isUnderline : false,
    align : "left",
    textColor : "black",
    bgColor : "#ffffff",
    text : ""
};

function onChangeFormText(event){
    const changedText = event.target.innerText;

    if(state[activeCellId]){
        state[activeCellId].text = changedText;
    }else{
        //store in map
        state[activeCellId] = { ...defaultStyle, text: event.target.innerText};
    }
}

function onChangeFormData(){
    let option = {
        fontFamily : form["fontFamily"].value,
        fontSize : form["fontSize"].value,
        isBold : form.isBold.checked,
        isItalic : form.isItalic.checked,
        isUnderline : form.isUnderline.checked,
        align : form.align.value,
        textColor : form["textColor"].value,
        bgColor : form["bgColor"].value
    };
    applyStyle(option);
}

function applyStyle(style){
    if(!activeCellId){
        form.reset();
        alert("Please Select a Cell to Apply!");
        return;
    }

    //change the style
    const activeCell = document.getElementById(activeCellId);

    activeCell.style.fontFamily = style.fontFamily;
    activeCell.style.fontSize = style.fontSize + "px";
    activeCell.style.fontWeight = style.isBold ? 600 : 400;
    activeCell.style.fontStyle = style.isItalic ? "italic" : "normal";
    activeCell.style.textDecoration = style.isUnderline ? "underline" : "none";
    activeCell.style.textAlign = style.align;
    activeCell.style.color = style.textColor;
    activeCell.style.backgroundColor = style.bgColor;

    //store the this style of cell in map state
    state[activeCellId] = style;
}

function onFocusCall(event){
    //if i am again focus same cell then do nothing
    if(activeCellId === event.target.id) return;

    activeCellId = event.target.id;
    activeCellElement.innerText = activeCellId;

    //we focus on the cell. Now if cell already visited then gave his style otherwise give default style
    if(state[activeCellId]){
        //if this id present in map means it is visited
        restoreStyle(state[activeCellId]);
    }else{
        restoreStyle(defaultStyle);
    }
}
//restore the form style with current cells style
function restoreStyle(styles){
    form.fontSize.value = styles.fontSize;
    form.fontFamily.value = styles.fontFamily;
    form.isBold.checked = styles.isBold;
    form.isItalic.checked = styles.isItalic;
    form.isUnderline.checked = styles.isUnderline;
    form.align.value = styles.align;
    form.textColor.value = styles.textColor;
    form.bgColor.value = styles.bgColor;
};

function exportData(){
    let json = JSON.stringify(state);

    const blob = new Blob([json], {type:"text/plain"});
    
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "temp.json";
    link.click();
};

//formula bar
const formulaBar = document.getElementById("formula-cell");
formulaBar.addEventListener("change", saveText);

function containsNumbers(str) {
    return /[0-9]/.test(str);
}

function saveText(event){
    const text = event.target.value;

    if(containsNumbers(text)){
        let ans = evaluate(text);
        document.getElementById(activeCellId).innerText = ans;

        if(state[activeCellId]){
            state[activeCellId].text = ans+"";
            
        }else{
            document.getElementById(activeCellId).innerText = ans;
            state[activeCellId] = { ...defaultStyle, text: state[activeCellId].text.value+ans+""};

        }
    }else{
        let ans = text;
        document.getElementById(activeCellId).innerText += ans;
        if(state[activeCellId]){
            state[activeCellId].text = ans+"";
            
        }else{
            document.getElementById(activeCellId).innerText += ans;
            state[activeCellId] = { ...defaultStyle, text: state[activeCellId].text.value+ans+""};

        }
    }
}

function evaluate(expression){
    let opd = [];
    let opr = [];

    let ans = "";

    for(let i = 0; i < expression.length; i++){
        let ch = expression.charAt(i);

        if(ch >= '0' && ch <= '9'){
            opd.push(ch);
            if(opd.length > 1 && (opr[opr.length - 1] === '/' || opr[opr.length-1] === '*')){
                let v2 = opd.pop() - '0';
                let v1 = opd.pop() - '0';

                let o = opr.pop();
                let cal = eval(o, v1, v2);
                opd.push(cal.toString());
            }
        }
        else if(ch === '('){
            opd.push(ch);
        }
        else if(ch === ')'){
            while(opd.length > 0 && opd[opd.length - 1] != '('){
                let o = opr.pop();
                let v2 = opd.pop()-'0';
                let v1 = opd.pop()-'0';

                let cal = eval(o, v1, v2);
                opd.push(cal.toString());
            }
            opd.pop();
        }else{
            opr.push(ch);
        }
    }
    return opd.pop();
}

function eval(o, v1, v2){
    if(o === '+') return v1+v2;
    if(o === '-') return v1-v2;
    if(o === '*') return v1*v2;
    if(o === '/') return v1/v2;

    return -1;
}
