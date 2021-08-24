import { getSelectedRecord } from "./selected-records.js";
import { getSelectedCase } from "../testcase-grid/selected-case.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";

function makeTableSortable(table) {
    $(table).sortable({
        axis: "y",
        items: "tr",
        scroll: true,
        revert: 200,
        scrollSensitivity: 20,
        helper: function(e, tr) {
            let $originals = tr.children();
            let $helper = tr.clone();
            $helper.children().each(function(index) {
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        update: function(event, ui) {
            let selectedTestCaseID = getSelectedRecord();
            let selectedTestCase = $(`#${selectedTestCaseID}`);
            //remove old target list
            let datalist = selectedTestCase.find("datalist")[0];
            $(datalist).remove();
            //update new target list
            let valueList = [...$("#target-dropdown").find("tr")].map(element => element.innerText);
            let newDatalist = $('<datalist></datalist>');
            for (let i = 0; i < valueList.length; i++) {
                let option = $("<option></option>").html(valueList[i]);
                newDatalist.append($(option));
            }
            let targetRow = selectedTestCase.children()[1];
            $(targetRow).append($(newDatalist));
        }
    });
}

function getTargetOptionTable(targetList) {
    let optionList = [...$(targetList).find("option")];
    let table = $("<table><tbody></tbody></table>");
    for (let i = 0; i < optionList.length; i++) {
        let tr = $("<tr></tr>");
        $(tr).html(`<td>${targetList.options[i].innerHTML}</td>`);
        $(table).append(tr);
    }
    makeTableSortable(table[0]);
    let div = $("<div></div>");
    $(div).append(table);
    return div[0];
}

// attach event on <tr> (records)
var firstSelectedTrId = undefined;

function attachEvent(start, end) {
    for (var i = start; i <= end; ++i) {
        var node = document.getElementById("records-" + i);

        // sometimes target will be <td> or <tr>
        // click
        node.addEventListener("click", function(event) {
            // use jquery's API to add and remove class property
            if (firstSelectedTrId == undefined && $(".selectedRecord").length > 0) {
                firstSelectedTrId = parseInt($(".selectedRecord")[0].id.substring(8));
            }

            if (!event.ctrlKey && !event.shiftKey) {
                $('#records-grid .selectedRecord').removeClass('selectedRecord');
                firstSelectedTrId = undefined;
            }

            if (event.shiftKey) {
                if (firstSelectedTrId != undefined) {
                    let thisSelectedTrId = parseInt($(this)[0].id.substring(8));
                    $('#records-grid .selectedRecord').removeClass('selectedRecord');
                    if (firstSelectedTrId < thisSelectedTrId) {
                        for (let i = firstSelectedTrId; i < thisSelectedTrId; i++) {
                            $("#records-" + i).addClass("selectedRecord");
                        }

                    } else {
                        for (let i = firstSelectedTrId; i > thisSelectedTrId; i--) {
                            $("#records-" + i).addClass("selectedRecord");
                        }
                    }
                }
            }
            $(".record-bottom").removeClass("active");
            $(this).addClass('selectedRecord');

            var ref = event.target;
            while (ref.tagName.toLowerCase() != "tr") {
                ref = ref.parentNode;
            }

            const selectedTestCase = getSelectedCase();
            const testCase = findTestCaseById(selectedTestCase.id);
            const commandIndex = parseInt(ref.id.substring(8)) - 1;
            const testCommand = testCase.commands[commandIndex];

            // notice that "textNode" also is a node
            document.getElementById("command-command").value = testCommand.name;
            scrape(document.getElementById("command-command").value);
            document.getElementById("command-target").value = testCommand.defaultTarget;
            var targetList = ref.getElementsByTagName("td")[1].getElementsByTagName("datalist")[0].cloneNode(true);
            if (targetList.options[0].text.includes("d-XPath")) {
                targetList.options[0].text = "auto-located-by-tac";
            }
            targetList = getTargetOptionTable(targetList);

            assignChildNodes(document.getElementById("target-dropdown"), targetList, false);
            assignChildNodes(document.getElementById("command-target-list"), ref.getElementsByTagName("td")[1].getElementsByTagName("datalist")[0], true, true);
            document.getElementById("command-value").value = testCommand.value;
        }, false);

        // right click
        node.addEventListener("contextmenu", function(event) {
            // use jquery's API to add and remove class property
            $('#records-grid .selectedRecord').removeClass('selectedRecord');
            $(".record-bottom").removeClass("active");
            $(this).addClass('selectedRecord');

            // show on grid toolbar
            var ref = event.target.parentNode;
            if (ref.tagName != "TR") {
                ref = ref.parentNode;
            }

            const selectedTestCase = getSelectedCase();
            const testCase = findTestCaseById(selectedTestCase.id);
            const commandIndex = parseInt(ref.id.substring(8)) - 1;
            const testCommand = testCase.commands[commandIndex];
            document.getElementById("command-command").value = testCommand.name;
            scrape(document.getElementById("command-command").value);
            document.getElementById("command-target").value = testCommand.defaultTarget;
            var targetList = ref.getElementsByTagName("td")[1].getElementsByTagName("datalist")[0].cloneNode(true);
            if (targetList.options[0].text.includes("d-XPath")) {
                targetList.options[0].text = "auto-located-by-tac";
            }
            targetList = getTargetOptionTable(targetList);
            assignChildNodes(document.getElementById("target-dropdown"), targetList, false);
            assignChildNodes(document.getElementById("command-target-list"), ref.getElementsByTagName("td")[1].getElementsByTagName("datalist")[0], true, true);
            document.getElementById("command-value").value = testCommand.value;
        }, false);
    }
}

export { attachEvent }