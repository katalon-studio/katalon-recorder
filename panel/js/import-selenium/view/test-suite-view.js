import { appendCaseToGrid } from "./test-case-view.js";

/***
 *
 * @param {Object} obj - A JSON object representing a Selenium IDE test project
 */
const appendSuitesToGrid = (obj) => {
  let testSuites = obj.suites;
  let testCases = obj.tests;
  testSuites.forEach(suite => {
    let suiteTestCases = suite.tests.map(testID => {
      return testCases.find(testCase => testCase.id === testID);
    });
    appendTestSuiteToGrid(suite, suiteTestCases);
  });
}

function appendTestSuiteToGrid(suite, testCases) {
  let id = "suite" + sideex_testSuite.count;
  sideex_testSuite.count++;
  let suiteName = suite.name;
  addTestSuite(suiteName, id);
  sideex_testSuite[id] = {
    file_name: suiteName + ".html",
    title: suiteName
  };

  testCases.forEach(testCase => {
    appendCaseToGrid(testCase);
  });
  setSelectedSuite(id);
  clean_panel();
}

export { appendSuitesToGrid };