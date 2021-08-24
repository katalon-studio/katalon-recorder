import { getSelectedSuite } from "./selected-suite.js";
import { getSelectedCase } from "./selected-case.js";
import { initAllSuite, playTestSuiteAction } from "../../../background/playback/service/actions/play/play-actions.js"
import { saveData } from "../../services/data-service/save-data.js";
import { removeDirtyMarks } from "./remove-dirty-mark.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";

function generateAddNewTestCaseContextItem() {
    const add_case = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Add New Test Case";
    add_case.appendChild(a);
    add_case.addEventListener("click", function(event) {
        event.stopPropagation();
        document.getElementById('add-testCase').click();
    }, false);
    return add_case;
}

function generateRemoveTestCaseContextItem() {
    const remove_case = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Remove Test Case from Workspace";
    remove_case.appendChild(a);
    remove_case.addEventListener("click", function(event) {
        event.stopPropagation();
        document.getElementById('delete-testCase').click();
    }, false);
    return remove_case;
}

function generateRenameTestCaseContextItem() {
    const rename_case = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Rename Test Case";
    rename_case.appendChild(a);
    rename_case.addEventListener("click", function(event) {
        event.stopPropagation();
        let s_case = getSelectedCase();
        const testCaseID = s_case.id
        const testCase = findTestCaseById(testCaseID);
        let n_title = prompt("Please enter the Test Case's name", testCase.name);
        if (n_title) {
            // get text node
            s_case.childNodes[0].textContent = n_title;

            const testCaseID = s_case.id;
            const testCase = findTestCaseById(testCaseID);
            testCase.name = n_title;
        }
    }, false);
    return rename_case;
}

function generatePlayCaseFromHereContextItem() {
    const play_case_from_here = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Play From Here";
    play_case_from_here.appendChild(a);
    play_case_from_here.addEventListener("click", async function() {
        saveData();
        emptyNode(document.getElementById("logcontainer"));
        document.getElementById("result-runs").textContent = "0";
        document.getElementById("result-failures").textContent = "0";
        recorder.detach();
        initAllSuite();
        //focus on window when playing test suite
        if (contentWindowId) {
            browser.windows.update(contentWindowId, { focused: true });
        }
        declaredVars = {};
        clearScreenshotContainer();

        let cases = getSelectedSuite().getElementsByTagName("p");
        let i = 0;
        while (i < cases.length) {
            let s_case = getSelectedCase();
            if (cases[i].id === s_case.id) {
                break;
            }
            i++;
        }
        playTestSuiteAction(i, false);
    }, false);
    return play_case_from_here;
}

function generateSaveCaseContextItem() {
    const save_case = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Save Test Case";
    save_case.appendChild(a);
    save_case.addEventListener("click", function(event) {
        event.stopPropagation();
        saveData();
        removeDirtyMarks('context')
    }, false);
    return save_case;
}

function generateSaveCaseAsContextItem() {
    const save_case_as = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = "Save Test Case As";
    save_case_as.appendChild(a);
    save_case_as.addEventListener("click", function(event) {
        event.stopPropagation();
        document.getElementById('save-testSuite').click();
    }, false);
    return save_case_as;
}

const generateTestCaseContextMenu = (id) => {
    const menu = document.createElement("div");
    menu.setAttribute("class", "menu");
    menu.setAttribute("id", "menu" + id);
    const ul = document.createElement("ul");
    const add_case = generateAddNewTestCaseContextItem();
    const remove_case = generateRemoveTestCaseContextItem();
    const rename_case = generateRenameTestCaseContextItem();
    const play_case_from_here = generatePlayCaseFromHereContextItem();
    const save_case = generateSaveCaseContextItem();
    const save_case_as = generateSaveCaseAsContextItem();
    ul.appendChild(add_case);
    ul.appendChild(remove_case);
    ul.appendChild(rename_case);
    ul.appendChild(play_case_from_here);
    ul.appendChild(save_case);
    ul.appendChild(save_case_as);
    menu.appendChild(ul);
    return menu;
}

export { generateTestCaseContextMenu }