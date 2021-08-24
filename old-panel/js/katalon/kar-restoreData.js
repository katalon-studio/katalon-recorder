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
    chrome.storage.local.clear(function() {
        chrome.storage.local.set(backupData, function() {
            reload();
        });
    });
}

function reload() {
    $(window).off('beforeunload');
    window.close()
}


function refreshStatusBar() {
    $.ajax({
        url: testOpsUrls.getUserInfo,
        type: 'GET',
        success: function(data) {
            if (data.email) {
                showBackupEnabledStatus();
            } else {
                showBackupDisabledStatus();
            }
        },
        error: function() {
            showBackupDisabledStatus();
        },
    });
}

function showBackupRestoreButton() {
    $('#backup-restore-btn').show();
    $('#backup-refresh-btn').hide();
}

function hideBackupRestoreButton() {
    $('#backup-restore-btn').hide();
    $('#backup-refresh-btn').show();
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
