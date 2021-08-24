import { marshall, parseSuiteName, unmarshall } from "../helper-service/parser.js";
import { TestCommand } from "../../models/test-model/test-command.js";
import { TestCase } from "../../models/test-model/test-case.js";
import { TestSuite } from "../../models/test-model/test-suite.js";
import { addTestSuite, getAllTestSuites } from "./test-suite-service.js";

/**
 * maps JSON data object to TestData object and save to in-memory data object
 * @param {Object} data
 */
function mappingDataObject(data) {
    data.testSuites.map(testSuite => {
        const testCases = testSuite.testCases?.map(testCase => {
            const commands = testCase.commands?.map(command => new TestCommand(command.name, command.defaultTarget, command.targets, command.value));
            return new TestCase(testCase.name, commands);
        });
        const KRTestSuite = new TestSuite(testSuite.name, testCases);
        addTestSuite(KRTestSuite);
    });
}

/**
 * maps old format HTML string to TestData object and save to in-memory data object
 * returns list of sideex_id for testSuite
 * @param htmlArray
 * @returns {string[]}
 */
function mappingOldSaveFormat(htmlArray) {
    for (const htmlString of htmlArray) {
        const suiteName = parseSuiteName(htmlString);
        const testSuite = unmarshall(suiteName, htmlString);
        addTestSuite(testSuite);
    }
}

/**
 * load JSON data object from local storage
 * return list of sideex_testSuite id
 * @returns {Promise<string[]>}
 */
const loadData = async() => {
    let result = await browser.storage.local.get(null);
    if (result.data) {
        if (result.data instanceof Array) {
            mappingOldSaveFormat(result.data);
        } else {
            mappingDataObject(result.data);
        }
        if (!result.backup) {
            let backupData = getAllTestSuites().map(testSuite => marshall(testSuite));
            let data = {
                backup: backupData
            };
            browser.storage.local.set(data);
        }
    }
}

export { loadData, mappingDataObject as mappingDataObjectForTest, mappingOldSaveFormat as mappingOldSaveFormatForTest }