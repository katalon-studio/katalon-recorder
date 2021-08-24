import { setSelectedSuite } from "./selected-suite.js";
import { renderTestCaseToRecordGrid } from "../records-grid/render-test-case-to-record-grid.js";
import { renderNewTestSuite } from "./render-new-test-suite.js";
import { renderNewTestCase } from "./render-new-test-case.js";

/**
 * take in a TestSuite object and render data to UI
 * @param {TestSuite} testSuite
 */
const displayNewTestSuite = (testSuite) => {
  renderNewTestSuite(testSuite.name, testSuite.id);
  testSuite.testCases.forEach(testCase => {
    renderTestCaseToRecordGrid(testCase);
    let case_title = testCase.name;
    renderNewTestCase(case_title, testCase.id);
  });
  setSelectedSuite(testSuite.id);
  clean_panel();
}

export { displayNewTestSuite }