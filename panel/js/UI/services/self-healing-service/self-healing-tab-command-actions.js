import { getSelectedCase } from "../../view/testcase-grid/selected-case.js"
import { getRecordsArray } from "../../view/records-grid/get-records-array.js"
import { findTestCaseById } from "../data-service/test-case-service.js";
import { getCommandTargets, getTdRealValueNode, getTdShowValueNode } from "../../view/records-grid/record-utils.js";

const deleteSelectSelfHealingProposalsAction = () => {
  let selfHealingList = $("#selfHealingList");
  $(selfHealingList).find("tr.selected").each((index, row) => {
    $(row).remove();
  });
}

const selectAllSelfHealingProposalAction = () => {
  let selfHealingList = $("#selfHealingList");
  $(selfHealingList).find("tr").each((index, row) => {
    if (!$(row).hasClass("selected") && $(row).is(":visible")) {
      $(row).addClass("selected");
    }
  });
}

function changeLocatorOnRecordGrid(brokenLocatorList) {
  const selectedTestCase = getSelectedCase();
  const testCase = findTestCaseById(selectedTestCase.id);
  for (let i = 0; i < testCase.getTestCommandCount(); i++){
    const command = testCase.commands[i];
    let brokerLocatorItem = brokenLocatorList.find(item => {
      return item.brokenLocator === command.defaultTarget && command.targets.includes(item.proposeLocator);
    });
    if (brokerLocatorItem){
      //save to in-memory object
      command.defaultTarget = brokerLocatorItem.proposeLocator;
      //change on UI
      const rowElement = $(`#records-${i+1}`)[0];
      let realValueElement = getTdRealValueNode(rowElement, 1);
      let showValueElement = getTdShowValueNode(rowElement, 1);
      realValueElement.innerHTML = brokerLocatorItem.proposeLocator;
      showValueElement.innerHTML = brokerLocatorItem.proposeLocator;
    }
  }

}

async function changeLocatorOnInMemoryDataObject(brokenLocatorList, testCaseID) {
  const testCase = findTestCaseById(testCaseID);
  for (const command of testCase.commands) {
    for (const brokenLocatorObject of brokenLocatorList) {
      if (brokenLocatorObject.brokenLocator === command.defaultTarget &&
          command.targets.includes(brokenLocatorObject.proposeLocator)) {
        command.defaultTarget = brokenLocatorObject.proposeLocator;
        break;
      }
    }
  }
}

const approveSelfHealingProposalAction = async () => {
  let checkedCheckboxes = $(`:checked[name='approve-change-locator']`);
  let testCaseMap = {};
  for (let checkbox of checkedCheckboxes) {
    let td = checkbox.parentElement;
    let tr = td.parentElement;
    //get values from hidden inputs
    let testCaseID = $(td).find("input[name='testcaseID']")[0].value;
    let brokenLocator = $(td).find("input[name='broken_locator']")[0].value;
    let proposeLocator = $(td).find("input[name='propose_locator']")[0].value;
    //collecting broken locators by test case ID
    if (!testCaseMap[testCaseID]) {
      testCaseMap[testCaseID] = [];
    }
    testCaseMap[testCaseID].push({
      brokenLocator,
      proposeLocator
    })
    $(tr).remove();
  }
  //testCaseMap has the following format
  // {testCaseID1 : [
  //                   {brokenLocator: brokenLocator1, proposeLocator: proposeLocator1},
  //                   {brokenLocator: brokenLocator2, proposeLocator: proposeLocator2},
  //                   .....
  //                ],
  // ......}
  for (let testCaseID of Object.keys(testCaseMap)) {
    let brokenLocatorList = testCaseMap[testCaseID];
    if (getSelectedCase()?.id === testCaseID) {
      //if the test case is being selected, we need to change the target directly on record grid
      //when user switch to another test case, record grid will be saved to sideex_testCase
      changeLocatorOnRecordGrid(brokenLocatorList);
    } else {
      //if the test case is NOT being selected, change directly on in-memory data object
      await changeLocatorOnInMemoryDataObject(brokenLocatorList, testCaseID);
    }
  }
}

const filterSelfHealingProposalByTestCaseStatusAction = (userSelection) => {
  let testCaseStatus;
  let selfHealingList = $("#selfHealingList");
  switch (userSelection) {
    case "All":
      selfHealingList.find("tr").each((index, row) => {
        let approveCheckBox = $(row).find("input[name='approve-change-locator']")[0];
        $(approveCheckBox).prop("checked", true);
      });
      break;
    case "Passed":
    case "Failed":
      selfHealingList.find("tr").each((index, row) => {
        testCaseStatus = $(row).find("td")[1].innerText;
        let approveCheckBox = $(row).find("input[name='approve-change-locator']")[0];
        if (userSelection !== testCaseStatus) {
          $(approveCheckBox).prop("checked", false);
        } else {
          $(approveCheckBox).prop("checked", true);
        }
      });
      break;
  }


}

export {
  deleteSelectSelfHealingProposalsAction,
  selectAllSelfHealingProposalAction,
  approveSelfHealingProposalAction,
  filterSelfHealingProposalByTestCaseStatusAction
}