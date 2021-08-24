import { saveData } from "../../services/data-service/save-data.js";
import { loadData } from "../../services/data-service/load-data.js";
import { displayNewTestSuite } from "../../view/testcase-grid/display-new-test-suite.js";
import { getTestSuiteCount, getTextSuiteByIndex } from "../../services/data-service/test-suite-service.js";


$(document).ready(function () {
  loadData().then(() => {
    for (let i = 0; i < getTestSuiteCount(); i++) {
      displayNewTestSuite(getTextSuiteByIndex(i));
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