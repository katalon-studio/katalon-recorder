function stopNativeEvent(event) {
    // NOTE: lock the browser default shortcuts
    // and this should be careful
    event.preventDefault();
    event.stopPropagation();
}

function pressArrowKey(direction) {
    let selectedRecords = getSelectedRecords();
    if (selectedRecords.length === 0) {
        return;
    }
    let lastRecordId = selectedRecords[selectedRecords.length - 1].id;
    let recordNum = parseInt(lastRecordId.substring(lastRecordId.indexOf("-") + 1));
    $("#records-grid .recordState").removeClass("selectedRecord");
    if (direction === 38) { // press up arrow
        if (recordNum === 1) {
            $("#records-1").addClass("selectedRecord").click();
        } else {
            $("#records-" + (recordNum - 1)).addClass("selectedRecord").click();
        }
    } else if (direction === 40) { // press down arrow
        if (recordNum === getRecordsNum()) {
            $("#records-" + recordNum).addClass("selectedRecord").click();
        } else {
            $("#records-" + (recordNum + 1)).addClass("selectedRecord").click();
        }
    }
}

function selectForeRecord() {
    pressArrowKey(38);
}

function selectNextRecord() {
    pressArrowKey(40);
}

//Hot key setting for up and down key
document.addEventListener("keydown", function (event) {
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }
    switch (keyNum) {
        case 38: // up arrow
            selectForeRecord();
            break;
        case 40: // down arrow
            selectNextRecord();
            break;
        /* KAT-BEGIN remove hot key
        case 46: // del
            let selectedTr = getSelectedRecords();
            for (let i=selectedTr.length-1 ; i>=0 ; i--) {
                deleteCommand(selectedTr[i].id);
            }
            break; */
        default:
            break;
    }
});

let isOnTreeSection = false;


document.addEventListener("click", function (event) {
    const treeSectionElement = document.getElementById("tree-section");
    isOnTreeSection = treeSectionElement.contains(event.target);
});

//Hot key setting for other
document.addEventListener("keydown", function (event) {
    let keyNum;
    if (window.event) { // IE
        keyNum = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keyNum = event.which;
    }

    if (event.ctrlKey || event.metaKey) {
        // Users should not be allowed to refresh the app,
        // as it will re-inject content scripts and cause weird behaviors
        if (keyNum === 82) {
            stopNativeEvent(event);
            return;
        }

        if (!isOnTreeSection) {
            if (keyNum === 83 || keyNum === 229){
                stopNativeEvent(event);
                saveDataAndRemoveDirtyMarks(event);
            }
            return;
        }

        stopNativeEvent(event);
        switch (keyNum) {
            case 79: // Ctrl + O
                $('#load-testSuite-hidden').click();
                break;
            case 80: // Ctrl + P
                console.log(80);
                $("#playback").click();
                break;
            case 83: // Ctrl + S
                $("#save-testSuite").click();
                break;
            default:
                break;
        }
    }
});



