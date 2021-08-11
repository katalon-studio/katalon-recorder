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

import { commandGridMenu } from "./UI/command-grid-menu.js";
import { MenuItem } from "./menu/MenuItem.js";
import { generatePlayFromHereCommand, generatePlaySpecificRecordCommand, } from "../service/command-generators.js";

document.body.appendChild(commandGridMenu.getContainer());

// Trigger action when the context menu is about to be shown
$(document).on("contextmenu", function (event) {
    $(".menu").css("left", event.pageX).css("top", event.pageY);

    if (event.target.id === "testCase-container") {
        event.preventDefault();
        $("#suite-grid-menu").show();
        return;
    }
    commandGridMenu.remove("grid-play-this-command");
    commandGridMenu.remove("grid-play-from-here");
    let target = event.target;
    let inCommandGrid = false;
    while (target.tagName.toLowerCase() !== "body") {
        if (/records-(\d)+/.test(target.id)) {
            let index = target.id.split("-")[1];
            let playThisCommandItem = new MenuItem("grid-play-this-command", "Play This Command", generatePlaySpecificRecordCommand(index));
            let playFromHereItem = new MenuItem("grid-play-from-here", "Play From Here", generatePlayFromHereCommand(index));
            commandGridMenu.add(playThisCommandItem);
            commandGridMenu.add(playFromHereItem);
        }
        if (target.id === "command-grid" || target.className.search("record-bottom") >= 0) {
            inCommandGrid = true;
            break;
        } else {
            target = target.parentElement;
        }
    }
    if (inCommandGrid) {
        event.preventDefault();
        commandGridMenu.show();
    }
});


// If the document is clicked somewhere
$(document).on("mousedown", function (e) {
    if (!$(e.target).parents(".menu").length > 0) $(".menu").hide();
    // KAT-BEGIN fix context menu not work with touchpad
    else setTimeout(function () { $(".menu").hide(); }, 500);
    // KAT-END
});

document.getElementById("command-container").addEventListener("click", function (event) {
    document.getElementById("command-command").blur();
    document.getElementById("command-target").blur();
    document.getElementById("command-value").blur();
});








