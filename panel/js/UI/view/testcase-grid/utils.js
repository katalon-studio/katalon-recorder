import { getSelectedCase } from "./selected-case.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";
import { getRecordsArray } from "../records-grid/get-records-array.js";
import { getCommandName, getCommandTarget, getCommandTargets, getCommandValue } from "../records-grid/record-utils.js";

const cleanSelected = () => {
    $('#testCase-grid .selectedCase').removeClass('selectedCase');
    $('#testCase-grid .selectedSuite').removeClass('selectedSuite');
}


//TODO: move saveOldCase() to service
const saveOldCase = () => {
    const selectedCase = getSelectedCase();
    if (selectedCase) {
        const testCaseID = selectedCase.id;
        const testCase = findTestCaseById(testCaseID);
        const recordElements = getRecordsArray();
        for (let i = 0; i < recordElements.length; i++) {
            const testCommand = testCase.commands[i];
            const UICommandName = getCommandName(recordElements[i]);
            const UICommandDefaultTarget = getCommandTarget(recordElements[i]);
            const UICommandValue = getCommandValue(recordElements[i]);
            const UICommandTargets = getCommandTargets(recordElements[i])
            testCommand.name = UICommandName;
            testCommand.defaultTarget = UICommandDefaultTarget;
            testCommand.targets = UICommandTargets;
            testCommand.value = UICommandValue;

        }
    }
}

const getTestSuiteName = (testSuiteElement) => {
    return testSuiteElement.getElementsByTagName("strong")[0].innerHTML;
}

const getTestCaseName = (testCaseElement) => {
    return testCaseElement.getElementsByTagName("span")[0].innerHTML
}


export { cleanSelected, saveOldCase, getTestSuiteName, getTestCaseName }