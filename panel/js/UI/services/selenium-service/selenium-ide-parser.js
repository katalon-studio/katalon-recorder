import {
  convertAssertCommand,
  convertEmptyCommand,
  convertEndCommand,
  convertExecuteScriptCommand,
  convertIfCommand,
  convertOpenCommand,
  convertSelectWindowCommand,
  convertVerifyCommand,
  convertWaitForCommand,
  INCOMPATIBLE_COMMANDS
} from "./command-converter-service.js";
import { generateUUID, removeObjectAtIndexes } from "../helper-service/utils.js";

/***
 * filter Selenium Test Project Object to work with KR
 *
 * @param {Object} data - A JSON object representing a Selenium IDE test project
 * @returns {Object} - a changed Selenium Test Project Object
 */
const parseToRecorderTestSuites = (data) => {
  data = JSON.parse(JSON.stringify(data));
  data = modifyByAddingOrphanTestsToDefaultSuite(data);
  data = parseToRecorderCommands(data);
  return data;
}

/***
 * In Selenium, test cases can exist without belonging to a test suite.
 * KR doesn't permit that.
 * Therefore, we need all suite-less test cases to a default test suite
 *
 * @param {Object} data - A JSON object representing a Selenium IDE test project
 * @returns {Object} - a changed Selenium Test Project Object
 */
function modifyByAddingOrphanTestsToDefaultSuite(data) {
  data = JSON.parse(JSON.stringify(data));
  let testsInSuites = data.suites.reduce((testsInSuites, suite) => {
    return [...testsInSuites, ...suite.tests]
  }, []);
  let testIDs = data.tests.map(test => test.id);
  let testsNotInSuites = testIDs.filter(id => !testsInSuites.includes(id));
  if (testsNotInSuites.length !== 0) {
    let defaultSuite = {
      "id": generateUUID(),
      "name": "Default Suite",
      "persistSession": false,
      "parallel": false,
      "timeout": 300,
      "tests": testsNotInSuites
    }
    data.suites.push(defaultSuite);
  }
  return data;
}


/***
 * convert Selenium commands to KR commands without breaking their functionality
 * and delete incompatible commands
 *
 * @param {Object} data - A JSON object representing a Selenium IDE test project
 * @returns {Object} - a changed Selenium Test Project Object
 */
function parseToRecorderCommands(data) {
  data = JSON.parse(JSON.stringify(data));
  const testCases = data.tests;
  const urls = data.urls;
  testCases.forEach(testCase => {
    let commands = testCase.commands;
    const stack = [];
    const selectWindowMap = { count: 0 };
    const incompatibleCommandIndexList = []
    commands.forEach((command, index, commands) => {
      switch (command.command) {
        case "open":
          commands[index] = convertOpenCommand(command, urls);
          break;
        case "assert":
          commands[index] = convertAssertCommand(command);
          break;
        case "verify":
          commands[index] = convertVerifyCommand(command);
          break;
        case "end":
          commands[index] = convertEndCommand(command, stack);
          let popCommand = stack.pop();
          while (popCommand?.command === "elseIf") {
            popCommand = stack.pop();
            if (popCommand === undefined) break;
          }
          break;
        case "while":
          stack.push(command);
          break;
        case "if":
          commands[index] = convertIfCommand(command);
          stack.push(command);
          break;
        case "elseIf":
          commands[index] = convertIfCommand(command);
          stack.push(command);
          break;
        case "executeScript":
        case "executeAsyncScript":
          commands[index] = convertExecuteScriptCommand(command);
          break;
        case "waitForElementEditable":
        case "waitForElementNotEditable":
        case "waitForElementNotPresent":
        case "waitForElementNotVisible":
        case "waitForElementPresent":
        case "waitForElementVisible":
          commands[index] = convertWaitForCommand(command);
          break;
        case "":
          commands[index] = convertEmptyCommand(command);
          break;
        case "selectWindow":
          commands[index] = convertSelectWindowCommand(command, selectWindowMap);
          break;
        default:
          if (INCOMPATIBLE_COMMANDS.includes(command.command) || command.command.includes("//")) {
            incompatibleCommandIndexList.push(index);
          }
      }
    });
    testCase.commands = removeObjectAtIndexes(commands, incompatibleCommandIndexList);
  });
  return data;
}


export { parseToRecorderTestSuites }