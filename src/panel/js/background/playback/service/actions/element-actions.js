const selectElementAction = () => {
  let button = document.getElementById("selectElementButton");
  if (isSelecting) {
    isSelecting = false;
    // KAT-BEGIN hide button label and remove active class
    button.classList.remove("active");
    // KAT-END
    browser.tabs.query({
      active: true,
      windowId: contentWindowId
    }).then(function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, { selectMode: true, selecting: false });
    }).catch(function (reason) {
      console.log(reason);
    })
    return;
  }

  isSelecting = true;
  if (isRecording)
    $("#record").click();
  // KAT-BEGIN hide button label and add active class
  button.classList.add("active")
  // KAT-END
  browser.tabs.query({
    active: true,
    windowId: contentWindowId
  }).then(function (tabs) {
    if (tabs.length === 0) {
      console.log("No match tabs");
      isSelecting = false;
      // KAT-BEGIN hide button label and add active class
      // button.textContent = "Select";
      button.classList.remove("active");
      // KAT-END
    } else
      browser.tabs.sendMessage(tabs[0].id, { selectMode: true, selecting: true });
  })
}

const showElementAction = () => {
  try {
    let targetValue = document.getElementById("command-target").value;
    if (targetValue === "auto-located-by-tac") {
      targetValue = document.getElementById("command-target-list").options[0].text;
    }
    browser.tabs.query({
      active: true,
      windowId: contentWindowId
    }).then(function (tabs) {
      if (tabs.length === 0) {
        console.log("No match tabs");
      } else {
        browser.webNavigation.getAllFrames({ tabId: tabs[0].id })
          .then(function (framesInfo) {
            let frameIds = [];
            for (let i = 0; i < framesInfo.length; i++) {
              frameIds.push(framesInfo[i].frameId)
            }
            frameIds.sort();
            let infos = {
              "index": 0,
              "tabId": tabs[0].id,
              "frameIds": frameIds,
              "targetValue": targetValue
            };
            sendShowElementMessage(infos);
          });
      }
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * Send the show element message to content script.
 * @param {Object} infos - a necessary information object.
 *  - key index {Int}
 *  - key tabId {Int}
 *  - key frameIds {Array}
 *  - key targetValue {String}
 */
function sendShowElementMessage(infos) {
  browser.tabs.sendMessage(infos.tabId, {
    showElement: true,
    targetValue: infos.targetValue
  }, {
    frameId: infos.frameIds[infos.index]
  }).then(function (response) {
    if (response) {
      if (!response.result) {
        prepareSendNextFrame(infos);
      } else {
        let text = infos.index === 0 ? "top" : index.toString() + "(id)";
        sideex_log.info("Element is found in " + text + " frame.");
      }
    }
  }).catch(function (error) {
    if (error.message === "Could not establish connection. Receiving end does not exist.") {
      prepareSendNextFrame(infos);
    } else {
      sideex_log.error("Unknown error");
    }
  });
}

function prepareSendNextFrame(infos) {
  if (infos.index === infos.frameIds.length) {
    sideex_log.error("Element is not found.");
  } else {
    infos.index++;
    sendShowElementMessage(infos);
  }
}

export { selectElementAction, showElementAction }