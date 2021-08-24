import { getSelectedSuite } from "./selected-suite.js";
import { createTestSuite, findTestSuiteById } from "../../services/data-service/test-suite-service.js";
import { closeConfirm } from "./close-confirm.js";
import { createTestCase } from "../../services/data-service/test-case-service.js";
import { TestCommand } from "../../models/test-model/test-command.js";
import { renderNewTestSuite } from "./render-new-test-suite.js";
import { renderNewTestCase } from "./render-new-test-case.js";
import { saveData } from "../../services/data-service/save-data.js";
import { downloadSuite } from "../../services/html-service/download-suite.js";


function generateDownloadTestSuiteContextItem(){
  const download_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Download test suite";
  download_suite.appendChild(a);
  download_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    const selectedTestSuite = getSelectedSuite();
    downloadSuite(selectedTestSuite);
  }, false);
  return download_suite;
}

function generateSaveTestSuiteContextItem() {
  const save_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Save test suite";
  save_suite.appendChild(a);
  save_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    saveData();
    const selectedTestSuite = getSelectedSuite();
    [...selectedTestSuite.getElementsByTagName("p")].forEach(testCase => {
      $(testCase).removeClass("modified");

    });
    selectedTestSuite.getElementsByClassName("modified")[0].classList.remove("modified");
  }, false);
  return save_suite;
}

function generateRemoveSuiteContextItem() {
  const remove_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Delete test suite";
  remove_suite.appendChild(a);
  remove_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("close-testSuite").click();
  }, false);
  return remove_suite;
}

function generateCloseAllSuiteContextItem() {
  const close_all_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Delete all test suites";
  close_all_suite.appendChild(a);
  close_all_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("close-all-testSuites").click();
  }, false);
  return close_all_suite;
}

function generateDuplicateTestSuiteContextItem() {
  const duplicate_test_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Duplicate test suite";
  duplicate_test_suite.appendChild(a);
  duplicate_test_suite.addEventListener("click", async function (event) {
    const s_suite = getSelectedSuite();
    const oldTestSuite = findTestSuiteById(s_suite.id);
    if (oldTestSuite) {
      const newTitle = oldTestSuite.name + " copy";
      //duplicate test suite
      const newTestSuite = createTestSuite(newTitle);
      renderNewTestSuite(newTitle, newTestSuite.id);
      for (const oldTestCase of oldTestSuite.testCases) {
        const newTestCase = createTestCase(oldTestCase.name, newTestSuite);
        for (const testCommand of oldTestCase.commands) {
          const newTestCommand = new TestCommand(testCommand.name, testCommand.defaultTarget, testCommand.targets, testCommand.value);
          newTestCase.commands.push(newTestCommand);
        }
        renderNewTestCase(newTestCase.name, newTestCase.id);
      }
    }
  }, false);
  return duplicate_test_suite;
}

function generateRenameTestSuiteContextItem() {
  const rename_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Rename test suite";
  rename_suite.appendChild(a);
  rename_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    let s_suite = getSelectedSuite();
    const testSuiteID = s_suite.id;
    let n_title = prompt("Please enter the Test Suite's name", testSuiteID.name);
    if (n_title) {
      // get text node
      s_suite.getElementsByTagName("STRONG")[0].textContent = n_title;
      $(s_suite).find("strong").addClass("modified");
      closeConfirm(true);

      const testSuiteID = s_suite.id;
      const testSuite = findTestSuiteById(testSuiteID);
      testSuite.name = n_title;
    }
  }, false);
  return rename_suite;
}


const generateTestSuiteContextMenu = (id) => {
  const menu = document.createElement("div");
  menu.setAttribute("class", "menu");
  menu.setAttribute("id", "menu" + id);
  const ul = document.createElement("ul");
  const download_suite = generateDownloadTestSuiteContextItem();
  const rename_suite = generateRenameTestSuiteContextItem();
  const save_suite = generateSaveTestSuiteContextItem();
  const remove_suite = generateRemoveSuiteContextItem();
  const close_all_suite = generateCloseAllSuiteContextItem();
  const duplicate_test_suite = generateDuplicateTestSuiteContextItem();

  ul.appendChild(download_suite);
  ul.appendChild(rename_suite);
  ul.appendChild(save_suite);
  ul.appendChild(remove_suite);
  ul.appendChild(close_all_suite);
  ul.appendChild(duplicate_test_suite);



  menu.appendChild(ul);
  return menu;
}

export { generateTestSuiteContextMenu }