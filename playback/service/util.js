import { getSelfHealingSettingLocatorsList } from "../../panel/js/UI/services/self-healing-service/utils";

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


async function getCommandTargetOptions(baseOptionList){
  let optionList = [];
  let locatorList = await getSelfHealingSettingLocatorsList();
  //get option base on priority in locator list
  optionList = locatorList.reduce((prev, locator) => {
    let reg = new RegExp(`^${locator}`);
    let filterOptionList = baseOptionList.filter(opt => reg.exec(opt)?.length);
    prev.push(...filterOptionList);
    return prev;
  }, []);

  let otherOptionList = baseOptionList.filter(option => {
    return !optionList.includes(option);
  });
  optionList.push(...otherOptionList);
  return optionList;
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