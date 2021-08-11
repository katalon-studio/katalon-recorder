function isObjectEmpty(obj){
    return obj
        && Object.keys(obj).length === 0
        && obj.constructor === Object
}

async function setDefaultSettingData(){
    browser.storage.local.set({
        setting: {
            "self-healing":{
                enable: true,
                locator: ["id", "xpath", "css"],
                excludeCommands: ["verifyElementPresent", "verifyElementNotPresent", "assertElementPresent", "assertElementNotPresent"],
            }
        }
    });
}

const loadSettingData = async () => {
    let settingData = await browser.storage.local.get("setting");
    if (isObjectEmpty(settingData)){
        await setDefaultSettingData();
    }
}

export {loadSettingData}

loadSettingData();