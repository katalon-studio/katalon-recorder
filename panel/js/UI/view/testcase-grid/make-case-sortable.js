import { findTestSuiteById } from "../../services/data-service/test-suite-service.js";
import { deleteTestCase, findTestCaseById } from "../../services/data-service/test-case-service.js";
import { closeConfirm } from "./close-confirm.js";

// make case sortable when addTestSuite
const makeCaseSortable = (suite) => {
    let prevSuite = null;
    $(suite).sortable({
        axis: "y",
        items: "p",
        scroll: true,
        revert: 300,
        scrollSensitivity: 20,
        connectWith: ".message",
        start: function (event, ui) {
            ui.placeholder.html(ui.item.html()).css({ "visibility": "visible", "opacity": 0.3 , "display": "flex"});
            prevSuite = event.target;
        },
        update: function(event, ui) {
            if (prevSuite !== event.target)
                $(prevSuite).find("strong").addClass("modified");
            $(event.target).find("strong").addClass("modified");
            closeConfirm(true);

            const testCaseElement = ui.item[0];
            const destinationTestSuiteElement = ui.item.parent()[0];
            let nextTestCaseSiblingElement = $(testCaseElement).next();
            const testCase = findTestCaseById(testCaseElement.id);
            const destinationTestSuite = findTestSuiteById(destinationTestSuiteElement.id);

            let index = destinationTestSuite.getTestCaseCount();
            if (nextTestCaseSiblingElement.length !== 0) {
                nextTestCaseSiblingElement = nextTestCaseSiblingElement[0];
                const siblingTestCase = findTestCaseById(nextTestCaseSiblingElement.id);
                index = destinationTestSuite.findTestCaseIndexByID(siblingTestCase.id);
            }
            deleteTestCase(testCase.id);
            destinationTestSuite.insertNewTestCase(index, testCase);
        },
        over: function(event, ui){
            const UUIDRegex = /\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}/;
            let target = event.target;
            while (!UUIDRegex.test(target.id) || target.tagName !== "DIV"){
                target = target.parentNode;
            }
            const dropdownButton = target.getElementsByClassName("dropdown")[0];
            const icon = dropdownButton.getElementsByTagName("img")[0];
            if (icon.src.includes("off")){
                $(dropdownButton).click();
            }
        }
    });
}

export { makeCaseSortable }