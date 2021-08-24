import {
    generateRedoCommand,
    generateSelectAllSelfHealingProposalCommand,
    generateUndoCommand
} from "../../services/self-healing-service/self-healing-tab-command-generators.js";
import {isSelfHealingTabDisplay} from "../../services/self-healing-service/utils.js";

let isOnLogSection = false;

document.getElementById("log-section").addEventListener("click", function (event) {
    event.stopPropagation();
    isOnLogSection = true;
});

document.addEventListener("click", function (event) {
    isOnLogSection = false;
});


function stopNativeEvent(event) {
    // NOTE: lock the browser default shortcuts
    // and this should be careful
    event.preventDefault();
    event.stopPropagation();
}

document.addEventListener("keydown", function (event) {
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }
    // Hot keys: Ctrl + [KEY] or Command + [KEY]
    if (event.ctrlKey || event.metaKey) {
        if (!isOnLogSection || !isSelfHealingTabDisplay()) {
            return;
        }
        stopNativeEvent(event);
        switch (keyNum) {
            case 65: //Ctrl + A
                let selectAllCommand = generateSelectAllSelfHealingProposalCommand();
                selectAllCommand.execute();
                break;
            case 90: //Ctrl + Z
                let undoCommand = generateUndoCommand();
                undoCommand.execute();
                break;
            case 89: //Ctrl + Y
                let redoCommand = generateRedoCommand();
                redoCommand.execute();
                break;
        }
    }
});