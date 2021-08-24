import { getSelectedSuite, setSelectedSuite } from "./selected-suite.js";
import { cleanSelected, saveOldCase } from "./utils.js";
import { generateTestSuiteContextMenu } from "./generate-test-suite-context-menu.js";
import { makeCaseSortable } from "./make-case-sortable.js";
import { enableButton } from "../buttons.js";

function generateSaveIcon() {
    function clickHandler(event) {
        event.stopPropagation();
        event.target.parentNode.parentNode.click();
        document.getElementById('save-testSuite').click();
    }

    const saveIcon = document.createElement("i");
    saveIcon.classList.add("fa");
    saveIcon.classList.add("fa-download");
    saveIcon.setAttribute("aria-hidden", "true");
    saveIcon.addEventListener("click", clickHandler);
    $(saveIcon).hide();
    return saveIcon;
}

function generateSuiteTitleElement(title) {
    const text = document.createElement("strong");
    text.classList.add("test-suite-title");
    text.innerHTML = escapeHTML(title);
    return text;
}

function generatePlusIcon() {
    function clickHandler(event) {
        event.stopPropagation();
        event.target.parentNode.parentNode.click();
        document.getElementById('add-testCase').click();
    }

    const plusIcon = document.createElement("i");
    plusIcon.classList.add("fa");
    plusIcon.classList.add("fa-plus");
    plusIcon.classList.add("case-plus");
    plusIcon.setAttribute("aria-hidden", "true");
    plusIcon.addEventListener("click", clickHandler);
    $(plusIcon).hide();
    return plusIcon;
}

function generateTestSuiteHeader() {
    const header = document.createElement("div");
    header.classList.add("test-suite-title");
    return header;
}

function generateTestSuiteContainerElement(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);
    container.setAttribute("contextmenu", "menu" + id);
    container.setAttribute("class", "message");
    container.addEventListener("mouseover", mouseOnAndOutTestSuite);
    container.addEventListener("mouseout", mouseOnAndOutTestSuite);
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
        clean_panel();
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
    const saveIcon = generateSaveIcon();
    const suiteTitle = generateSuiteTitleElement(title);
    const plusIcon = generatePlusIcon();
    const header = generateTestSuiteHeader();
    header.appendChild(saveIcon);
    header.appendChild(suiteTitle);
    header.appendChild(plusIcon);

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

function mouseOnAndOutTestSuite(event) {
    var element = event.target;
    const UUIDRegex = /\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}/;
    while (true) {
        if (element === undefined) {
            return;
        }
        if (UUIDRegex.test(element.id) && !UUIDRegex.test(element.parentNode.id) &&!element.id.includes("menu")) {
            break;
        }

        element = element.parentNode;
    }

    // console.log("element: ", element);
    let display = undefined;
    if (event.type === "mouseover") {
        display = true;
    } else if (event.type === "mouseout") {
        display = false;
    }
    setIconDisplay(display, element);
}

function setIconDisplay(display, element) {
    let plus = element.getElementsByClassName("fa fa-download")[0];
    let download = element.getElementsByClassName("fa fa-plus")[0];
    let color = display ? "rgb(156, 155, 155)": "rgb(223, 223, 223)";
    plus.style.color = color;
    download.style.color = color;
}

export { renderNewTestSuite }