import { getCommandTargetOptions } from "./utils.js";

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

async function changeCommandTarget(rowElement, brokenLocatorList) {
  let realValueElement = getTdRealValueNode(rowElement, 1);
  let showValueElement = getTdShowValueNode(rowElement, 1);
  let oldTarget = realValueElement.innerHTML;
  let optionList = await getCommandTargetOptions(rowElement, false);
  let brokerLocatorItem = brokenLocatorList.find(item => {
    return item.brokenLocator === oldTarget && optionList.includes(item.proposeLocator);
  });
  if (brokerLocatorItem) {
    let proposeLocator = brokerLocatorItem.proposeLocator;
    realValueElement.innerHTML = proposeLocator;
    showValueElement.innerHTML = proposeLocator;
  }
}

async function changeLocatorOnRecordGrid(brokenLocatorList) {
  let records = [...getRecordsArray()];
  for (let record of records){
    await changeCommandTarget(record, brokenLocatorList);
  }
}

async function changeLocatorOnSideex(brokenLocatorList, testCaseID) {
  let doc = $("<tbody></tbody>")
  doc.html(escapeHTML(sideex_testCase[testCaseID].records));
  for (let element of $(doc).find("tr")){
    await changeCommandTarget(element, brokenLocatorList);
  }
  sideex_testCase[testCaseID].records = doc[0].innerHTML;
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
    if (getSelectedCase().id === testCaseID) {
      //if the test case is being selected, we need to change the target directly on record grid
      //when user switch to another test case, record grid will be saved to sideex_testCase
      await changeLocatorOnRecordGrid(brokenLocatorList);
    } else {
      //if the test case is NOT being selected, change directly on sideex_testCase
      await changeLocatorOnSideex(brokenLocatorList, testCaseID);
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