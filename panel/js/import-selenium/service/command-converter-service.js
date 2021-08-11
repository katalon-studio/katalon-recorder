//these commands that we can not convert in anyways
const INCOMPATIBLE_COMMANDS = [
  "debugger",
  "do",
  "forEach",
  "repeatIf",
  "run",
  "setWindowSize",
  "storeJson",
  "storeWindowHandle",
  "times"
];


/**
 * check whether Selenium Test Project Object has any incompatible commands
 *
 * @param {Object} data - A JSON object representing a Selenium IDE test project
 * @returns {Object[]} - list of distinct incompatible commands in data
 */
const getIncompatibleCommands = (data) => {
  const testCases = data.tests;
  const incompatibleCommands = [];
  testCases.forEach(testCase => {
    testCase.commands.forEach(command => {
      if (INCOMPATIBLE_COMMANDS.includes(command.command) && !incompatibleCommands.includes(command.command)) {
        incompatibleCommands.push(command.command);
      }
    });
  });
  return incompatibleCommands;
}

/***
 * Since Selenium save URL in another list, the target of the "open" command
 * sometimes only contains subdirectory part or nothing
 * Ex: with https://todomvc.com/examples/backbone/, Selenium only store /examples/backbone/
 * If this case happens, we have to put all URL to the target list of the command
 *
 * @param {Object} command - Selenium Command Object
 * @param {String[]} urls - Selenium URL list
 * @returns {Object} - a changed Selenium Object
 */
function convertOpenCommand(command, urls) {
  command = JSON.parse(JSON.stringify(command));
  if (command.target.indexOf("/") === 0) {
    command.targets.push(...urls.map(url => {
      if (url[url.length - 1] === "/") {
        return [url + command.target.substring(1)];
      }
      return [url + command.target];
    }));
    command.target = command.targets[0];
  } else if (command.target === "") {
    command.targets = [...urls.map(url => [url])];
    command.target = urls[0];
  }
  return command;
}

/***
 * The Selenium "assert" command compare target with value
 * KR doesn't support this command so change to assetEval | "${<command>}===<value>" | true
 *
 * @param {Object} command - a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertAssertCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.command = "assertEval";
  command.target = '"${' + command.target + '}"==="' + command.value + '"';
  command.value = "true"
  return command;
}

/***
 * The Selenium "verify" command compare target with value
 * KR doesn't support this command so change to verifyEval | "${<command>}===<value>" | true
 *
 * @param {Object} command- a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertVerifyCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.command = "verifyEval";
  command.target = '"${' + command.target + '}"==="' + command.value + '"';
  command.value = "true"
  return command;
}

/***
 * Selenium "end" command applies for both "while", "if" and "elseIf"
 * KR has "endWhile" and "endIf"
 *
 * @param {Object} command - a changed Selenium Object
 * @param {Object[]} stack - stack of Selenium Command Objects
 * @returns {Object} - a changed Selenium Object
 */
function convertEndCommand(command, stack) {
  command = JSON.parse(JSON.stringify(command));
  let endStackCommand = stack[stack.length - 1];
  if (endStackCommand === undefined) {
    return command;
  }
  if (endStackCommand.command === "while") {
    command.command = "endWhile";
  } else if (endStackCommand.command === "if" || endStackCommand.command === "elseIf") {
    command.command = "endIf";
  }
  return command;
}


/***
 * Selenium "executeScript" can be convert to KR "runScript"
 *
 * @param {Object} command - a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertExecuteScriptCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.command = "runScript";
  return command;
}

/***
 * Selenium "if" command's target variable doesn't need to have "" surround it
 * KR "if" command's target need "" to surround it
 *
 * @param {Object} command - a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertIfCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.target = command.target.replaceAll("${", '"${').replaceAll("}", '}"');
  return command;
}


/***
 * All Selenium "waitFor" commands have timeoutValue as a parameter
 * KR "waitFor" commands don't have that parameter
 *
 * @param {Object} command - a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertWaitForCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.value = "";
  return command;
}

/***
 * Empty command can be bypass in Selenium IDE
 * KR does not bypass, so we must turn it to a comment
 * @param {Object} command - a changed Selenium Object
 * @returns {Object} - a changed Selenium Object
 */
function convertEmptyCommand(command) {
  command = JSON.parse(JSON.stringify(command));
  command.command = "#";
  return command;
}

/***
 *  when switching between windows and tabs, Selenium saves windowID as "handle=${<windowId>}" or handle=${root}
 *  KR saves windowID as "win_ser_<num>" (with <num> is the order of created window begin with 1) or "win_ser_local"
 *
 * @param {Object} command - a changed Selenium Object
 * @param {Object} selectWindowMap - mapping between Selenium Window ID and KR Window Serial
 * @returns {Object} - a changed Selenium Object
 */
function convertSelectWindowCommand(command, selectWindowMap) {
  command = JSON.parse(JSON.stringify(command));
  let target = command.target;
  //target has format handle=${<id>}
  let winID = target.substring(9, target.length - 1);
  if (!Object.keys(selectWindowMap).includes(winID)) {
    if (winID === "root") {
      selectWindowMap[winID] = "local"
    } else {
      selectWindowMap[winID] = ++selectWindowMap.count;
    }
  }
  command.target = `win_ser_${selectWindowMap[winID]}`;
  return command;
}

export {
  convertOpenCommand,
  convertAssertCommand,
  convertEmptyCommand,
  convertEndCommand,
  convertExecuteScriptCommand,
  convertSelectWindowCommand,
  convertWaitForCommand,
  convertVerifyCommand,
  convertIfCommand,
  getIncompatibleCommands,
  INCOMPATIBLE_COMMANDS
}