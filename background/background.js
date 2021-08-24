/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

var master = {};
var clickEnabled = true;
const popupWindowIDs = [];

// open main window
function openPanel(tab) {
    let contentWindowId = tab.windowId;
    if (master[contentWindowId] != undefined) {
        browser.windows.update(master[contentWindowId], {
            focused: true
        }).catch(function(e) {
            master[contentWindowId] == undefined;
            openPanel(tab);
        });
        return;
    } else if (!clickEnabled) {
        return;
    }

    clickEnabled = false;
    setTimeout(function() {
        clickEnabled = true;
    }, 1000);

    // open GUI with specified size
    var f = function(height, width, oldUI) {
        const url = oldUI ? "old-panel/index.html" : "panel/index.html"
        browser.windows.create({
            url: browser.runtime.getURL(url),
            type: "popup",
            height: height,
            width: width
        }).then(function waitForPanelLoaded(panelWindowInfo) {
            return new Promise(function(resolve, reject) {
                let count = 0;
                let interval = setInterval(function() {
                    if (count > 100) {
                        reject("SideeX editor has no response");
                        clearInterval(interval);
                    }

                    browser.tabs.query({
                        active: true,
                        windowId: panelWindowInfo.id,
                        status: "complete"
                    }).then(function(tabs) {
                        if (tabs.length != 1) {
                            count++;
                            return;
                        } else {
                            master[contentWindowId] = panelWindowInfo.id;
                            if (Object.keys(master).length === 1) {
                                createKrMenus();
                            }
                            resolve(panelWindowInfo);
                            clearInterval(interval);
                        }
                    })
                }, 500);
            });
        }).then(function bridge(panelWindowInfo){
            popupWindowIDs.push(panelWindowInfo.id);
            return browser.tabs.sendMessage(panelWindowInfo.tabs[0].id, {
                selfWindowId: panelWindowInfo.id,
                commWindowId: contentWindowId
            });
        }).catch(function(e) {
            console.log(e);
        });
    };

    // get previous window size, and open the window

    browser.storage.local.get("UIStyle").then(result => {
        if (result.UIStyle === "old"){
            getWindowSize(f, true);
        } else {
            getWindowSize(f, false);
        }

    } )


}


browser.browserAction.onClicked.addListener(openPanel);

browser.windows.onRemoved.addListener(function(windowId) {
    // if (popupWindowIDs.includes(windowId)){
    //     const index = popupWindowIDs.indexOf(windowId);
    //     popupWindowIDs.splice(index, 1);
    //     segment().then(r=>r.trackingCloseApp());
    // }
    let keys = Object.keys(master);
    for (let key of keys) {
        if (master[key] === windowId) {
            delete master[key];
            if (keys.length === 1) {
                browser.contextMenus.removeAll();
            }
        }
    }
});

async function segment() {
    const segmentSer =  await import('../panel/js/UI/services/tracking-service/segment-tracking-service.js');
    return segmentSer;
}


// context menu
function createKrMenus() {
    browser.contextMenus.create({
        id: "verifyText",
        title: "verifyText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "verifyTitle",
        title: "verifyTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "verifyValue",
        title: "verifyValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertText",
        title: "assertText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertTitle",
        title: "assertTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertValue",
        title: "assertValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeText",
        title: "storeText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeTitle",
        title: "storeTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeValue",
        title: "storeValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForElementPresent",
        title: "waitForElementPresent",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForElementNotPresent",
        title: "waitForElementNotPresent",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForTextPresent",
        title: "waitForTextPresent",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForTextNotPresent",
        title: "waitForTextNotPresent",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForValue",
        title: "waitForValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForNotValue",
        title: "waitForNotValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForVisible",
        title: "waitForVisible",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "waitForNotVisible",
        title: "waitForNotVisible",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
}

var port;
browser.contextMenus.onClicked.addListener(function(info, tab) {
    port.postMessage({ cmd: info.menuItemId });
});

browser.runtime.onConnect.addListener(function(m) {
    port = m;
});
