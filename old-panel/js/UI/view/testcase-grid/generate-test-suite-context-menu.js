import { getSelectedSuite } from "./selected-suite.js";
import { findTestSuiteById } from "../../services/data-service/test-suite-service.js";
import { closeConfirm } from "./close-confirm.js";

function generateSaveTestSuiteContextItem() {
  const save_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Save Test Suite to Computer";
  save_suite.appendChild(a);
  save_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById('save-testSuite').click();
  }, false);
  return save_suite;
}

function generateRemoveSuiteContextItem() {
  const remove_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Remove Test Suite from Workspace";
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
  a.textContent = "Remove All Test Suites from Workspace";
  close_all_suite.appendChild(a);
  close_all_suite.addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("close-all-testSuites").click();
  }, false);
  return close_all_suite;
}

function generateAddNewTestCaseContextItem() {
  const add_case = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Add New Test Case";
  add_case.appendChild(a);
  add_case.addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById('add-testCase').click();
  }, false);
  return add_case;
}

function generateRenameTestSuiteContextItem() {
  const rename_suite = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.textContent = "Rename Test Suite";
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
  const save_suite = generateSaveTestSuiteContextItem();
  const remove_suite = generateRemoveSuiteContextItem();
  const close_all_suite = generateCloseAllSuiteContextItem();
  const add_case = generateAddNewTestCaseContextItem();
  const rename_suite = generateRenameTestSuiteContextItem();
  ul.appendChild(save_suite);
  ul.appendChild(remove_suite);
  ul.appendChild(close_all_suite);
  ul.appendChild(add_case);
  ul.appendChild(rename_suite);
  menu.appendChild(ul);
  return menu;
}

export { generateTestSuiteContextMenu }