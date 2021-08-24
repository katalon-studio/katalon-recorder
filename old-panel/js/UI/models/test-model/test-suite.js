import { generateUUID } from "../../services/helper-service/utils.js";

/**
 * Class represent test suite that currently loaded when KR is running
 */
class TestSuite {
  /**
   * Create a TestSuite
   * TestSuite's id will be an UUID string
   * @param {string} name - TestSuite's name
   * @param {TestCase[]} testCases - List of TestCase objects belonging to test case
   */
  constructor(name = "", testCases = []) {
    if ( testCases === undefined){
      testCases = [];
    }
    this.id = generateUUID();
    this.name = name;
    this.testCases = testCases;
  }

  getTestCaseCount(){
    return this.testCases.length;
  }

  findTestCaseIndexByID(testCaseID){
    return this.testCases.findIndex(testCase => testCase.id === testCaseID);
  }

  insertNewTestCase(index, testCase){
    this.testCases.splice(index, 0, testCase);
  }


}

export { TestSuite }