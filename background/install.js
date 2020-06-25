// KAT-BEGIN show docs on install or upgrade from 1.0
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: 'https://www.katalon.com/sign-up/?utm_source=browser%20store&utm_campaign=installed%20KR'
        });
    }
    // else if (details.reason === 'update') {
    //     var previousVersion = details.previousVersion;
    //     var previousMajorVersion = previousVersion.substring(0, previousVersion.indexOf('.'));
    //     if (previousMajorVersion === '1') {
    //         chrome.tabs.create({ 'url': 'https://www.katalon.com' });
    //     }
    // }
});

chrome.runtime.setUninstallURL('https://www.katalon.com/sign-up/?utm_source=browser%20store&utm_campaign=uninstalled%20KR');
// KAT-END
