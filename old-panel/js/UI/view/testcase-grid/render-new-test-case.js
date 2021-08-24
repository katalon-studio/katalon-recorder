import { getSelectedCase, setSelectedCase } from "./selected-case.js";
import { getSelectedSuite } from "./selected-suite.js";
import { cleanSelected, saveOldCase } from "./utils.js";
import { generateTestCaseContextMenu } from "./generate-test-case-context-menu.js";
import { saveData } from "../../services/data-service/save-data.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";
import { renderTestCaseToRecordGrid } from "../records-grid/render-test-case-to-record-grid.js";
import { enableButton } from "../buttons.js";
import { closeConfirm } from "./close-confirm.js";

function generateTestCaseContainerElement(id) {
    const container = document.createElement("p");
    container.setAttribute("id", id);
    container.setAttribute("contextmenu", "menu" + id);
    container.classList.add("test-case-title");
    return container;
}

function generateTestCaseTitle(title) {
    const testCaseTitle = document.createElement("span");
    testCaseTitle.innerHTML = escapeHTML(title);
    return testCaseTitle;
}

function clickHandler(event) {
    event.stopPropagation();
    saveOldCase();
    saveData();
    // use jquery's API to add and remove class property
    cleanSelected();
    this.classList.add("selectedCase");
    this.parentNode.classList.add("selectedSuite");
    clean_panel();
    const testCaseID = this.id;
    const testCase = findTestCaseById(testCaseID);
    renderTestCaseToRecordGrid(testCase);
    if (testCase.getTestCommandCount() > 0) {
        document.getElementById("records-1").scrollIntoView({
            behavior: 'auto',
            block: 'center',
        });
    }
}

function contextMenuHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    saveOldCase();
    setSelectedCase(this.id);
    let mid = "#" + "menu" + this.id;
    $(".menu").css("left", event.pageX).css("top", event.pageY);
    $(mid).show();
}

const renderNewTestCase = (title, id) => {
    const container = generateTestCaseContainerElement(id);
    const testCaseTitle = generateTestCaseTitle(title);
    container.appendChild(testCaseTitle);

    const selectedTestCase = getSelectedCase();
    if (selectedTestCase) {
        selectedTestCase.parentNode.insertBefore(container, selectedTestCase.nextSibling);
    } else {
        getSelectedSuite().appendChild(container);
    }
    //set added test case and its test suite as selected
    cleanSelected();
    container.classList.add("selectedCase");
    const menu = generateTestCaseContextMenu(id);
    container.parentNode.classList.add("selectedSuite");
    container.appendChild(menu);
    clean_panel();

    //attach event
    container.addEventListener("click", clickHandler);
    container.addEventListener("contextmenu", contextMenuHandler);

    addContextMenuButton(id, container, menu, true);
    closeConfirm(true);
    // enable play button
    enableButton("playback");
}

export { renderNewTestCase }