import { TestCase } from "../../models/test-model/test-case.js";

/***
 * create a new TestCase object and save it into in-memory data object
 *
 * @param {string} title - TestCase's name
 * @param {TestSuite} testSuite - TestSuite object that this new TestCase object belongs to
 * @returns {TestCase}
 */
const createTestCase = (title = "Untitled Test Case", testSuite) => {
    title = title !== null ? title : "Untitled Test Case";
    if (!testSuite) {
        throw "Null or undefined test suite"
    }

    const testCase = new TestCase(title);
    testSuite.testCases.push(testCase);
    return testCase;

}

/**
 * delete TestCase in in-memory data object and return the deleted TestCase object
 * @param {string} testCaseID - TestCase's id
 * @returns {TestCase} - delete TestCase object
 */
const deleteTestCase = (testCaseID) => {
    if (testCaseID === undefined || testCaseID === null) {
        throw "Null or undefined testCaseID"
    }
    return KRData.removeTestCase(testCaseID);
}

/**
 *
 * @param testCaseID
 * @returns {null|TestCase}
 */
const findTestCaseById = (testCaseID) => {
    for (const testSuite of KRData.testSuites) {
        const testCase = testSuite.testCases.find(testCase => testCase.id === testCaseID);
        if (testCase !== undefined) return testCase;
    }
    return null;
}

/**
 *
 * @returns {number}
 */
const getAllTestCaseCount = () => {
    let count = 0;
    KRData.testSuites.forEach(testSuite => {
        count += testSuite.getTestCaseCount();
    });
    return count;
}


export { createTestCase, deleteTestCase, findTestCaseById, getAllTestCaseCount }