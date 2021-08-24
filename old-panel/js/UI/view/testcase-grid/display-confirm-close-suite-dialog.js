const displayConfirmCloseDialog = question => {
    return new Promise(resolve => {
        $('<div></div>')
            .html(question)
            .dialog({
                title: "Warning! Possible data loss",
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Yes": function() {
                        $(this).dialog("close");
                        resolve("true");
                    },
                    "No, delete my data": function() {
                        $(this).dialog("close");
                        resolve("false");
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                },
                close: function() {
                    $(this).remove();
                }
            });
    })
};

export { displayConfirmCloseDialog }