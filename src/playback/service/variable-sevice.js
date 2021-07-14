const storedVars = {
    KEY_ADD: "\ue025",
    KEY_ALT: "\ue00a",
    KEY_BACKSPACE: "\ue003",
    KEY_BKSP: "\ue003",
    KEY_COMMAND: "\ue03d",

    KEY_CONTROL: "\ue009",
    KEY_CTRL: "\ue009",
    KEY_DECIMAL: "\ue028",
    KEY_DEL: "\ue017",
    KEY_DELETE: "\ue017",
    KEY_DIV: "\ue029",
    KEY_DIVIDE: "\ue029",
    KEY_DOWN: "\ue015",
    KEY_END: "\ue010",
    KEY_ENTER: "\ue007",
    KEY_EQUALS: "\ue019",
    KEY_ESC: "\ue00c",
    KEY_ESCAPE: "\ue00c",
    KEY_F1: "\ue031",
    KEY_F10: "\ue03a",
    KEY_F11: "\ue03b",
    KEY_F12: "\ue03c",
    KEY_F2: "\ue032",
    KEY_F3: "\ue033",
    KEY_F4: "\ue034",
    KEY_F5: "\ue035",
    KEY_F6: "\ue036",
    KEY_F7: "\ue037",
    KEY_F8: "\ue038",
    KEY_F9: "\ue039",
    KEY_HOME: "\ue011",
    KEY_INS: "\ue016",
    KEY_INSERT: "\ue016",
    KEY_LEFT: "\ue012",
    KEY_META: "\ue03d",
    KEY_MINUS: "\ue027",
    KEY_MUL: "\ue024",
    KEY_MULTIPLY: "\ue024",
    KEY_N0: "\ue01a",
    KEY_N1: "\ue01b",
    KEY_N2: "\ue01c",
    KEY_N3: "\ue01d",
    KEY_N4: "\ue01e",
    KEY_N5: "\ue01f",
    KEY_N6: "\ue020",
    KEY_N7: "\ue021",
    KEY_N8: "\ue022",
    KEY_N9: "\ue023",
    KEY_NUMPAD0: "\ue01a",
    KEY_NUMPAD1: "\ue01b",
    KEY_NUMPAD2: "\ue01c",
    KEY_NUMPAD3: "\ue01d",
    KEY_NUMPAD4: "\ue01e",
    KEY_NUMPAD5: "\ue01f",
    KEY_NUMPAD6: "\ue020",
    KEY_NUMPAD7: "\ue021",
    KEY_NUMPAD8: "\ue022",
    KEY_NUMPAD9: "\ue023",
    KEY_PAGE_DOWN: "\ue00f",
    KEY_PAGE_UP: "\ue00e",
    KEY_PAUSE: "\ue00b",
    KEY_PERIOD: "\ue028",
    KEY_PGDN: "\ue00f",
    KEY_PGUP: "\ue00e",
    KEY_PLUS: "\ue025",
    KEY_RIGHT: "\ue014",
    KEY_SEMICOLON: "\ue018",
    KEY_SEP: "\ue026",
    KEY_SEPARATOR: "\ue026",
    KEY_SHIFT: "\ue008",
    KEY_SPACE: "\ue00d",
    KEY_SUBTRACT: "\ue027",
    KEY_TAB: "\ue004",
    KEY_UP: "\ue013"
}
const convertVariableToString = (variable, declaredVars) => {
    let frontIndex = variable.indexOf("${");
    let newStr = "";
    while (frontIndex !== -1) {
        let prefix = variable.substring(0, frontIndex);
        let suffix = variable.substring(frontIndex);
        let tailIndex = suffix.indexOf("}");
        if (tailIndex >= 0) {
            let suffix_front = suffix.substring(0, tailIndex + 1);
            let suffix_tail = suffix.substring(tailIndex + 1);
            newStr += prefix + xlateArgument(suffix_front, declaredVars);
            variable = suffix_tail;
            frontIndex = variable.indexOf("${");
        } else {
            // e.g. ${document https://forum.katalon.com/discussion/6083
            frontIndex = -1;
        }
    }
    let expanded = newStr + variable;
    return expanded;
}

function xlateArgument(value, declaredVars) {


    var mergedVars = Object.assign({}, storedVars, declaredVars);;

    value = value.replace(/^\s+/, '');
    value = value.replace(/\s+$/, '');
    var r;
    var r2;
    var parts = [];
    if ((r = /\$\{/.exec(value))) {
        var regexp = /\$\{(.*?)\}/g;
        var lastIndex = 0;
        while (r2 = regexp.exec(value)) {
            if (mergedVars[r2[1]] !== undefined) {
                if (r2.index - lastIndex > 0) {
                    parts.push(string(value.substring(lastIndex, r2.index)));
                }
                parts.push(mergedVars[r2[1]]);
                lastIndex = regexp.lastIndex;
            } else if (r2[1] == "nbsp") {
                if (r2.index - lastIndex > 0) {
                    parts.push(mergedVars[string(value.substring(lastIndex, r2.index))]);
                }
                parts.push(nonBreakingSpace());
                lastIndex = regexp.lastIndex;
            }
        }
        if (lastIndex < value.length) {
            parts.push(string(value.substring(lastIndex, value.length)));
        }
        return parts.join("");
    } else {
        return string(value);
    }
}

function string(value) {
    if (value != null) {
        value = value.replace(/\\/g, '\\\\');
        value = value.replace(/\"/g, '\\"');
        value = value.replace(/\r/g, '\\r');
        value = value.replace(/\n/g, '\\n');
        return value;
    } else {
        return '';
    }
}


const evalIfCondition = (expression, declaredVars) => {
    return eval(expandForStoreEval(expression, declaredVars));
}

function isVarName(str){

    if (str.trim() !== str) {
        return false;
    }

    try {
        new Function(str, 'var ' + str);
    } catch (e) {
        return false;
    }

    return true;
}

const expandForStoreEval = (expression, declaredVars) => {
    var variables = '';
    for (var i in declaredVars) {
        if (isVarName(i)) {
            variables += 'var ' + i + '=' + JSON.stringify(declaredVars[i]) + ';';
        }
    }
    var mergedVars = Object.assign({}, storedVars, declaredVars);
    variables += 'var storedVars = ' + JSON.stringify(mergedVars) + ';';
    return variables + expression;
}

export { convertVariableToString, expandForStoreEval, evalIfCondition }