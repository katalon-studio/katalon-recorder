import { readJsonFromFile } from "./service/load-file-service.js";
import { appendSuitesToGrid } from "./view/test-suite-view.js";
import { parseToRecorderTestSuites } from "./service/selenium-ide-parser-service.js";
import { displayWarningIncompatibleCommands } from "./view/confirm-convert-dialog.js";
import { trackingSegment } from "../tracking/segment-tracking-service.js";
import { getIncompatibleCommands } from "./service/command-converter-service.js";


$(document).ready(function () {
  $("#import-selenium").click((e) => {
    $("#import-selenium-hidden").click();
  });

  document.getElementById("import-selenium-hidden").addEventListener("change", async function(event) {
    event.stopPropagation();
    let testCaseNum = 0;
    for (let i = 0; i < this.files.length; i++) {
      let seleniumTestData = await readJsonFromFile(this.files[i]);
      let incompatibleCommands = getIncompatibleCommands(seleniumTestData);
      let result = "true";
      if (incompatibleCommands.length > 0){
        result = await displayWarningIncompatibleCommands(incompatibleCommands);
      }
      if (result === "true"){
        seleniumTestData = parseToRecorderTestSuites(seleniumTestData);
        appendSuitesToGrid(seleniumTestData);
      }
      testCaseNum += seleniumTestData.tests.length;
    }
    trackingSegment("kru_selenium_ide_import", {numberOfTest: testCaseNum});
    this.value = null;
  }, false);
});



