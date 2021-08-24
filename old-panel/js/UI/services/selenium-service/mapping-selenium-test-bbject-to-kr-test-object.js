import { TestSuite } from "../../models/test-model/test-suite.js";
import { TestCommand } from "../../models/test-model/test-command.js";
import { TestCase } from "../../models/test-model/test-case.js";


/***
 * mapping JSON object representing a Selenium IDE test project to KR domain object
 *
 * @param seleniumIDESuite
 * @param seleniumIDETestCases
 * @returns {TestSuite}
 */
const mappingSeleniumTestObjectToKRTestObject = (seleniumIDESuite, seleniumIDETestCases) => {
    let KRTestSuite = new TestSuite(seleniumIDESuite.name);
    for (const seleniumIDETestCase of seleniumIDETestCases) {
        let KRCommands = seleniumIDETestCase.commands.map(command => {
            const targets = command.targets.map(targetArray => targetArray[0]);
            if (targets.length === 0) targets.push(command.target);
            return new TestCommand(command.command, command.target, targets, command.value);
        });
        let testCase = new TestCase(seleniumIDETestCase.name, KRCommands);
        KRTestSuite.testCases.push(testCase);
    }
    return KRTestSuite;
}

export { mappingSeleniumTestObjectToKRTestObject }