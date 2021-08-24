/***
 * Class contains all test suites / test cases that are loaded when KR is running
 */
class TestData {
  /**
   *
   * @param {TestSuite[]} testSuites - all TestSuite objects represent test suite loaded
   */
  constructor(testSuites = []) {
    this.testSuites = testSuites;
  }

  getTestSuiteCount() {
    return this.testSuites.length;
  }

  removeTestSuite(testSuiteID) {
    for (let i = 0; i < this.getTestSuiteCount(); i++) {
      const testSuite = this.testSuites[i];
      if (testSuite.id === testSuiteID) {
        this.testSuites.splice(i, 1);
        return testSuite;
      }
    }
  }

  removeTestCase(testCaseID) {
    for (const testSuite of this.testSuites) {
      for (let i = 0; i < testSuite.getTestCaseCount(); i++) {
        const testCase = testSuite.testCases[i];
        if (testCase.id === testCaseID) {
          testSuite.testCases.splice(i, 1);
          return testCase;
        }
      }
    }
  }

  findTestSuiteById(testSuiteID) {
    return this.testSuites.find(testSuite => testSuite.id === testSuiteID);
  }

  findTestCaseById(testCaseID) {
    for (const testSuite of this.testSuites) {
      const testCase = testSuite.testCases.find(testCase => testCase.id === testCaseID);
      if (testCase !== undefined) return testCase;
    }
    return null;
  }

  findTestSuiteByTestCaseID(testCaseID) {
    return this.testSuites.find(testSuite => {
      let testCase = testSuite.testCases.find(testCase => testCase.id === testCaseID);
      return testCase !== undefined;
    });
  }
}

export { TestData }