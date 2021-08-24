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
        start: function(event, ui) {
            ui.placeholder.html(ui.item.html()).css({ "visibility": "visible", "opacity": 0.3 });
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
            deleteTestCase(testCaseElement.id, testCase.id);
            destinationTestSuite.insertNewTestCase(index, testCase);
        }
    });
}

export { makeCaseSortable }