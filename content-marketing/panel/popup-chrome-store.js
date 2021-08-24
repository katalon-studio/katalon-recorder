import { getChangedProperty } from "../../panel/js/UI/services/tracking-service/playback-local-tracking.js";
import { getTrackingPopupData, setTrackingPopupData } from "../../panel/js/UI/services/tracking-service/popup-tracking.js";
import { trackingSegment } from "../../panel/js/UI/services/tracking-service/segment-tracking-service.js";


function userAgree() {
  let url;
  if (bowser.name === "Firefox") {
    url = "https://addons.mozilla.org/en-US/firefox/addon/katalon-automation-record/"
  } else {
    url = "https://chrome.google.com/webstore/detail/katalon-recorder-selenium/ljdobmomdgdljniojadhoplhkpialdid"
  }
  browser.tabs.create({
    url: url,
    windowId: contentWindowId
  });
  let action = {
    agreeToReview: "yes"
  };
  trackingSegment("kru_review_kr", action);
}

function userRefuse() {
  let action = {
    agreeToReview: "no"
  };
  trackingSegment("kru_review_kr", action);
}


function popupRateUsDialog() {
  let popup = $("#rateUsDialog");
  if (popup.length) {
    $(popup).show();
    return;
  }

  let dialogHTML = `
    <div style="text-align:center; font-size: 15px;"><strong>Give us a review</strong></div>
    </br>
    <span>
    Are you using Katalon Recorder to make your life more simple? If yes, take a second to leave your <b>feedback</b> on ${bowser.name} store.
    </span>
    </br>
    <style>
        .rateUsBtn{
            border-radius: 5px;
            padding: 5px;
            border: none;
            color: black;
        }
        #rateUs-later:hover{
            background-color: #d7dbdb;
        }
        #rateUs-okay{
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
        }
        #rateUs-okay:hover{
            background-color: #1d42af;
        }
    </style>
    <div style="margin-top:10px; text-align: center">
        <button id="rateUs-later" class="rateUsBtn" type="button" style="margin-right: 10px"><u>Maybe Later</u></button>
        <button id="rateUs-okay" class="rateUsBtn" type="button">Yep, why not!</button>
    </div>`;

  popup = $('<div id="rateUsDialog"></div>').css({
    'position': 'absolute',
    'display': 'none',
    'bottom': '50px',
    'z-index': '1',
    'background-color': '#f1f1f1',
    'max-width': '250px',
    'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
    'padding': '10px',
    'margin-bottom': '-1%',
    'right': '0',
    'color': 'black'
  }).html(dialogHTML);
  $("body").append(popup);

  $("#rateUs-later").click(function () {
    userRefuse();
    $(popup).hide();
  });

  $("#rateUs-okay").click(async function () {
    await setTrackingPopupData("rateOnStore", { rateOnStore: true })
    userAgree();
    $(popup).hide();
  });
  $(popup).show();
}

async function shouldDisplayRateWebStorePopup(testCaseExecutionNum) {
  const threshold = 20;
  return testCaseExecutionNum % threshold === 0;
}

$(document).ready(function () {
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (Object.keys(changes).includes("playbackTracking")) {
      let oldValue = changes.playbackTracking.oldValue;
      let newValue = changes.playbackTracking.newValue;
      let changeProperty = getChangedProperty(oldValue, newValue);
      if ((changeProperty === "playTestCaseSuccess" || changeProperty === "playTestCaseFail") && await shouldDisplayRateWebStorePopup(newValue.playTestCaseSuccess + newValue.playTestCaseFail)) {
        popupRateUsDialog();
      }
    }
  });
});