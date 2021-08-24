import { sampleData } from "../../services/sample-project-service/sample-data.js";
import {
  addSampleData,
  sampleDataTrackingService
} from "../../services/sample-project-service/sample-project-service.js"
import { testSuitContainerOpen } from "../../view/testcase-grid/test-suite-container.js";
import { renderNewTestSuite, testSuiteDropdownOpen } from "../../view/testcase-grid/render-new-test-suite.js";
import { renderNewTestCase } from "../../view/testcase-grid/render-new-test-case.js";
import {
  renderSampleCategories,
  resetSampleProjectDialog
} from "../../view/sample-project/sample-project-view.js";


$(document).ready(function () {
  renderSampleCategories();

  $("#sample-project").click(function(){
    $("#helpDialog").dialog("close");
    $("#template-open").click();
  })

  $("#template-open").click(function () {
    $("#sample-section").dialog("open").css("display", "flex").focus();
    $("#sample-command-grid")
      .colResizable({ disable : true })
      .colResizable({ liveDrag: true, minWidth: 75});
  })

  $("#main-panel-sample-cancel").click(function () {
    $("#sample-section").dialog("close");
  });

  $("#main-panel-add-sample").click(function () {
    debugger;
    if ($(this).hasClass("disable")) {
      return;
    }
    testSuitContainerOpen();
    const selectedIDs = [...$(".sample-projects input:checked").parent()]
      .map(element => parseInt(element.id.substring(14)));
    const sampleTestSuites = addSampleData(sampleData, selectedIDs);
    for (const testSuite of sampleTestSuites){
      renderNewTestSuite(testSuite.name, testSuite.id);
      for (const testCase of testSuite.testCases){
        renderNewTestCase(testCase.name, testCase.id);
      }
    }
    testSuiteDropdownOpen(sampleTestSuites[sampleTestSuites.length-1].id);
    $(`#${sampleTestSuites[sampleTestSuites.length-1].testCases[0].id}`).click()
    sampleDataTrackingService(sampleData, selectedIDs);
    $("#sample-section").dialog("close");
    //reset dialog
    resetSampleProjectDialog();
  })
})