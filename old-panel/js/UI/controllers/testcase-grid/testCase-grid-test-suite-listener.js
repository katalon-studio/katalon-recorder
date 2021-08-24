import { getSelectedSuite, setSelectedSuite } from "../../view/testcase-grid/selected-suite.js";
import { downloadSuite } from "../../services/html-service/download-suite.js";
import {
    createTestSuite,
    deleteTestSuite,
    findTestSuiteById,
    getTestSuiteCount,
    getTextSuiteByIndex
} from "../../services/data-service/test-suite-service.js";
import { displayConfirmCloseDialog } from "../../view/testcase-grid/display-confirm-close-suite-dialog.js";
import { renderNewTestSuite } from "../../view/testcase-grid/render-new-test-suite.js";
import { checkLoginOrSignupUser } from "../../../../../content-marketing/panel/login-inapp.js";
import { disableButton } from "../../view/buttons.js";
import { saveData } from "../../services/data-service/save-data.js";


function removeTestSuite(suiteContainerElement) {
    suiteContainerElement.parentElement.removeChild(suiteContainerElement);
    clean_panel();
    saveData();
    const testSuiteID = suiteContainerElement.id;
    deleteTestSuite(testSuiteID);
    //disable play button if there are no test suites left
    if (getTestSuiteCount() === 0) {
        disableButton("playback");
        disableButton("playSuite");
        disableButton("playSuites");
    }
}


async function closeTestSuite(suiteContainerElement) {
    const testSuiteID = suiteContainerElement.id;
    setSelectedSuite(testSuiteID);
    const testSuite = findTestSuiteById(testSuiteID);
    const html = `<div style="color:red;">This action will remove your test suite and changes made to your test suite permanently, 
                you can open it again only if a copy is available on your computer.</div>
        </br>
        <div>Save the ${testSuite.name} test suite to your computer?"</div>`;
    let userAnswer = await displayConfirmCloseDialog(html);
    if (userAnswer === "true") {
        downloadSuite(suiteContainerElement, function() {
            removeTestSuite(suiteContainerElement);
        })
    } else {
        removeTestSuite(suiteContainerElement);
    }
}

$(document).ready(function() {
    $("#save-testSuite").click(function(event) {
        event.stopPropagation();
        const s_suite = getSelectedSuite();
        downloadSuite(s_suite);
    });

    $("#close-testSuite").click(async function() {
        const testSuiteContainerElement = getSelectedSuite();
        await closeTestSuite(testSuiteContainerElement);
    });

    $("#close-all-testSuites").click(async function(event) {
        while (getTestSuiteCount() !== 0) {
            const testSuite = getTextSuiteByIndex(0);
            const testSuiteContainerElement = $(`#${testSuite.id}`)[0];
            await closeTestSuite(testSuiteContainerElement);
        }
    });
    $("#add-testSuite").click(async function(event) {
        event.stopPropagation();
        const title = prompt("Please enter the Test Suite's name", "Untitled Test Suite");
        if (title) {
            //make sure user login and sign up after threshold before making new test case
            if (!(await checkLoginOrSignupUser())) {
                return;
            }
            const testSuite = createTestSuite(title);
            renderNewTestSuite(title, testSuite.id);
        }
    })

    $("#add-testSuite-menu").click(function(event) {
        event.stopPropagation();
        document.getElementById('add-testSuite').click();
    });

    $("#suite-plus").click(function(event) {
        event.stopPropagation();
        document.getElementById("add-testSuite").click();
    });

    $("#suite-open").click(function(event) {
        event.stopPropagation();
        document.getElementById("load-testSuite-hidden").click();
    });
});