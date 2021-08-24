import { loadData } from "../UI/services/data-service/load-data.js";
import { getTestSuiteCount, getTextSuiteByIndex } from "../UI/services/data-service/test-suite-service.js";
import { displayNewTestSuite } from "../UI/view/testcase-grid/display-new-test-suite.js";
import { testSuitContainerOpen } from "../UI/view/testcase-grid/test-suite-container.js";

// backup data will like: {"data": {...}, ...}
function readBackupData(f) {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function() {
        var backupData = JSON.parse(reader.result);
        restoreBackupData(backupData);
    }
}

function restoreBackupData(backupData) {
    browser.storage.local.clear().then(function() {
        browser.storage.local.set(backupData).then( function() {
            loadData().then(() => {
                const testSuiteCount = getTestSuiteCount();
                for (let i = 0; i < testSuiteCount; i++) {
                    displayNewTestSuite(getTextSuiteByIndex(i));
                }
                if (testSuiteCount > 0){
                    //expand test explorer to the first test case
                    testSuitContainerOpen();
                    const firstTestSuite = getTextSuiteByIndex(0);
                    if (firstTestSuite){
                        const firstTestSuiteElement = document.getElementById(firstTestSuite.id);
                        const testSuiteDropdown = firstTestSuiteElement.getElementsByClassName("dropdown")[0];
                        $(testSuiteDropdown).click();
                    }
                }
                browser.storage.local.get("language").then(result => {
                    if (result.language) {
                        $("#select-script-language-id").val(result.language);
                    }
                })
            });

        });
    });
}

function refreshStatusBar() {
    $.ajax({
        url: testOpsUrls.getUserInfo,
        type: 'GET',
        success: function(data) {
            if (data.email) {
                showBackupEnabledStatus();
                if (document.getElementById("logcontainer").childElementCount === 0){
                    $("#ka-upload").addClass("disable");
                }
            } else {
                showBackupDisabledStatus();
            }
        },
        error: function() {
            showBackupDisabledStatus();
        },
    });
}

$(function() {
    var backupRestoreInput = $('#backup-restore-hidden');
    $('#backup-restore-btn').click(function() {
        backupRestoreInput.click();
    });
    $('#backup-refresh-btn').click(function() {
        refreshStatusBar();
    });
    backupRestoreInput.change(function(event) {
        if (this.files.length === 1) {
            readBackupData(this.files[0]);
        }
        this.value = null;
    });
});

$(refreshStatusBar);
