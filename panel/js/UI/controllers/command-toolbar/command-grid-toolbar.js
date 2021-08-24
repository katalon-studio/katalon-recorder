import { findTestCaseById } from "../../services/data-service/test-case-service.js";
import { modifyCaseSuite } from "../../view/records-grid/modify-case-suite.js";
import { getSelectedRecord } from "../../view/records-grid/selected-records.js";
import { getSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { getTargetDatalist, getTdRealValueNode, getTdShowValueNode } from "../../view/records-grid/record-utils.js";

$("#command-command").on("input", function(event) {
    var temp = getSelectedRecord();
    if (temp) {
        var div = getTdRealValueNode(document.getElementById(temp), 0);
        // set innerHTML = ""
        if (div.childNodes && div.childNodes[0]) {
            div.removeChild(div.childNodes[0]);
        }
        div.appendChild(document.createTextNode(event.target.value));

        var command_command = event.target.value;
        div = getTdShowValueNode(document.getElementById(temp), 0);
        if (div.childNodes && div.childNodes[0]) {
            div.removeChild(div.childNodes[0]);
        }
        div.appendChild(document.createTextNode(command_command));

        // store command to in-memory data object
        const s_case = getSelectedCase();
        if (s_case) {
            const testCaseID = s_case.id;
            const testCase = findTestCaseById(testCaseID);
            //record index start with 1
            const commandIndex = parseInt(temp.substring(8)) - 1;
            const testCommand = testCase.commands[commandIndex];
            testCommand.name = command_command;
            modifyCaseSuite();
        }
    }
});

let timeout = null;
$("#command-target").on("input", function(event) {
    var temp = getSelectedRecord();
    if (temp) {
        var div = getTdRealValueNode(document.getElementById(temp), 1);
        // Check hidden value and target value
        if (!(div.childNodes[0] && div.childNodes[0].textContent.includes("d-XPath") && event.target.value.includes("tac"))) {
            var real_command_target = event.target.value;
            if (real_command_target == "auto-located-by-tac") {
                // Real tac value is hidden
                var real_tac = getTargetDatalist(document.getElementById(temp)).options[0].text;
                if (real_tac == "") real_tac = "auto-located-by-tac";
                real_command_target = real_tac;
            }
            if (div.childNodes && div.childNodes[0]) {
                div.removeChild(div.childNodes[0]);
            }
            div.appendChild(document.createTextNode(real_command_target));

            var command_target = event.target.value;
            div = getTdShowValueNode(document.getElementById(temp), 1);
            /* KAT-BEGIN remove tac
            if (command_target.includes("tac")) {
                command_target = "auto-located-by-tac";
            }
            KAT-END */
            if (div.childNodes && div.childNodes[0]) {
                div.removeChild(div.childNodes[0]);
            }
            div.appendChild(document.createTextNode(command_target));
        }
        modifyCaseSuite();

        //need a time out here to make sure user finnish typing before sava new target to in-memory object
        clearTimeout(timeout);
        // store command to in-memory data object
        const s_case = getSelectedCase();
        if (s_case) {
            const testCaseID = s_case.id;
            const testCase = findTestCaseById(testCaseID);
            //record index start with 1
            const commandIndex = parseInt(temp.substring(8)) - 1;
            const testCommand = testCase.commands[commandIndex];
            timeout = setTimeout(function() {
                testCommand.defaultTarget = event.target.value;
                if (!testCommand.targets.includes(event.target.value)) {
                    testCommand.targets.push(event.target.value);
                    //add to datalist on record-grid
                    let datalist = getTargetDatalist(document.getElementById(temp));
                    let option = document.createElement('option');
                    option.innerHTML = event.target.value;
                    datalist.appendChild(option);
                    //add to data list on command target
                    datalist = document.getElementById("command-target-list");
                    option = document.createElement('option');
                    option.innerHTML = event.target.value;
                    datalist.appendChild(option);
                    //add to command target drop down
                    const tbody = $("#target-dropdown tbody")[0];
                    const trElement = document.createElement("tr");
                    const tdElement = document.createElement("td");
                    tdElement.innerHTML = event.target.value;
                    trElement.appendChild(tdElement);
                    tbody.appendChild(trElement)
                }
            }, 500);
            modifyCaseSuite();
        }
    }
});

$("#command-value").on("input", function(event) {
    var temp = getSelectedRecord();
    if (temp) {
        var div = getTdRealValueNode(document.getElementById(temp), 2);
        // set innerHTML = ""
        if (div.childNodes && div.childNodes[0]) {
            div.removeChild(div.childNodes[0]);
        }
        div.appendChild(document.createTextNode(event.target.value));

        var command_value = event.target.value;
        div = getTdShowValueNode(document.getElementById(temp), 2);
        if (div.childNodes && div.childNodes[0]) {
            div.removeChild(div.childNodes[0]);
        }
        div.appendChild(document.createTextNode(command_value));

        const s_case = getSelectedCase();
        if (s_case) {
            const testCaseID = s_case.id;
            const testCase = findTestCaseById(testCaseID);
            //record index start with 1
            const commandIndex = parseInt(temp.substring(8)) - 1;
            const testCommand = testCase.commands[commandIndex];
            testCommand.value = command_value;
            modifyCaseSuite();
        }
    }
});