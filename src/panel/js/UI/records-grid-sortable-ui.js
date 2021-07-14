import { generateDragAndDropCommand } from "./service/command-generators.js";

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
    // do not forget that textNode is also a node
    document.getElementById("command-command").value = getCommandName(ui.item[0]);
    document.getElementById("command-target").value = getCommandTarget(ui.item[0], true);
    document.getElementById("command-value").value = getCommandValue(ui.item[0]);

    // store command grid to testCase
    var s_case = getSelectedCase();
    if (s_case) {
        sideex_testCase[s_case.id].records = document.getElementById("records-grid").innerHTML;
    }
}

// set testsuite and record-grid sortable
$(document).ready(function () {
    $("#records-grid").sortable({
        axis: "y",
        items: "tr",
        scroll: true,
        revert: 200,
        scrollSensitivity: 20,
        connectWith: "#records-grid",
        helper: function (e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function (index) {
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        update: function (event, ui) {
            dragAndDropAction(event, ui);
        },
        start: function (event, ui) {
            generateDragAndDropCommand().execute();
        }
    }).mousedown(function (){
        //we need to blur all inputs before starting dragging the record
        //otherwise those inputs will be trigger blur/focusout only after we have drop the record
        document.activeElement.blur();
    });
});



