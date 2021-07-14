import {
  getChangedProperty,
  getTrackingPlayBackData,
  isUserFirstTime
} from "../../tracking/playback-local-tracking.js";
import { displayTipPanel } from "../service/display-tips-panel.js";


async function displayRecordTips() {
  let data = await getTrackingPlayBackData();
  if (isUserFirstTime(data)) {
    let panelDescription = {
      element: "#record",
      content: "Go to the tab you want to automate and click Record to start creating an automation script.",
      placement: "bottom",
      title: "Product Tip",
      animation: false
    }
    displayTipPanel(panelDescription);
  } else if (data.recordNum === 1 && (data.playTestCaseSuccess === 0)) {
    let panelDescription = {
      element: "#playback",
      content: "Click Play to execute or click Record to append more steps to the automation script you just created.",
      placement: "bottom",
      title: "Product Tip",
      animation: false
    }
    displayTipPanel(panelDescription);
  }
}

async function displayPlayTessCaseFailTips() {
  let data = await getTrackingPlayBackData();
  if (data.playTestCaseFail === 1) {
    let panelDescription = {
      element: "#records-grid .fail",
      content: `That's okay, take a look at <a target="_blank" href="https://docs.katalon.com/katalon-recorder/docs/faq-and-troubleshooting-instructions.html">our FAQ page.</a>`,
      placement: "bottom",
      title: "Product Tip",
      animation: false
    }
    displayTipPanel(panelDescription);
  } else if (data.playTestCaseFail === 2) {
    let panelDescription = {
      element: "#records-grid .fail",
      content: `Don't be discouraged, open a topic on our <a target="_blank" href="https://forum.katalon.com/c/katalon-recorder/">community</a> to ask experts for help.`,
      placement: "bottom",
      title: "Product Tip",
      animation: false
    }
    await displayTipPanel(panelDescription);
  }

}

async function displayPlayTessCaseSuccessTips() {
  let data = await getTrackingPlayBackData();
  if (data.playTestCaseSuccess === 1) {
    $("#sample-project").click();
    let panelDescription = {
      element: "#add-sample-project",
      content: `These sample projects can help you automate your first scenario sucecssfully. Add them now or later in <b>Help > Sample Projects</b>.`,
      placement: "top",
      title: "Product Tip",
      animation: false,

    }
    await displayTipPanel(panelDescription);
  }
}

async function displayReferralTips() {
  let data = await browser.storage.local.get("tracking");
  if (data?.tracking?.isUpdated) {
    let panelDescription = {
      element: "#referral",
      content: "Refer KR to your friend/colleague and win a $100 e-gift card in the process.",
      placement: "bottom",
      title: "Product Tip",
      animation: false
    }
    await displayTipPanel(panelDescription);
    await browser.storage.local.remove("tracking");
  }
}

$(document).ready(function () {
  displayReferralTips().then(displayRecordTips);
  browser.storage.onChanged.addListener(async (changes) => {
    if (Object.keys(changes).includes("playbackTracking")) {
      let oldValue = changes.playbackTracking.oldValue;
      let newValue = changes.playbackTracking.newValue;
      let changeProperty = getChangedProperty(oldValue, newValue);
      switch (changeProperty) {
        case "recordNum":
          await displayRecordTips();
          break;
        case "playTestCaseSuccess":
          await displayPlayTessCaseSuccessTips();
          break;
        case "playTestCaseFail":
          await displayPlayTessCaseFailTips();
          break;
      }
    }
  });
});
