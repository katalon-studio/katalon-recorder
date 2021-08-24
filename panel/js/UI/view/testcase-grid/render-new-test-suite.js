import { getSelectedSuite, setSelectedSuite } from "./selected-suite.js";
import { cleanSelected, saveOldCase } from "./utils.js";
import { generateTestSuiteContextMenu } from "./generate-test-suite-context-menu.js";
import { makeCaseSortable } from "./make-case-sortable.js";
import { enableButton } from "../buttons.js";

function generateSuiteTitleElement(title) {
  const text = document.createElement("strong");
  text.classList.add("test-suite-title");
  text.innerHTML = escapeHTML(title);
  return text;
}


function testSuiteDropdownOpen(testSuiteID) {
  const testSuiteContainer = $(`#${testSuiteID}`)[0];
  const dropdownIcon = testSuiteContainer
    .getElementsByClassName("dropdown")[0]
    .getElementsByTagName("img")[0];
  $(dropdownIcon).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
  [...$(testSuiteContainer).find("p")].forEach(element => {
    $(element).css("display", "flex");
  });
}

function testSuiteDropdownClose(testSuiteID) {
  const testSuiteContainer = $(`#${testSuiteID}`)[0];
  const dropdownIcon = testSuiteContainer
    .getElementsByClassName("dropdown")[0]
    .getElementsByTagName("img")[0];
  $(dropdownIcon).attr("src", "/katalon/images/SVG/dropdown-arrow-off.svg");
  [...$(testSuiteContainer).find("p")].forEach(element => {
    $(element).css("display", "none");
  });
}


function testSuiteDropdownHandler(event) {
  const image = $(this).find("img");
  const src = $(image).attr("src");
  const id = this.parentNode.parentNode.id;
  if (src.includes("off")) {
    testSuiteDropdownOpen(id);
  } else {
    testSuiteDropdownClose(id);
  }
}

function generateDropdownIcon() {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  dropdown.addEventListener("click", testSuiteDropdownHandler);
  let icon = document.createElement("img");
  icon.setAttribute("src", "/katalon/images/SVG/dropdown-arrow-off.svg");
  dropdown.appendChild(icon);
  return dropdown;
}

function generateTestSuiteIcon() {
  const testSuiteIconDiv = document.createElement("div");
  testSuiteIconDiv.classList.add("testSuiteIcon");
  const icon = document.createElement("img");
  icon.setAttribute("src", "/katalon/images/SVG/paper-icon.svg");
  testSuiteIconDiv.appendChild(icon);
  return testSuiteIconDiv
}

function generateAddTestCaseIcon() {
  const testCasePlusDiv = document.createElement("div");
  testCasePlusDiv.classList.add("test-case-plus");
  const img = document.createElement("img");
  img.src = "/katalon/images/SVG/add-icon.svg";
  testCasePlusDiv.appendChild(img);

  testCasePlusDiv.addEventListener("click", function (event) {
    $('#add-testCase').click();
  });
  return testCasePlusDiv;
}

function generateTestSuiteHeader() {
  const header = document.createElement("div");
  header.classList.add("test-suite-header");
  return header;
}

function generateTestSuiteContainerElement(id) {
  const container = document.createElement("div");
  container.setAttribute("id", id);
  container.setAttribute("contextmenu", "menu" + id);
  container.setAttribute("class", "message");
  return container;
}

function clickHandler(event) {
  if (this.getElementsByTagName("p").length !== 0) {
    this.getElementsByTagName("p")[0].click();
  } else {
    event.stopPropagation();
    saveOldCase();
    cleanSelected();
    this.classList.add("selectedSuite");
    //select first test case
    const testCaseList = this.getElementsByTagName("p");
    if (testCaseList.length > 0){
      $(testCaseList[0]).click();
    }
  }
}

function contextMenuHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  saveOldCase();
  setSelectedSuite(this.id);
  let mid = "#" + "menu" + this.id;
  $(".menu").css("left", event.pageX).css("top", event.pageY);
  $(mid).show();
}


const renderNewTestSuite = (title, id) => {
  const dropdown = generateDropdownIcon();
  const testSuiteIcon = generateTestSuiteIcon();
  const suiteTitle = generateSuiteTitleElement(title);
  const addTestCase = generateAddTestCaseIcon();
  const header = generateTestSuiteHeader();
  header.appendChild(dropdown);
  header.appendChild(testSuiteIcon);
  header.appendChild(suiteTitle);
  header.appendChild(addTestCase);

  const container = generateTestSuiteContainerElement(id);
  container.append(header);

  //append new test suite container to testCase-grid
  let selectedTestSuite = getSelectedSuite();
  if (selectedTestSuite) {
    selectedTestSuite.parentNode.insertBefore(container, selectedTestSuite.nextSibling);
  } else {
    document.getElementById("testCase-grid").appendChild(container);
  }
  //set added test suite as selected
  cleanSelected();
  container.classList.add("selectedSuite");
  const menu = generateTestSuiteContextMenu(id);
  container.appendChild(menu);
  // attach event
  container.addEventListener("click", clickHandler);
  container.addEventListener("contextmenu", contextMenuHandler);


  makeCaseSortable(container);
  //add context menu button
  addContextMenuButton(id, header, menu, false);
  // enable play button
  enableButton("playSuites");
  enableButton("playSuite");
}


export { renderNewTestSuite, testSuiteDropdownOpen }