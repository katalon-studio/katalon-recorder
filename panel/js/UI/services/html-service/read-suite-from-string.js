import { parseSuiteName, unmarshall } from "../helper-service/parser.js";
import { addTestSuite } from "../data-service/test-suite-service.js";
import { displayNewTestSuite } from "../../view/testcase-grid/display-new-test-suite.js";

const readSuiteFromString = (testSuiteHTMlString) => {
    const suiteName = parseSuiteName(testSuiteHTMlString);
    const testSuite = unmarshall(suiteName, testSuiteHTMlString);
    addTestSuite(testSuite);
    displayNewTestSuite(testSuite);
}
export { readSuiteFromString }