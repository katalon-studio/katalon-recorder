const html = `
    <div style="color:red">
        Do you want to save your setting?
    </div>
`;

function displayConfirmCloseDialog() {
    function displayDialog(resolve) {
        let dialog = $('<div id="confirm-close-dialog"></div>')
            .html(html)
            .dialog({
                title: "Are you sure?",
                resizable: false,
                height: "auto",
                width: 450,
                modal: true,
                buttons: {
                    "Yes": function () {
                        resolve("yes");
                        $(dialog).dialog("close");
                    },
                    "No": function () {
                        resolve("no");
                        $(dialog).dialog("close");
                    },
                    Cancel: function () {
                        $(dialog).dialog("close");
                    }

                },
                close: function () {
                    $(this).remove();
                },
            });
    }

    return new Promise(resolve => {
        displayDialog(resolve);
    });
}

export {displayConfirmCloseDialog}