// set testsuite and record-grid sortable
$(document).ready(function () {
    $("#testCase-container").sortable({
        axis: "y",
        handle: "strong",
        items: ".message",
        scroll: true,
        revert: 300,
        scrollSensitivity: 20,
        start: function (event, ui) {
            ui.placeholder.height(ui.item.height());
        }
    });
});