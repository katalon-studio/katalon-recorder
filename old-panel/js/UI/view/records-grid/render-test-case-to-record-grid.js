import { reAssignId } from "./re-assign-id.js";
import { attachEvent } from "./attach-event.js";

/**
 * render TestCase object data to UI
 * @param {TestCase} testCase
 */
const renderTestCaseToRecordGrid = (testCase) => {
    let recordGridContent = generateRecordGridHTML(testCase);
    if (recordGridContent) {
        clean_panel();
        document.getElementById("records-grid").innerHTML = escapeHTML(recordGridContent);

        let count = testCase.getTestCommandCount();
        if (count !== 0) {
            reAssignId("records-1", "records-" + count);
            attachEvent(1, count);
        }
    } else {
        clean_panel();
    }
}

function generateHTMLOptionList(options) {
    return options.reduce((output, option) => {
        return output + `<option>${option}</option>`
    }, "");
}

function generateRecordGridHTML(testCase) {
    let output = "";
    testCase.commands.forEach(command => {
        let htmlOptionList = generateHTMLOptionList(command.targets);
        let new_tr = '<tr>' + '<td><div style="display: none;">' + command.name + '</div><div style="overflow:hidden;height:15px;">' + command.name + ' </div></td>' + '<td><div style="display: none;">' + command.defaultTarget +
            '</div><div style="overflow:hidden;height:15px;">' + command.defaultTarget + '</div>\n        ' + '<datalist>' + htmlOptionList + '</datalist>' + '</td>' +
            '<td><div style="display: none;">' + command.value + '</div><div style="overflow:hidden;height:15px;">' + command.value + '</div></td>' + '</tr>';
        output = output + new_tr;
    });

    output = '<input id="records-count" value="' + ((!testCase.commands) ? 0 : testCase.commands.length) + '" type="hidden">' + output;
    return output;
}

export { renderTestCaseToRecordGrid };