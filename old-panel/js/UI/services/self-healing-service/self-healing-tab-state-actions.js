import { attachEvent as selfHealingAttachEvent } from "../../view/self-healing/self-healing-tab.js";
import { getSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { findTestCaseById } from "../data-service/test-case-service.js";
import { renderTestCaseToRecordGrid } from "../../view/records-grid/render-test-case-to-record-grid.js";
import {
    mappingJSONObjectToTestData,
    mappingTestDataToJSONObject,
    saveData,
    setKRData
} from "../data-service/save-data.js";

let captureSelfHealingListState = function() {
    let stateList = []
    $("#selfHealingList").find("tr").each((index, row) => {
        let approveColumn = $(row).find("td")[4];
        let testCaseID = $(approveColumn).find("input[name='testcaseID']")[0].value;
        let brokenLocator = $(approveColumn).find("input[name='broken_locator']")[0].value;
        let proposeLocator = $(approveColumn).find("input[name='propose_locator']")[0].value;
        let isApproved = $(approveColumn).find("input[name='approve-change-locator']")[0].checked;
        let testCaseName = $(row).find("td")[0].innerText;
        let testCaseStatus = $(row).find("td")[1].innerText;
        let isSelected = $(row).hasClass("selected");
        let isOutOfDate = $(approveColumn).find("i").length > 0;
        stateList.push({
            testCaseID,
            brokenLocator,
            proposeLocator,
            isApproved,
            testCaseName,
            testCaseStatus,
            isSelected,
            isOutOfDate
        });
    });
    return stateList;
}

function addSelfHealingRow(state) {
    let selfHealingList = $("#selfHealingList");
    let isApprove = state.isApproved ? "checked='true'" : "";
    let isOutOfDateElement = "";
    if (state.isOutOfDate) {
        isOutOfDateElement = `<i title="This broken locator is out of date. Approving it will simply delete this row from the self-healing tab." 
                class="fa fa-exclamation-circle" aria-hidden="true"></i>`
    }
    let resultRow = $(`<tr>
                            <td>${state.testCaseName}</td>
                            <td>${state.testCaseStatus}</td>
                            <td>${state.brokenLocator}</td>
                            <td>${state.proposeLocator}</td>
                            <td>
                                <input type="hidden" name="testcaseID" value="${state.testCaseID}">
                                <input type="hidden" name="broken_locator" value="${state.brokenLocator}"/>
                                <input type="hidden" name="propose_locator" value="${state.proposeLocator}"/>
                                <input type="checkbox" name="approve-change-locator" ${isApprove}"/>
                                ${isOutOfDateElement}
                            </td>
                       </tr>`);
    if (state.isSelected) {
        $(resultRow).addClass("selected");
    }
    selfHealingAttachEvent(resultRow);
    selfHealingList.append(resultRow);
}

const restoreSelfHealingListState = (selfHealingListState) => {
    $("#selfHealingList").empty();
    selfHealingListState.forEach(state => {
        addSelfHealingRow(state);
    });
};


const captureSelfHealingWhenApproveChange = () => {
    saveData();
    let selfHealingState = captureSelfHealingListState();
    let JSONData = mappingTestDataToJSONObject();
    return { selfHealingState, JSONData }
}


const restoreSelfHealingWhenApproveChange = (historyState) => {
    let { selfHealingState, JSONData } = historyState;
    restoreSelfHealingListState(selfHealingState);
    const data = mappingJSONObjectToTestData(JSONData);
    setKRData(data);
    clean_panel();
    const selectedTestCase = getSelectedCase();
    const testCaseID = selectedTestCase.id;
    const testCase = findTestCaseById(testCaseID);
    renderTestCaseToRecordGrid(testCase);
}


export {
    captureSelfHealingListState,
    restoreSelfHealingListState,
    captureSelfHealingWhenApproveChange,
    restoreSelfHealingWhenApproveChange
}