import { checkLoginOrSignupUser } from "../../../../../content-marketing/panel/login-inapp.js";
import { createTestCase, deleteTestCase } from "../../services/data-service/test-case-service.js";
import { getSelectedSuite } from "../../view/testCase-grid/selected-suite.js";
import { createTestSuite, findTestSuiteById } from "../../services/data-service/test-suite-service.js";
import { renderNewTestSuite } from "../../view/testcase-grid/render-new-test-suite.js";
import { renderNewTestCase } from "../../view/testcase-grid/render-new-test-case.js";
import { getSelectedCase } from "../../view/testCase-grid/selected-case.js";
import { displayConfirmCloseDialog } from "../../view/testcase-grid/display-confirm-close-suite-dialog.js";
import { disableButton } from "../../view/buttons.js";
import { downloadSuite } from "../../services/html-service/download-suite.js";


async function trackingCheckLogin() {
  let data = await browser.storage.local.get("checkLoginData");
  data.checkLoginData.testCreated++;
  await browser.storage.local.set(data);
}

function removeTestCase(testCaseContainerElement) {
  testCaseContainerElement.parentNode.removeChild(testCaseContainerElement);
  clean_panel();
  const testCaseID = testCaseContainerElement.id;
  deleteTestCase(testCaseID);
}

function mouseOnSuiteTitleIcon(event) {
  let tempElement = getMouseActionElement(event.target);
  if (tempElement == null) {
    return;
  }
  tempElement.style.color = "rgb(106, 105, 105)";
}

function mouseOutSuiteTitleIcon(event) {
  let tempElement = getMouseActionElement(event.target);
  if (tempElement == null) {
    return;
  }
  tempElement.style.color = "rgb(167, 167, 167)";
}

function getMouseActionElement(target) {
  let tagName = target.tagName;
  if (tagName === "DIV") {
    // NOTE: id will be suite-open or suite-plus
    return $("i." + target.id)[0];
  } else if (tagName === "I") {
    return target;
  }
  return null;
}


$(document).ready(function () {
  $("#suite-plus").mouseover(mouseOnSuiteTitleIcon).mouseout(mouseOutSuiteTitleIcon);
  $("#suite-open").mouseover(mouseOnSuiteTitleIcon).mouseout(mouseOutSuiteTitleIcon);

  $("#add-testCase").click(async function () {
    const testCaseTitle = prompt("Please enter the Test Case's name", "Untitled Test Case");
    if (testCaseTitle) {
      //make sure user login and sign up after threshold before making new test case
      if (!(await checkLoginOrSignupUser())) {
        return;
      }
      trackingCheckLogin();
      let selectedTestSuite = getSelectedSuite();
      let testSuite;
      if (!selectedTestSuite) {
        //if there are no test suits, create new one
        testSuite = createTestSuite("Untitled Test Suite");
        renderNewTestSuite("Untitled Test Suite", testSuite.id);
      } else {
        //get test suite data object from in-memory data object
        const testSuiteID = selectedTestSuite.id;
        testSuite = findTestSuiteById(testSuiteID);
      }
      const testCase = createTestCase(testCaseTitle, testSuite);
      renderNewTestCase(testCaseTitle, testCase.id);
    }
  });
  $("#delete-testCase").click(async function () {
    const selectedCase = getSelectedCase();
    const selectedSuite = getSelectedSuite();
    if (selectedCase) {
      let html = `<div style="color:red">This action will remove your test case or changes made to your test case permanently, you can open it again only if a copy is available on your computer.</div>
            </br>
            <div>Save this test case to your computer?</div>`;
      let userAnswer = await displayConfirmCloseDialog(html);
      if (userAnswer === "true")
        downloadSuite(selectedSuite, function () {
          removeTestCase(selectedCase);
        });
      else removeTestCase(selectedCase);
      // disable play button when there are no test cases left.
      const testSuiteID = selectedSuite.id;
      const testSuite = findTestSuiteById(testSuiteID);
      if (testSuite.getTestCaseCount() === 0) {
        disableButton("playback");
      }
    }
  });
})