import { deleteCommand, setBreakpoint, setSelected } from "./actions.js";

function reduceDuplicateCommand(recordState) {
    const result = [];
    for (let i = 0; i < recordState.length; i++) {
        let duplicate = false;
        if (!recordState[i]) continue;
        for (let j = 0; j < result.length; j++) {
            if (recordState[i].id === result[j].id) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) {
            result.push(recordState[i]);
        }
    }
    return result;
}

const extractInformationFromRecordGrid = () => {

    const recordsArray = getRecordsArray();
    const recordState = [...recordsArray].map(element => extractInformationFromRecordGridElement(element));
    //we reduce duplicate in case of the use make a drag and drop action
    //that action will duplicate the current record that being drag
    let reducedCommandList = reduceDuplicateCommand(recordState)
    return reducedCommandList;
}

function getCommandTargets(record){
    let showTarget = record.getElementsByTagName("td")[1]?.getElementsByTagName("div")[1]?.textContent;
    if (!showTarget) {
        return [[""]];
    }
    let targetOptions = record.getElementsByTagName("td")[1]
        .getElementsByTagName("datalist")[0]
        .getElementsByTagName("option");
    let targetElements = [];
    let tempTarget;
    let isNewShowTarget = true;
    for (let j = 0; j < targetOptions.length; j++) {
        tempTarget = targetOptions[j].text;
        if (showTarget === tempTarget) {
            targetElements.splice(0, 0, [tempTarget]);
            isNewShowTarget = false;
        } else {
            targetElements.push([tempTarget]);
        }
    }
    if (isNewShowTarget) {
        targetElements.splice(0, 0, [showTarget]);
    }
    return targetElements;
}

function extractInformationFromRecordGridElement(record) {
    //bypass drag and drop sortable
    if (record.classList.contains("ui-sortable-placeholder") || record.classList.contains("ui-sortable-helper")) {
        return;
    }
    let isBreakpoint = record.getElementsByTagName("td")[0].classList.contains('break');
    let isSelected = record.classList.contains("selectedRecord");
    return {
        id: record.id,
        command: getCommandName(record),
        target: getCommandTargets(record),
        value: getCommandValue(record),
        isBreakpoint,
        isSelected,
    };
}

const restoreRecords = (recordState) => {
    //remove all current record
    [...getRecordsArray()].forEach(record => deleteCommand(record.id));
    //add record again from recordState
    recordState.forEach(record => {
        if (!record) {
            return;
        }
        let { command, target, value, isBreakpoint, isSelected } = record;
        addCommand(command, target, value, 1, false);
        //check if this record is set as breakpoint
        if (isBreakpoint) {
            setBreakpoint(record.id);
        }
    });
    recordState.filter(record => record.isSelected).forEach(record => setSelected(record.id));
    resetFocus();
}

function resetFocus() {
    let firstSelectedRecord = getSelectedRecords()[0];
    if (!firstSelectedRecord) {
        return;
    }
    firstSelectedRecord.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });
    let command = getCommandName(firstSelectedRecord),
        target = getCommandTarget(firstSelectedRecord),
        value = getCommandValue(firstSelectedRecord)
    $("#command-command").val(command);
    $("#command-target").val(target);
    $("#command-value").val(value);
}


const extractRecordGridWhenEditCommandToolBar = (commandToolbarID) => {
    const commandToolbarElement = $("#" + commandToolbarID);
    let recordID = commandToolbarElement.data("ID");
    let oldValue = commandToolbarElement.data("oldVal");
    let recordGridState = extractInformationFromRecordGrid();
    if (oldValue !== undefined) {
        recordGridState.map(record => {
            if (record.id === recordID) {
                record.isSelected = true;
                switch (commandToolbarID) {
                    case "command-command":
                        record.command = oldValue;
                        break;
                    case "command-value":
                        record.value = oldValue;
                        break;
                    case "command-target":
                        if (!record.target.includes(oldValue)) {
                            record.target.shift();
                        } else {
                            //move the first target to last
                            record.target.push(record.target.splice(0, 1)[0]);
                        }
                        break;
                }
                commandToolbarElement.removeData("ID");
                commandToolbarElement.removeData("oldVal");
            } else {
                record.isSelected = false;
            }
            return record;
        });
    }
    return recordGridState;
}

export { extractInformationFromRecordGrid, restoreRecords, extractRecordGridWhenEditCommandToolBar, resetFocus }