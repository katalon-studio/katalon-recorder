import {getCommandTargetOptions} from "../../self-healing/service/utils.js";
import { executeCommand } from "../../background/playback/service/actions/play-actions.js";

const deleteCommand = (selectedID) => {
    if (selectedID) {

        modifyCaseSuite();

        let delete_node = document.getElementById(selectedID);
        // do not forget to remove textNode
        if (delete_node.previousSibling.nodeType === 3) {
            delete_node.parentNode.removeChild(delete_node.previousSibling);
        }
        delete_node.parentNode.removeChild(delete_node);

        let count = parseInt(getRecordsNum()) - 1;
        document.getElementById("records-count").value = count;
        selectedID = parseInt(selectedID.split("-")[1]);

        // delete last one
        if (selectedID - 1 !== count) {
            reAssignIdForDelete(selectedID, count);
        }

        // store command grid to testCase
        let s_case = getSelectedCase();
        if (s_case) {
            sideex_testCase[s_case.id].records = document.getElementById("records-grid").innerHTML;
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
    let targetOptions;
    let showTarget;
    for (let i = 0; i < ref.length; i++) {
        showTarget = ref[i].getElementsByTagName("td")[1].getElementsByTagName("div")[1].textContent;
        targetOptions = ref[i].getElementsByTagName("td")[1]
            .getElementsByTagName("datalist")[0]
            .getElementsByTagName("option");
        let targetElements = [];
        let tempTarget;
        for (let j = 0; j < targetOptions.length; j++) {
            tempTarget = targetOptions[j].text;
            if (showTarget === tempTarget) {
                targetElements.splice(0, 0, [tempTarget]);
            } else {
                targetElements.push([tempTarget]);
            }
        }
        tempCommand[i] = {
            "command": getCommandName(ref[i]),
            "test": getCommandTarget(ref[i]),
            "target": targetElements,
            "value": getCommandValue(ref[i])
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
                addCommandManu(tempCommand[i]["command"], tempCommand[i]["target"], tempCommand[i]["value"]);
            }
            unselectSelectedCommands();
            selectCommands(1, tempCommand.length + 1)
            return;
        }

        // NOTE: because addCommandManu is add command on this below.
        // Therefore, index i is form length-1 to 0
        for (let i = tempCommand.length - 1; i >= 0; i--) {
            addCommandManu(tempCommand[i]["command"], tempCommand[i]["target"], tempCommand[i]["value"]);
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

const deleteAllAction = async () => {
    if (window.confirm('Are you sure you want to delete all test steps?')) {
        let selectedNodes = document.getElementById("records-grid").getElementsByTagName("TR");
        for (let i = selectedNodes.length; i > 0; i--) {
            let selectedRecord = selectedNodes[i-1];
            let oldValue = getCommandTarget(selectedRecord);
            await makeSelfHealingOutOfDate(oldValue, selectedRecord)
            deleteCommand("records-" + i);
        }
    }
}

const deleteSelectedAction = async () => {
    let selectedRecords = getSelectedRecords();
    for (let i = selectedRecords.length - 1; i >= 0; i--) {
        let selectedRecord = selectedRecords[i];
        let oldValue = getCommandTarget(selectedRecord);
        await makeSelfHealingOutOfDate(oldValue, selectedRecord)
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

const changeCommandTargetAction = async (oldValue) => {
    let selectedRecord = $(`#${getSelectedRecord()}`);
    await makeSelfHealingOutOfDate(oldValue, selectedRecord);

}

async function makeSelfHealingOutOfDate(oldValue, selectedRecord){
    let selfHealingElementList= $("#selfHealingList").find("tr");
    for (let element of selfHealingElementList){
        let approveColumn = $(element).find("td")[4];
        let brokenLocator = $(approveColumn).find("input[name='broken_locator']")[0].value;
        let proposeLocator = $(approveColumn).find("input[name='propose_locator']")[0].value;
        let optionList = await getCommandTargetOptions(selectedRecord, false);
        if (brokenLocator === oldValue && optionList.includes(proposeLocator)){
            if ($(approveColumn).find("i").length === 0){
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
