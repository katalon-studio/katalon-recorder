import {
    generateAddCommand,
    generateCopyCommand,
    generateDeleteSelectedCommand,
    generatePasteCommand,
    generateRedoCommand,
    generateSelectAllCommand,
    generateSetBreakpointCommand,
    generateUndoCommand
} from "../../services/records-grid-service/command-generators.js";
import { getSelectedRecords } from "../../view/records-grid/selected-records.js";
import { getSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";

let isOnCommandContainer = false;
let isOnCommandToolBar = false;



document.getElementById("command-toolbar").addEventListener("click", function(event) {
    isOnCommandContainer = false;

})

document.addEventListener("click", function(event) {
    const commandContainerElement = document.getElementById("command-container");
    const commandToolbarElement = document.getElementById("command-toolbar");
    isOnCommandContainer = commandContainerElement.contains(event.target);
    isOnCommandToolBar = commandToolbarElement.contains(event.target);
});


function stopNativeEvent(event) {
    // NOTE: lock the browser default shortcuts
    // and this should be careful
    event.preventDefault();
    event.stopPropagation();
}

// Hot key setting
document.addEventListener("keydown", function(event) {
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }

    // Hot keys: Ctrl + [KEY] or Command + [KEY]
    if (event.ctrlKey || event.metaKey) {
        // Users should not be allowed to refresh the app,
        // as it will re-inject content scripts and cause weird behaviors
        if (keyNum === 82) {
            stopNativeEvent(event);
            return;
        }
        if (!isOnCommandContainer) {
            if (isOnCommandToolBar) {
                //allow Undo Redo on command toolbar
                switch (keyNum) {
                    case 90: //Ctrl + Z
                        stopNativeEvent(event);
                        let undoCommand = generateUndoCommand();
                        undoCommand.execute();
                        break;
                    case 89: //Ctrl + Y
                        stopNativeEvent(event);
                        let redoCommand = generateRedoCommand();
                        redoCommand.execute();
                        break;
                }
            }
            return;
        }

        stopNativeEvent(event);
        let copyCommand;
        switch (keyNum) {
            case 65: // Ctrl + A
                let selectAllCommand = generateSelectAllCommand();
                selectAllCommand.execute();
                break;
            case 66: // Ctrl + B
                let setBreakpointCommand = generateSetBreakpointCommand();
                setBreakpointCommand.execute();
                break;
            case 67: // Ctrl + C
                copyCommand = generateCopyCommand();
                copyCommand.execute();
                break;
            case 73: // Ctrl + I
                let addCommand = generateAddCommand();
                addCommand.execute();
                break;
            case 86: // Ctrl + V
                let pasteCommand = generatePasteCommand();
                pasteCommand.execute();
                break;
            case 88: // Ctrl + X
                copyCommand = generateCopyCommand();
                copyCommand.execute();
                let deleteSelectedCommand = generateDeleteSelectedCommand();
                deleteSelectedCommand.execute();
                break;
            case 90: //Ctrl + Z
                let undoCommand = generateUndoCommand();
                undoCommand.execute();
                break;
            case 89: //Ctrl + Y
                let redoCommand = generateRedoCommand();
                redoCommand.execute();
                break;
            default:
                break;
        }
    }
}, false);

function pressArrowKey(direction) {
    let selectedRecords = getSelectedRecords();
    if (selectedRecords.length === 0) {
        return;
    }
    const selectedTestCase = getSelectedCase();
    const testCaseID = selectedTestCase.id;
    const testCase = findTestCaseById(testCaseID);
    let lastRecordId = selectedRecords[selectedRecords.length - 1].id;
    let recordNum = parseInt(lastRecordId.substring(lastRecordId.indexOf("-") + 1));
    $("#records-grid .recordState").removeClass("selectedRecord");
    if (direction === 38) { // press up arrow
        let recordElement;
        if (recordNum === 1) {
            recordElement = $("#records-1")[0]
        } else {
            recordElement = $("#records-" + (recordNum - 1))[0]
        }
        $(recordElement).addClass("selectedRecord").click();
        recordElement.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
    } else if (direction === 40) { // press down arrow
        let recordElement;
        if (recordNum === testCase.getTestCommandCount()) {
            recordElement = $("#records-" + recordNum)[0];
        } else {
            recordElement = $("#records-" + (recordNum + 1))[0]
        }
        $(recordElement).addClass("selectedRecord").click();
        recordElement.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
    }
}

function selectForeRecord() {
    pressArrowKey(38);
}

function selectNextRecord() {
    pressArrowKey(40);
}

//Hot key setting for up and down key
document.addEventListener("keydown", function(event) {
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }
    if (!$("#command-dropdown").hasClass('w3-show')) {
        switch (keyNum) {
            case 38: // up arrow
                selectForeRecord();
                break;
            case 40: // down arrow
                selectNextRecord();
                break;
          /* KAT-BEGIN remove hot key
          case 46: // del
              let selectedTr = getSelectedRecords();
              for (let i=selectedTr.length-1 ; i>=0 ; i--) {
                  deleteCommand(selectedTr[i].id);
              }
              break; */
            default:
                break;
        }
    }
});