import { generateDragAndDropCommand } from "../../services/records-grid-service/command-generators.js";
import { getSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";
import { reAssignId } from "../../view/records-grid/re-assign-id.js";
import { getSelectedSuite } from "../../view/testcase-grid/selected-suite.js";
import { closeConfirm } from "../../view/testcase-grid/close-confirm.js";

function dragAndDropAction(event, ui) {
    getSelectedCase().classList.add("modified");
    getSelectedSuite().getElementsByTagName("strong")[0].classList.add("modified");
    closeConfirm(true);

    // re-assign id
    var start_ID = ui.item.attr("id"),
        end_ID = ui.item.prev().attr("id");
    reAssignId(start_ID, (end_ID.includes("count") ? "records-0" : (end_ID)));

    // show in command-toolbar
    $('#records-grid .selectedRecord').removeClass('selectedRecord');
    $(".record-bottom").removeClass("active");
    ui.item.addClass('selectedRecord');

    //store change in in-memory data object
    const selectedTestCase = getSelectedCase();
    const testCaseID = selectedTestCase.id;
    const testCase = findTestCaseById(testCaseID);
    //record element id start with 1
    const startIndex = parseInt(start_ID.substring(8)) - 1;
    const endIndex = parseInt(end_ID.substring(8)) - 1;
    //change command order
    const testCommand = testCase.removeCommandAtIndex(startIndex);
    testCase.insertCommandToIndex(endIndex, testCommand);

    //display values command toolbar
    document.getElementById("command-command").value = testCommand.name
    document.getElementById("command-target").value = testCommand.defaultTarget;
    document.getElementById("command-value").value = testCommand.value;
}

// set testsuite and record-grid sortable
$(document).ready(function() {
    $("#records-grid").sortable({
        axis: "y",
        items: "tr",
        scroll: true,
        revert: 200,
        scrollSensitivity: 20,
        connectWith: "#records-grid",
        helper: function(e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index) {
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        update: function(event, ui) {
            dragAndDropAction(event, ui);
        },
        start: function(event, ui) {
            generateDragAndDropCommand().execute();
        }
    }).mousedown(function() {
        //we need to blur all inputs before starting dragging the record
        //otherwise those inputs will be trigger blur/focusout only after we have drop the record
        document.activeElement.blur();
    });
});