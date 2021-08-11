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

// make case sortable when addTestSuite
function makeCaseSortable(suite) {
    var prevSuite = null;
    $(suite).sortable({
        axis: "y",
        items: "p",
        scroll: true,
        revert: 300,
        scrollSensitivity: 20,
        connectWith: ".message",
        start: function (event, ui) {
            ui.placeholder.html(ui.item.html()).css({ "visibility": "visible", "opacity": 0.3 });
            prevSuite = event.target;
        },
        update: function (event, ui) {
            if (prevSuite !== event.target)
                $(prevSuite).find("strong").addClass("modified");
            $(event.target).find("strong").addClass("modified");
            closeConfirm(true);
        }
    });
}
