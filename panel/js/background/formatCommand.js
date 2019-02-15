// Modified in remoteControl.js from selenium-IDE

var declaredVars = {};

function xlateArgument(value) {

    var mergedVars = Object.assign({}, storedVars, declaredVars);

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

function handleFormatCommand(message, sender, response) {
    if (message.storeVar !== undefined) {
        sideex_log.info("Store '" + message.storeStr + "' into '" + message.storeVar + "'");
        declaredVars[message.storeVar] = message.storeStr;
    } else {
        if (message.echoStr) {
            sideex_log.info("echo: " + message.echoStr);
        }
    }
}

/* KAT-BEGIN avoid duplicate
browser.runtime.onMessage.addListener(handleFormatCommand);
KAT-END */
