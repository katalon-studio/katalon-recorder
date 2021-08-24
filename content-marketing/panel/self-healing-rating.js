import { getChangedProperty } from "../../panel/js/UI/services/tracking-service/playback-local-tracking.js";
import { trackingSegment } from "../../panel/js/UI/services/tracking-service/segment-tracking-service.js";

function popupSelfHealingRating() {
  let popup = $("#self-healing-rating");
  if (popup.length) {
    $(popup).show();
    return;
  }

  let dialogHTML = `
    <span>
    Self-healing automatically healed your tests a few times. Has it been useful for you?
    </span>
    <div style="margin-top:5px; text-align: center">
        <input type="radio" name="selfHealingRating" value="dunnoyet">
        <label for="dunnoyet">I don't know yet.</label>
        <input type="radio" name="selfHealingRating" value="no">
        <label for="no">No</label>
        <input type="radio" name="selfHealingRating" value="yes">
        <label for="yes">Yes</label>
    </div>
    <style>
        #selfHealingSubmit{
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
            font-size: 12px;
            padding: 2px 5px;
        }
        #selfHealingSubmit:hover{
            background-color: #1d42af;
            cursor: pointer;
        }
    </style>
    <div style="margin-top:10px; text-align: right">
        <button id="selfHealingSubmit" type="button">Submit</button>
    </div>`;

  popup = $('<div id="self-healing-rating"></div>').css({
    'position': 'absolute',
    'display': 'none',
    'bottom': '50px',
    'z-index': '1',
    'background-color': '#f1f1f1',
    'width': '250px',
    'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
    'padding': '10px 5px',
    'margin-bottom': '-1%',
    'right': '0',
    'color': 'black'

  }).html(dialogHTML);
  $("body").append(popup);
  popup.show();

  $("#selfHealingSubmit").click(function () {
    let userChoiceInput = $(
      "input:radio[name=selfHealingRating]:checked"
    ).val();
    if (userChoiceInput === undefined){
      userChoiceInput = "dunnoyet";
    }
    trackingSegment("kru_rate_self_healing", {"userAnswer": userChoiceInput})
    $(popup).hide();
  });
}

function eventHandler(changes) {
  const threshold = 10;
  if (changes.playbackTracking) {
    let oldValue = changes.playbackTracking.oldValue;
    let newValue = changes.playbackTracking.newValue;
    let changedValue = getChangedProperty(oldValue, newValue);
    if (changedValue === "selfHealing" && newValue.selfHealing === threshold) {
      popupSelfHealingRating();
      browser.storage.onChanged.removeListener(eventHandler);
    }
  }
}

$(document).ready(function () {
  browser.storage.onChanged.addListener(eventHandler)
})