import { getSelectedSuite } from "../testcase-grid/selected-suite.js";
import { getSelectedCase } from "../testcase-grid/selected-case.js";
import { createTestSuite, findTestSuiteById } from "../../services/data-service/test-suite-service.js";
import { renderNewTestSuite } from "../testcase-grid/render-new-test-suite.js";
import { renderNewTestCase } from "../testcase-grid/render-new-test-case.js";
import { createTestCase, findTestCaseById } from "../../services/data-service/test-case-service.js";
import { modifyCaseSuite } from "./modify-case-suite.js";
import { trackingCreateTestCase, trackingCreateTestSuite } from "../../services/tracking-service/segment-tracking-service.js";
import { TestCommand } from "../../models/test-model/test-command.js";
import { renderCommandElement } from "./render-command-element.js";
import { reAssignId } from "./re-assign-id.js";
import { getSelectedRecords } from "./selected-records.js";
import { getRecordsArray } from "./get-records-array.js";
import { getTdShowValueNode } from "./record-utils.js";
import { attachEvent } from "./attach-event.js"
import { saveOldCase } from "../testcase-grid/utils.js";
import { closeConfirm } from "../testcase-grid/close-confirm.js";

function addCommand(command_name, command_target_array, command_value, auto, insertCommand) {
    // create default test suite and case if necessary
    const selectedTestSuite = getSelectedSuite()
    const selectedTestCase = getSelectedCase();

    let testSuite;
    let testCase;
    if (!selectedTestSuite) {
        testSuite = createTestSuite("Untitled Test Suite");
        renderNewTestSuite("Untitled Test Suite", testSuite.id);
        trackingCreateTestSuite('Record', 'Untitled Test Case');
    } else {
        const testSuiteID = selectedTestSuite.id;
        testSuite = findTestSuiteById(testSuiteID);
    }
    if (!selectedTestCase) {
        testCase = createTestCase("Untitled Test Case", testSuite);
        renderNewTestCase("Untitled Test Case", testCase.id);
        trackingCreateTestCase('Record', 'Untitled Test Case');
    } else {
        const testCaseID = selectedTestCase.id;
        testCase = findTestCaseById(testCaseID);
    }

    const targetList = command_target_array.map(target => target[0]);

    const testCommand = new TestCommand(command_name, targetList[0], targetList, command_value);


    // mark modified
    modifyCaseSuite();
    closeConfirm(true);

    const new_record = renderCommandElement(testCommand);

    const count = testCase.getTestCommandCount() + 1;
    if (document.getElementById("records-count")) {
        document.getElementById("records-count").value = count;
    } else {
        const input = document.createElement("input");
        input.value = count;
        input.type = "hidden";
        input.id = "records-count";
        document.getElementById("records-grid").appendChild(input);
    }


    // var selected_ID = getSelectedRecord();
    // NOTE: change new API for get selected records
    const selectedRecords = getSelectedRecords();
    let selected_ID;
    if (selectedRecords.length > 0) {
        selected_ID = selectedRecords[selectedRecords.length - 1].id;
    }

    if (selected_ID) {
        const index = parseInt(selected_ID.substring(8));
        if (auto) {
            testCase.insertCommandToIndex(index + 1, testCommand);
            document.getElementById(selected_ID).parentNode.insertBefore(new_record, document.getElementById(selected_ID));
            selected_ID = parseInt(selected_ID.split("-")[1]);
        } else {
            testCase.insertCommandToIndex(index, testCommand);
            document.getElementById(selected_ID).parentNode.insertBefore(new_record, document.getElementById(selected_ID).nextSibling);
            selected_ID = parseInt(selected_ID.split("-")[1]) + 1;
        }
        reAssignId("records-" + selected_ID, "records-" + count);
        attachEvent(selected_ID, selected_ID);
        if (auto) {
            selected_ID = "#records-" + (selected_ID + 1);
            $(selected_ID).addClass('selectedRecord');
        }
    } else {
        if (insertCommand) {
            //insert before last command
            const index = testCase.getTestCommandCount() - 2;
            testCase.insertCommandToIndex(index, testCommand);
            document.getElementById("records-grid").insertBefore(new_record, getRecordsArray()[index]);
        } else {
            testCase.commands.push(testCommand);
            document.getElementById("records-grid").appendChild(new_record);
        }
        reAssignId("records-1", "records-" + count);
        attachEvent(1, count);

        // focus on new element
        document.getElementById("records-" + count).scrollIntoView(false);
    }
    if (auto) {
        new_record.parentNode.insertBefore(document.createTextNode("\n"), new_record.nextSibling);
    } else {
        new_record.parentNode.insertBefore(document.createTextNode("\n"), new_record);
    }

    // set div_show's innerHTML here, because we need div's clientWidth
    for (var k = 0; k < 3; ++k) {
        var string;
        if (k == 0) {
            string = command_name;
        } else if (k == 1) {
            // some target is not a pure string, so we need to change the type to string
            string = command_target_array[0][0].toString();
            if (string.includes("d-XPath")) {
                string = "auto-located-by-tac";
            }
        } else {
            string = command_value;
        }
        getTdShowValueNode(new_record, k).appendChild(document.createTextNode(string));
    }

    saveOldCase();
}

// add command manually (append downward)
function addCommandManu(command_name, command_target_array, command_value) {
    addCommand(command_name, command_target_array, command_value, 0, false);
}

// add command before last command (append upward)
function addCommandBeforeLastCommand(command_name, command_target_array, command_value) {
    addCommand(command_name, command_target_array, command_value, 0, true);
}

// add command automatically (append upward)
function addCommandAuto(command_name, command_target_array, command_value) {
    addCommand(command_name, command_target_array, command_value, 1, false);
}

export { addCommand, addCommandManu, addCommandAuto, addCommandBeforeLastCommand }