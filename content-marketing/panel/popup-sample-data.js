import { getChangedProperty } from "../../panel/js/UI/services/tracking-service/playback-local-tracking.js";
import { trackingSegment } from "../../panel/js/UI/services/tracking-service/segment-tracking-service.js";

function popupRateUsDialog() {
  let popup = $("#addSampleDataDialog");
  if (popup.length) {
    $(popup).show();
    return;
  }

  let dialogHTML = `
    <div style="text-align:center; font-size: 13px;">Were the sample projects useful?</div>
    </br>
    <div style="text-align:center">
      <input type="radio" name="addSample" value="yes" unchecked>
      <label for="yes">Yes</label>
      <input type="radio" name="addSample" value="no" unchecked>
      <label for="no">No</label>
    </div>
    <style>
        #addSample-submit{
            padding: 5px;
            border: none;
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
        }
        #addSample-submit:hover{
            background-color: #1d42af;
        }
    </style>
    <div style="margin-top:10px; text-align: center">
        <button id="addSample-submit" class="rateUsBtn" type="button" style="margin-right: 10px">Submit</button>
    </div>
    `;

  popup = $('<div id="addSampleDataDialog"></div>').css({
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
  $(popup).show();

  $("#addSample-submit").click(function () {
    let userChoiceInput = $(
      "input:radio[name=addSample]:checked"
    ).val() ?? "false";
    trackingSegment("kru_rate_sample_project", { isHelpful: userChoiceInput })
    $(popup).hide();
  })
}


async function changeHandler(changes) {
  if (Object.keys(changes).includes("playbackTracking")) {
    let oldValue = changes.playbackTracking.oldValue;
    let newValue = changes.playbackTracking.newValue;
    let changeProperty = getChangedProperty(oldValue, newValue);
    if (["playTestCaseSuccess", "playTestCaseFail"].includes(changeProperty)) {
      let executionNum = newValue.playTestCaseSuccess + newValue.playTestCaseFail;
      let addSampleData = (await browser.storage.local.get("addSample"))?.addSample ?? {};
      if (executionNum - addSampleData.numOfExecution === 4 && addSampleData.isAddSample === true) {
        popupRateUsDialog();
        browser.storage.onChanged.removeListener(changeHandler);
      }
    }
  }
}


$(document).ready(function () {
  browser.storage.onChanged.addListener(changeHandler);
})