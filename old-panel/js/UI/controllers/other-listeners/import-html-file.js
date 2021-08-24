import { loadHTMLFile } from "../../services/html-service/load-html-file.js"
import { displayNewTestSuite } from "../../view/testcase-grid/display-new-test-suite.js";
import { addTestSuite } from "../../services/data-service/test-suite-service.js";

$(document).ready(function () {
  $("#load-testSuite-hidden").change(async function (event) {
    event.stopPropagation();
    for (let i = 0; i < this.files.length; i++) {
      let testSuite = await loadHTMLFile(this.files[i]);
      addTestSuite(testSuite);
      displayNewTestSuite(testSuite);
    }
    this.value = null;
  });

  $("#load-testSuite-show").click(function (event) {
    event.stopPropagation();
    document.getElementById('load-testSuite-hidden').click();
  });

  $("#load-testSuite-show-menu").click(function (event) {
    event.stopPropagation();
    document.getElementById('load-testSuite-hidden').click();
  });

  $("#testCase-container").on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
  })
    .on('dragover dragenter', function () {
      $("#testCase-container").addClass('is-dragover');
    })
    .on('dragleave dragend drop', function () {
      $("#testCase-container").removeClass('is-dragover');
    })
    .on('drop', async function (e) {
      let droppedFiles = e.originalEvent.dataTransfer.files;
      let droppedFilesLength = droppedFiles.length;
      for (let i = 0; i < droppedFilesLength; i++) {
        let testSuite = await loadHTMLFile(droppedFiles[i]);
        addTestSuite(testSuite);
        displayNewTestSuite(testSuite);
      }
    });
});