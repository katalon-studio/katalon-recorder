import { TestCommand } from "../../models/test-model/test-command.js";
import { TestCase } from "../../models/test-model/test-case.js";
import { TestSuite } from "../../models/test-model/test-suite.js";
import { TestData } from "../../models/test-model/test-data.js";
import { saveOldCase } from "../../view/testcase-grid/utils.js";

/**
 * save in-memory data object to local storage
 */
const saveData = () => {
    saveOldCase();
    const data = {
        data: KRData
    };
    browser.storage.local.set(data);
    backupData();
}

const mappingTestDataToJSONObject = () => {
    return JSON.parse(JSON.stringify(KRData));
}

/**
 * maps JSON data object to TestData object and save to in-memory data object
 * returns list of sideex_id for testSuite
 * @param {Object} data
 * @returns {TestData}
 */
const mappingJSONObjectToTestData = (data) => {
    const testSuites = data.testSuites.map(testSuite => {
        const testCases = testSuite.testCases.map(testCase => {
            const commands = testCase.commands.map(command => new TestCommand(command.name, command.defaultTarget, command.targets, command.value));
            const newTestCase = new TestCase(testCase.name, commands);
            newTestCase.id = testCase.id;
            return newTestCase;
        });
        const KRTestSuite = new TestSuite(testSuite.name, testCases);
        KRTestSuite.id = testSuite.id;
        return KRTestSuite;
    });
    const testData = new TestData(testSuites);

    return testData;
}

const setKRData = (data) => {
    KRData = data;
}


export { saveData, mappingTestDataToJSONObject, mappingJSONObjectToTestData, setKRData }