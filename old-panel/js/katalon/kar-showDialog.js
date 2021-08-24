function showDialog(html, showOK) {
    if (waitDialog) {
        waitDialog.dialog('close');
        waitDialog = null;
    }
    var buttons;
    if (showOK) {
        buttons = {
            Close: function() {
                $(this).dialog("close");
            }
        };
    } else {
        buttons = {};
    }
    return $('<div></div>')
        .html(html)
        .dialog({
            title: 'Katalon Recorder',
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: buttons,
            close: function() {
                $(this).remove();
            }
        });
}

function showDialogWithCustomButtons(html, buttons) {
    try {
        var buttons;
        if (!buttons) {
            buttons = {};
        }
        return $('<div></div>')
            .html(html)
            .dialog({
                title: 'Katalon Recorder',
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: buttons,
                close: function() {
                    $(this).remove();
                }
            });
    } catch (err) {
        console.log(err);
    }
}

function showErrorDialog() {
    return showDialog('Something went wrong. Please try again later.', true);
}
