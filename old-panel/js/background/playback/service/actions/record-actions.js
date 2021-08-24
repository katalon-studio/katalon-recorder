import { checkLoginOrSignupUser } from "../../../../../../content-marketing/panel/login-inapp.js";
import { trackingLocalPlayback } from "../../../../UI/services/tracking-service/playback-local-tracking.js";
import { trackingRecord } from "../../../../UI/services/tracking-service/segment-tracking-service.js";
import { getSelectedSuite } from "../../../../UI/view/testcase-grid/selected-suite.js";
import { findTestSuiteById } from "../../../../UI/services/data-service/test-suite-service.js";
import { getAllTestCaseCount } from "../../../../UI/services/data-service/test-case-service.js";

const recordAction = async () => {
  const selectedTestSuite = getSelectedSuite();
  const testSuiteID = selectedTestSuite?.id;
  const testSuite = findTestSuiteById(testSuiteID);

  if (getAllTestCaseCount() === 0 || testSuite?.getTestCaseCount() === 0) {
    //when the above conditions are met, record will create new test case
    let result = await checkLoginOrSignupUser();
    if (!result) {
      return;
    }
  }
  isRecording = !isRecording;
  if (isRecording) {
    doRecord();
    trackingRecord();
  } else {
    if (getAllTestCaseCount() > 0) {
      //make sure that users is actually record a test case
      //not a miss click
      let data = await getCheckLoginData();
      data.checkLoginData.testCreated++;
      await browser.storage.local.set(data);
    }

    recorder.detach();
    browser.tabs.query({ windowId: extCommand.getContentWindowId(), url: "<all_urls>" })
      .then(function (tabs) {
        for (let tab of tabs) {
          browser.tabs.sendMessage(tab.id, { detachRecorder: true });
        }
      });
    // KAT-BEGIN add space for record button label
    $("#record")[0].childNodes[1].textContent = " Record";
    switchRecordButton(true);
    // KAT-END
    trackingLocalPlayback("record");
  }
}

function doRecord() {
  let recordButton = document.getElementById("record");
  recorder.attach();
  notificationCount = 0;
  // KAT-BEGIN focus on window when recording
  if (contentWindowId) {
    browser.windows.update(contentWindowId, { focused: true });
  }
  // KAT-END
  browser.tabs.query({ windowId: extCommand.getContentWindowId(), url: "<all_urls>" })
    .then(function (tabs) {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, { attachRecorder: true });
      }
    });
  // KAT-BEGIN add space for record button label
  recordButton.childNodes[1].textContent = " Stop";
  switchRecordButton(false);
  // KAT-END
}

export { recordAction }