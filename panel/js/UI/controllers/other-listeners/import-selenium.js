import { trackingSegment } from "../../services/tracking-service/segment-tracking-service.js";
import { mappingSeleniumTestObjectToKRTestObject } from "../../services/selenium-service/mapping-selenium-test-bbject-to-kr-test-object.js";
import { displayNewTestSuite } from "../../view/testcase-grid/display-new-test-suite.js";
import { readJsonFromFile } from "../../services/helper-service/readJsonFromFile.js";
import { displayWarningIncompatibleCommands } from "../../view/dialog/confirm-convert-dialog.js";
import { parseToRecorderTestSuites } from "../../services/selenium-service/selenium-ide-parser.js";
import { getIncompatibleCommands } from "../../services/selenium-service/command-converter-service.js";
import { addTestSuite } from "../../services/data-service/test-suite-service.js";
import { testSuitContainerOpen } from "../../view/testcase-grid/test-suite-container.js"

/***
 * take in an Selenium IDE test object, map it into KR Test Data, add to on-memory data object and display
 * to record grid
 * @param {Object} obj - A JSON object representing a Selenium IDE test project
 */
function appendSuitesToGrid(obj) {
  let testSuites = obj.suites;
  let testCases = obj.tests;
  testSuites.forEach(suite => {
    let suiteTestCases = suite.tests.map(testID => {
      return testCases.find(testCase => testCase.id === testID);
    });
    const KRTestSuite = mappingSeleniumTestObjectToKRTestObject(suite, suiteTestCases);
    addTestSuite(KRTestSuite);
    displayNewTestSuite(KRTestSuite);
  });
}


/**
 * take in a Selenium save file, parse it into JSON object and display it on UI
 *
 * @param file - Selenium save file
 * @returns {Promise<Number>} - Promise that contains all the test case contained in Selenium save file
 */
async function loadSideFile(file) {
  let seleniumTestData = await readJsonFromFile(file);
  let incompatibleCommands = getIncompatibleCommands(seleniumTestData);
  let result = "true";
  if (incompatibleCommands.length > 0) {
    result = await displayWarningIncompatibleCommands(incompatibleCommands);
  }
  if (result === "true") {
    seleniumTestData = parseToRecorderTestSuites(seleniumTestData);
    appendSuitesToGrid(seleniumTestData);
  }
  return seleniumTestData.tests.length;
}

$(document).ready(function () {
  $("#suite-open-selenium").click((event) => {
    event.stopPropagation();
    $("#suite-open-dropdown").css("display", "none");
    $("#import-selenium-hidden").click();
    testSuitContainerOpen();
  });

  document.getElementById("import-selenium-hidden").addEventListener("change", async function (event) {
    event.stopPropagation();
    let testCaseNum = 0;
    for (let i = 0; i < this.files.length; i++) {
      testCaseNum += await loadSideFile(this.files[i]);
    }
    trackingSegment("kru_selenium_ide_import", { numberOfTest: testCaseNum });
    this.value = null;
  }, false);
});



