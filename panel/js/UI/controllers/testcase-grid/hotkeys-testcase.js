import { removeDirtyMarks } from "../../view/testcase-grid/remove-dirty-mark.js";
import { saveData } from "../../services/data-service/save-data.js";

function stopNativeEvent(event) {
    // NOTE: lock the browser default shortcuts
    // and this should be careful
    event.preventDefault();
    event.stopPropagation();
}

let isOnTreeSection = false;

document.addEventListener("click", function(event) {
    const treeSectionElement = document.getElementById("tree-section");
    isOnTreeSection = treeSectionElement.contains(event.target);
});

//Hot key setting for other
document.addEventListener("keydown", function(event) {
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
            if (keyNum === 83 || keyNum === 229) { //Ctrl + S
                event.stopPropagation();
                stopNativeEvent(event);
                saveData();
                removeDirtyMarks();
            }
            return;
        }

        stopNativeEvent(event);
        switch (keyNum) {
            case 79: // Ctrl + O
                $('#load-testSuite-hidden').click();
                break;
            case 80: // Ctrl + P
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