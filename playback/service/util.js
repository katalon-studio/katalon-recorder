import { getCommandTargetOptions } from "../../panel/js/self-healing/service/utils.js";

const getRecordsArray = (casesHTMLList) => {
  let tbody = document.createElement("tbody");
  tbody.innerHTML = casesHTMLList;
  return tbody.getElementsByTagName("tr");
}


const getCommandName = (tr) => {
  return tr?.children[0]?.innerText ?? "";
}

const getCommandTarget = (tr) => {
  return tr?.children[1]?.childNodes[0]?.textContent ?? "";
}

const getCommandValue = (tr) => {
  return tr?.childNodes[2]?.innerText ?? "";
}

const isExtCommand = (command) => {
  switch (command) {
    case "pause":
    //case "open":
    case "selectFrame":
    case "selectWindow":
    case "close":
      return true;
    default:
      return false;
  }
}

const isWindowMethodCommand = (command) => {
  return command === "answerOnNextPrompt"
    || command === "chooseCancelOnNextPrompt"
    || command === "assertPrompt"
    || command === "chooseOkOnNextConfirmation"
    || command === "chooseCancelOnNextConfirmation"
    || command === "assertConfirmation"
    || command === "assertAlert"
    || command === "verifyAlert";
}

const getPossibleTargetList = async (currentCommand) => {
  let possibleCommandTargets = await getCommandTargetOptions(currentCommand);
  let currentCommandTarget = getCommandTarget(currentCommand);
  // remove current target from possible target list
  let index = possibleCommandTargets.indexOf(currentCommandTarget);
  if (index !== -1) {
    possibleCommandTargets.splice(index, 1);
  }
  return possibleCommandTargets;
}

export { getRecordsArray, getCommandValue, getCommandName, getCommandTarget, isExtCommand, isWindowMethodCommand, getPossibleTargetList }