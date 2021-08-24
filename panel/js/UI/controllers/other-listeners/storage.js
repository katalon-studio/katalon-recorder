import { saveData } from "../../services/data-service/save-data.js";
import { loadData } from "../../services/data-service/load-data.js";
import { displayNewTestSuite } from "../../view/testcase-grid/display-new-test-suite.js";
import {
  getTestSuiteCount,
  getTextSuiteByIndex
} from "../../services/data-service/test-suite-service.js";
import { testSuitContainerOpen } from "../../view/testcase-grid/test-suite-container.js";


$(document).ready(function () {
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

// save test suite before exiting
$(window).on('beforeunload', function (e) {
  saveData();
});