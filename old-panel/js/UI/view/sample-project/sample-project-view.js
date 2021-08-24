import {
    addSampleData,
    sampleData,
    sampleDataTrackingService
} from "../../services/sample-project/sample-project-service.js";
import { displayNewTestSuite } from "../testcase-grid/display-new-test-suite.js";

function generateDialogHTML(sampleData) {
    return sampleData.reduce((html, data, index) => {
        return html + `<div id="sample-${index}" style="text-align: center">
                        <h3>${data.projectName}</h3>
                        <p>${data.description}</p>
                    </div>`
    }, "");
}

async function addSample() {
    let selectedSample = $("#sample-project-dialog .selected");
    if (selectedSample.length === 0) {
        return;
    }
    const selectedSampleIndexes = [];
    //get index of selected sample from user
    $(selectedSample).each((index, element) => {
        const id = parseInt(element.id.substring(7));
        selectedSampleIndexes.push(id);
    });
    //add sample data to in-memory KRData object
    const sampleTestSuites = addSampleData(sampleData, selectedSampleIndexes);
    //display to testCase-grid
    for (let i = 0; i < sampleTestSuites.length; i++) {
        displayNewTestSuite(sampleTestSuites[i]);
    }
    //tracking
    await sampleDataTrackingService(sampleData, selectedSampleIndexes);
}

function attachEvent() {
    $("#sample-project-dialog div").click(function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        } else {
            $(this).addClass("selected");
        }
    });
}

const displaySampleProjectDialog = () => {
    const html = generateDialogHTML(sampleData);
    $("#sample-project").click(function() {
        if ($("#sample-project:visible").length !== 0) {
            $("#helpDialog").dialog("close");
        }
        let dialog = $("#sample-project-dialog");
        if (dialog.length) {
            $(dialog).dialog("open");
            return;
        }
        $('<div id="sample-project-dialog"></div>').dialog({
            title: "Sample Projects",
            autoOpen: true,
            resizable: false,
            width: 700,
            maxHeight: 450,
            modal: true,
            closeText: "Close",
            position: { my: "top+15%", at: "top+15%", of: window },
            buttons: {
                "Add": {
                    text: "Add",
                    id: "add-sample-project",
                    click: () => {
                        $("#sample-project-dialog").dialog("close");
                        addSample();
                    }
                }
            },
            open: function() {
                $('.ui-dialog-titlebar-close')
                    .removeClass("ui-dialog-titlebar-close ui-button ui-corner-all ui-widget ui-button-icon-only")
                    .attr("id", "close-sample-data-dialog")
                    .html('<span style="float:right;"></span>');
            }
        }).html(html);
        attachEvent();
    });
}

export { displaySampleProjectDialog }