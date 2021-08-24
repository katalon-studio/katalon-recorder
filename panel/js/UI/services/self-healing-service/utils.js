const getSelfHealingSettingLocatorsList = async () => {
  let settingData = await browser.storage.local.get("setting");
  if (isObjectEmpty(settingData)) {
    return [];
  }
  settingData = settingData.setting;
  let selfHealingSetting = settingData["self-healing"];
  return selfHealingSetting.locator;
}

function isObjectEmpty(obj) {
  return obj
    && Object.keys(obj).length === 0
    && obj.constructor === Object
}

const isSelfHealingEnable = async () => {
  let settingData = await browser.storage.local.get("setting");
  if (isObjectEmpty(settingData)) {
    return false;
  }
  settingData = settingData.setting;
  let selfHealingSetting = settingData["self-healing"];
  return selfHealingSetting.enable;
}

const isCommandExcluded = async (commandName) => {
  let settingData = await browser.storage.local.get("setting");
  if (isObjectEmpty(settingData)) {
    return false;
  }
  settingData = settingData.setting;
  let selfHealingSetting = settingData["self-healing"];
  let excludedCommands = selfHealingSetting.excludeCommands;
  for (let command of excludedCommands) {
    try {
      let regExp = new RegExp(command);
      if (regExp.exec(commandName) !== null) {
        return true;
      }
    } catch (e) {
      if (command === commandName) {
        return true;
      }
    }
  }
  return false;
}

const isSelfHealingTabDisplay = () => {
  return $("#selfHealingContainer").css("display") !== "none";
}


const getPossibleTargetList = async (currentCommand) => {
  let possibleCommandTargets = [];
  //get data from user setting
  let locatorList = await getSelfHealingSettingLocatorsList();
  //get option base on priority in locator list
  possibleCommandTargets = locatorList.reduce((prev, locator) => {
    let reg = new RegExp(`^${locator}`);
    let filterOptionList = currentCommand.targets.filter(opt => reg.exec(opt)?.length);
    prev.push(...filterOptionList);
    return prev;
  }, []);
  //push other options to the end
  let otherOptionList = currentCommand.targets.filter(option => {
    return !possibleCommandTargets.includes(option);
  });
  possibleCommandTargets.push(...otherOptionList);
  // remove current target from possible target list
  let currentCommandTarget = currentCommand.target;
  let index = possibleCommandTargets.indexOf(currentCommandTarget);
  if (index !== -1) {
    possibleCommandTargets.splice(index, 1);
  }
  return possibleCommandTargets;
}

export {
  getPossibleTargetList,
  getSelfHealingSettingLocatorsList,
  isSelfHealingEnable,
  isCommandExcluded,
  isSelfHealingTabDisplay,
}