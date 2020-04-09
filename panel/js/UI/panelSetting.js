/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

$(document).ready(function() {

    var userid = browser.runtime.id;
    var tac = false;

    /**
     * Only used to count the TAC locator usages.
     */
    /* KAT-BEGIN not supported
    browser.storage.sync.get("tac")
        .then((res) => {
            if (res.tac) {
                tac = res.tac;
                if (tac) {
                    $.ajax({
                        url: 'http://log.sideex.org/usage/tacUsageCount.php',
                        type: 'POST',
                        data: {
                            userid: userid
                        }
                    });
                }
            } else {
                browser.storage.sync.set({
                    tac: tac
                });
            }
        });
    KAT-END */

    $(".tablesorter").tablesorter();

    // $("#help").click(function() {
    //     browser.tabs.create({
    //         url: "http://sideex.org/",
    //         windowId: contentWindowId
    //     });
    // });

    $("#options").click(function() {
        browser.runtime.openOptionsPage();
    });

    //init dropdown width
    $("#command-dropdown").css({
        'width': $("#command-command").width() + "px"
    });
    $("#target-dropdown").css({
        'width': $("#command-target").width() + "px"
    });
    //dropdown width change with input's width
    $(window).resize(function() {
        $("#command-dropdown").css({
            'width': $("#command-command").width() + "px"
        });
        $("#target-dropdown").css({
            'width': $("#command-target").width() + "px"
        });
    });
    //dropdown when click the down icon
    $(".fa-chevron-down").click(function(e) {
        e.stopPropagation();
        dropdown($("#" + $(this).attr("id") + "dropdown"));
        $(".w3-show").on("mouseleave", function() {
            dropdown($(this));
        });
    });

    $("#command-grid").colResizable({ liveDrag: true, minWidth: 75 });

    // $(".fixed").width($("table:not(.fixed)").width());

    $("#command-dropdown,#command-command-list").html(genCommandDatalist());

    $(".record-bottom").click(function() {
        $(this).addClass("active");
        $('#records-grid .selectedRecord').removeClass('selectedRecord');
    });

    $("#slider").slider({
        min: 0,
        max: 3000,
        value: 0,
        step: 600
    }).slider("pips", {
        rest: "label", labels: ["Fast", "", "", "", "", "Slow"]
    });

});

var dropdown = function(node) {
    if (!node.hasClass("w3-show")) {
        node.addClass("w3-show");
        setTimeout(function() {
            $(document).on("click", clickWhenDropdownHandler);
        }, 200);
    } else {
        $(".w3-show").off("mouseleave");
        node.removeClass("w3-show");
        $(document).off("click", clickWhenDropdownHandler);
    }
};

var clickWhenDropdownHandler = function(e) {
    var event = $(e.target);
    if ($(".w3-show").is(event.parent())) {
        $(".w3-show").prev().prev().val(event.val()).trigger("input");
    }
    dropdown($(".w3-show"));
};

function closeConfirm(bool) {
    if (bool) {
        $(window).on("beforeunload", function(e) {
            var confirmationMessage = "You have a modified suite!";
            e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
            return confirmationMessage; // Gecko, WebKit, Chrome <34
        });
    } else {
        if (!$("#testCase-grid").find(".modified").length)
            $(window).off("beforeunload");
    }
}

//KAT-BEGIN add Selenium IDE commands

var formalCommands;

function genCommandDatalist() {
    var supportedCommand = [
        "addSelection",
        "answerOnNextPrompt",
        "assertAlert",
        "assertConfirmation",
        "assertPrompt",
        "assertText",
        "assertTitle",
        "assertValue",
        "chooseCancelOnNextConfirmation",
        "chooseCancelOnNextPrompt",
        "chooseOkOnNextConfirmation",
        "clickAt",
        "close",
        "doubleClickAt",
        "dragAndDropToObject",
        "echo",
        "editContent",
        "mouseDownAt",
        "mouseMoveAt",
        "mouseOut",
        "mouseOver",
        "mouseUpAt",
        "open",
        "pause",
        "removeSelection",
        "runScript",
        "select",
        "selectFrame",
        "selectWindow",
        "sendKeys",
        "store",
        "storeEval",
        "storeText",
        "storeTitle",
        "storeValue",
        "submit",
        "type",
        "verifyText",
        "verifyTitle",
        "verifyValue"
    ];

    supportedCommand = _loadSeleniumCommands();

    var datalistHTML = "";
    formalCommands = {};
    supportedCommand.forEach(function(command) {
        datalistHTML += ('<option value="' + command + '">' + command + '</option>\n');
        formalCommands[command.toLowerCase()] = command;
    });

    return datalistHTML;
}
// KAT-END