import { selfHealingContextMenu } from "./self-healing-context-menu.js";
import { isSelfHealingTabDisplay } from "../../services/self-healing-service/utils.js";
import { getSelectedCase } from "../testcase-grid/selected-case.js";
import { getRecordsArray } from "../records-grid/get-records-array.js";
import { getCommandTargets, getTdShowValueNode } from "../records-grid/record-utils.js";

/**
 * @param {object} brokenLocatorTestStep: information about a test step that has a broken locator
 *                                        format:
 *                                        {
 *                                              broken_locator: String
 *                                              propose_locator: String
 *                                              record: <tr> element on record grid
 *                                              testCase: <p> element on testcase panel
 *                                        }
 * add broken locator test step to self healing tab
 */
const addBrokenLocatorToSelfHealingTab = (brokenLocatorTestStep) => {
    let selfHealingList = $("#selfHealingList");
    let resultRow = $(`<tr>
                        <td>
                            ${brokenLocatorTestStep.testCase.childNodes[0].innerHTML}
                        </td>
                        <td>Executing...</td>
                        <td>${brokenLocatorTestStep.broken_locator}</td>
                        <td>${brokenLocatorTestStep.propose_locator}</td>
                        <td>
                            <input type="hidden" name="testcaseID"/>
                            <input type="hidden" name="broken_locator"/>
                            <input type="hidden" name="propose_locator"/>
                            <input type="checkbox" name="approve-change-locator"/>
                        </td>
                    </tr>`);
    //set value for hidden input
    $(resultRow).find("input[name='testcaseID']").val(brokenLocatorTestStep.testCase.id);
    $(resultRow).find("input[name='broken_locator']").val(brokenLocatorTestStep.broken_locator);
    $(resultRow).find("input[name='propose_locator']").val(brokenLocatorTestStep.propose_locator);
    selfHealingList.append(resultRow);
    attachEvent(resultRow);
    if (!isSelfHealingTabDisplay()) {
        $('#self-healing').click();
    }
}


const addBrokenLocator = (testCaseID, brokenLocator, proposedLocator) => {
    let selfHealingList = $("#selfHealingList");
    let obj = {
        broken_locator: brokenLocator,
        propose_locator: proposedLocator,
        record: undefined,
        testCase: $(`#${testCaseID}`)[0]
    }
    if (selfHealingList.find("tr").length === 0) {
        addBrokenLocatorToSelfHealingTab(obj);
        return;
    }
    let isDuplicate = false;
    selfHealingList.find("tr").each((index, element) => {
        let rowTestCaseID = $(element).find("td input[name='testcaseID']")[0].value;
        let rowBrokenLocator = $(element).find("td input[name='broken_locator']")[0].value;
        let rowProposedLocator = $(element).find("td input[name='propose_locator']")[0].value;
        if (rowTestCaseID === testCaseID &&
            rowBrokenLocator === brokenLocator &&
            rowProposedLocator === proposedLocator) {
            isDuplicate = true;
            return false;
        }
    });
    if (!isDuplicate) {
        addBrokenLocatorToSelfHealingTab(obj);
    }
}


/**
 * update test case status after a test case have just finished executed
 */
const updateTestCaseStatusUI = () => {
    let selfHealingList = $("#selfHealingList");
    selfHealingList.find("tr").each((index, element) => {
        let testCaseID = $(element).find("td input")[0].value;
        let testCaseElement = $(`#${testCaseID}`);
        if (testCaseElement.hasClass("success")) {
            $(element).find("td")[1].innerHTML = "Passed";
        } else if (testCaseElement.hasClass("fail")) {
            $(element).find("td")[1].innerHTML = "Failed";
        } else {
            $(element).find("td")[1].innerHTML = "Executing...";
        }
    });
}


/**
 * attach event for new self healing row
 * @param {Element} row: the <tr> element that need attach event to.
 */
const attachEvent = (row) => {
    $(row).click(async function(e) {
        let selfHealingList = $("#selfHealingList");
        if (!e ?.originalEvent?.shiftKey) {
            //allow multiple selection
            selfHealingList.find(".selected").each((index, element) => {
                $(element).removeClass("selected");
            });
        }
        $(row).addClass("selected");

        let approveColumn = $(row).find("td")[4];
        let testCaseID = $(approveColumn).find("input[name='testcaseID']")[0].value;
        let brokenLocator = $(approveColumn).find("input[name='broken_locator']")[0].value;
        let proposeLocator = $(approveColumn).find("input[name='propose_locator']")[0].value;
        if (getSelectedCase()?.id === testCaseID) {
            let records = [...getRecordsArray()];
            let firstElement;
            for (let element of records) {
                let showValueElement = getTdShowValueNode(element, 1);
                let optionList = getCommandTargets(element);
                if (showValueElement.innerHTML === brokenLocator && optionList.includes(proposeLocator)) {
                    if (!firstElement) {
                        firstElement = element;
                    }
                    $(element).addClass("selectedRecord");
                } else {
                    if ($(element).hasClass("selectedRecord") && !e?.originalEvent?.shiftKey) {
                        $(element).removeClass("selectedRecord");
                    }
                }
            }
            firstElement?.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
            });
        } else {
            $(`#${testCaseID}`).click();
            $(row).click();
        }
    });
    $(row).on("contextmenu", function(e) {
        e.preventDefault();
        $(row).addClass("selected");
        $("#self-healing-context-menu").css("left", e.pageX).css("top", e.pageY);
        selfHealingContextMenu.show();
    })
}

export { addBrokenLocator, attachEvent, updateTestCaseStatusUI }