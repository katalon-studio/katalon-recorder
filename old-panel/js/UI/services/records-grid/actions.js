import { executeCommand } from "../../../background/playback/service/actions/play/play-actions.js";
import { addCommandManu } from "../../view/records-grid/add-command.js"
import { getSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { findTestCaseById } from "../data-service/test-case-service.js";
import { modifyCaseSuite } from "../../view/records-grid/modify-case-suite.js";
import { reAssignIdForDelete } from "../../view/records-grid/re-assign-id.js";
import { getSelectedRecord, getSelectedRecords } from "../../view/records-grid/selected-records.js";

const deleteCommand = (selectedID) => {
    if (selectedID) {
        //UI record start with 1
        const index = parseInt(selectedID.substring(8)) - 1;
        const selectedTestCase = getSelectedCase();
        const testCaseID = selectedTestCase.id;
        const testCase = findTestCaseById(testCaseID);
        testCase.removeCommandAtIndex(index);

        modifyCaseSuite();

        let delete_node = document.getElementById(selectedID);
        // do not forget to remove textNode
        if (delete_node.previousSibling.nodeType === 3) {
            delete_node.parentNode.removeChild(delete_node.previousSibling);
        }
        delete_node.parentNode.removeChild(delete_node);

        let count = testCase.getTestCommandCount();
        document.getElementById("records-count").value = count;
        selectedID = parseInt(selectedID.split("-")[1]);

        // delete last one
        if (selectedID - 1 !== count) {
            reAssignIdForDelete(selectedID, count);
        }

    }
}

const setBreakpoint = (selectedID) => {
    if (selectedID) {
        let current_node = document.getElementById(selectedID).getElementsByTagName("td")[0];
        if (!current_node.classList.contains("break")) {
            current_node.classList.add("break");
        } else {
            current_node.classList.remove("break");
        }
    }
}

const setSelected = (selectedID) => {
    if (selectedID) {
        let current_node = document.getElementById(selectedID);
        if (!current_node.classList.contains("selectedRecord")) {
            current_node.classList.add("selectedRecord");
        } else {
            current_node.classList.remove("selectedRecord");
        }
    }
}

let tempCommand = [];

const copyAction = () => {
    // clear tempCommand
    tempCommand = [];
    let ref = getSelectedRecords();
    const selectedTestCase = getSelectedCase();
    const testCase = findTestCaseById(selectedTestCase.id);
    for (let i = 0; i < ref.length; i++) {
        const testCommandIndex = parseInt(ref[i].id.substring(8)) - 1;
        const testCommand = testCase.commands[testCommandIndex];
        tempCommand[i] = {
            "command": testCommand.name,
            "test": testCommand.defaultTarget,
            "target": testCommand.targets,
            "value": testCommand.value
        };
    }
}

function selectCommands(start, end) {
    for (let i = start; i < end; i++) {
        let ID = "#records-" + i;
        $(ID).addClass("selectedRecord");
    }
}

function unselectSelectedCommands() {
    const selectedRecords = [...getSelectedRecords()];
    selectedRecords.forEach(record => {
        $(record).removeClass("selectedRecord");
    });
}

const pasteAction = () => {
    if (tempCommand.length > 0) {
        let selectedRecords = getSelectedRecords();
        if (selectedRecords.length === 0) {
            // NOTE: because there is no selected record.
            // Therefore, index i is form 0 to length-1.
            for (let i = 0; i < tempCommand.length; i++) {
                //addCommandManu receive targets as a 2D array
                const targets = tempCommand[i]["target"].map(target => [target]);
                addCommandManu(tempCommand[i]["command"], targets, tempCommand[i]["value"]);
            }
            unselectSelectedCommands();
            selectCommands(1, tempCommand.length + 1)
            return;
        }

        // NOTE: because addCommandManu is add command on this below.
        // Therefore, index i is form length-1 to 0
        for (let i = tempCommand.length - 1; i >= 0; i--) {
            //addCommandManu receive targets as a 2D array
            const targets = tempCommand[i]["target"].map(target => [target]);
            addCommandManu(tempCommand[i]["command"], targets, tempCommand[i]["value"]);
        }
        let lastSelectedID = selectedRecords[selectedRecords.length - 1].id; //format records-x
        let index = parseInt(lastSelectedID.substring(8));
        unselectSelectedCommands();
        selectCommands(index + 1, index + tempCommand.length + 1)
    }
}

const addAction = () => {
    // target is 2-D array
    addCommandManu("", [
        [""]
    ], "");
}

const deleteAllAction = () => {
    if (window.confirm('Are you sure you want to delete all test steps?')) {
        const selectedTestCase = getSelectedCase();
        const testCase = findTestCaseById(selectedTestCase.id);
        for (const command of testCase.commands) {
            makeSelfHealingOutOfDate(command.target, command);
        }
        testCase.commands = [];
        clean_panel();
        modifyCaseSuite();
    }
}

const deleteSelectedAction = () => {
    let selectedRecords = getSelectedRecords();
    const selectedTestCase = getSelectedCase();
    const testCase = findTestCaseById(selectedTestCase.id);

    for (let i = selectedRecords.length - 1; i >= 0; i--) {
        let selectedRecord = selectedRecords[i];
        const testCommandIndex = parseInt(selectedRecord.id.substring(8)) - 1;
        const testCommand = testCase.commands[testCommandIndex];
        makeSelfHealingOutOfDate(testCommand.defaultTarget, testCommand);
        deleteCommand(selectedRecord.id);
    }
}

const selectAllAction = () => {
    let recordNode = document.getElementById("records-grid").getElementsByTagName("TR");
    for (let i = 0; i < recordNode.length; i++) {
        recordNode[i].classList.add("selectedRecord");
    }
}

const setBreakpointAction = () => {
    setBreakpoint(getSelectedRecord());
}

const playFromHereAction = (index) => {
    currentPlayingFromHereCommandIndex = parseInt(index) - 1;
    $('#playback').click();
}

const playCommandAction = (index) => {
    executeCommand(index)
}

const changeCommandTargetAction = (oldValue) => {
    const selectedTestCase = getSelectedCase();
    const testCase = findTestCaseById(selectedTestCase.id);
    const index = parseInt(getSelectedRecord().substring(8)) - 1;
    makeSelfHealingOutOfDate(oldValue, testCase.commands[index]);

}

function makeSelfHealingOutOfDate(oldValue, testCommand) {
    let selfHealingElementList = $("#selfHealingList").find("tr");
    for (let element of selfHealingElementList) {
        let approveColumn = $(element).find("td")[4];
        let brokenLocator = $(approveColumn).find("input[name='broken_locator']")[0].value;
        let proposeLocator = $(approveColumn).find("input[name='propose_locator']")[0].value;
        let optionList = testCommand.targets;
        if (brokenLocator === oldValue && optionList.includes(proposeLocator)) {
            if ($(approveColumn).find("i").length === 0) {
                let icon =
                    `<i title="This broken locator is out of date. Approving it will simply delete this row from the self-healing tab." 
                class="fa fa-exclamation-circle" aria-hidden="true"></i>`;
                $(approveColumn).append(icon);
            }
        }
    }
}

export {
    copyAction,
    pasteAction,
    addAction,
    deleteAllAction,
    deleteSelectedAction,
    setBreakpointAction,
    playFromHereAction,
    playCommandAction,
    selectAllAction,
    deleteCommand,
    setBreakpoint,
    setSelected,
    changeCommandTargetAction
};