import {
    generateDropdownCommandToolbarCommand,
    generateEditCommandToolbarCommand, generateEditTargetToolbarCommand
} from "./service/command-generators.js";
import {resetFocus} from "./service/state-actions.js";

function saveWhenInsideInput(event){
    //capture Ctrl+S when inside input
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }
    if (event.ctrlKey || event.metaKey) {
        if (keyNum === 83 || keyNum === 229){
            //disable browser default Ctrl + S event handler
            event.preventDefault();
            event.stopPropagation();
            const element = event.target;
            $(element).blur();
            saveDataAndRemoveDirtyMarks(event);
            resetFocus();
        }
    }
}

$(function(){
    $("#command-command").on("focusin", function (e) {
        let ID = getSelectedRecord();
        $(this).data('oldVal', $(this).val());
        $(this).data('ID', ID);
    }).on("focusout", function (e) {
        let oldVal = $(this).data('oldVal');
        if (oldVal !== $(this).val()){
            generateEditCommandToolbarCommand("command-command").execute();
        }
    }).on("keydown", saveWhenInsideInput);

    $("#command-value").on("focusin", function () {
        let ID = getSelectedRecord();
        $(this).data('oldVal', $(this).val());
        $(this).data('ID', ID);
    }).on("focusout", function () {
        let oldVal = $(this).data('oldVal');
        if (oldVal !== $(this).val()){
            generateEditCommandToolbarCommand("command-value").execute();
        }
    }).on("keydown", saveWhenInsideInput);


    $("#command-target").on("focusin", function () {
        let ID = getSelectedRecord();
        $(this).data('oldVal', $(this).val());
        $(this).data('ID', ID);
    }).on("focusout", function () {
        let oldValue = $(this).data("oldVal");
        generateEditTargetToolbarCommand(oldValue).execute();
    });


    $("#command-dropdown").click(function (e) {
        let option = e.target;
        if (option.nodeName === "OPTION") {
            generateDropdownCommandToolbarCommand().execute();
        }
    });

    $("#target-dropdown").click(function (e) {
        let option = e.target;
        if (option.nodeName === "OPTION") {
            generateDropdownCommandToolbarCommand().execute();
        }
    })
});



