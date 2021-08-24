import { getChangedProperty } from "../../panel/js/UI/services/tracking-service/playback-local-tracking.js";
import { trackingSegment } from "../../panel/js/UI/services/tracking-service/segment-tracking-service.js";

function popupWhatAreYouAutomating() {
  let popup = $("#whatAreYouAutomatingPopup");
  if (popup.length) {
    $(popup).show();
    return;
  }

  let dialogHTML = `
    <div style="text-align:center; font-size: 15px;"><strong>What are you automating?</strong></div>
    </br>
    <span>
    I am using Katalon Recorder to ....
    </span>
    </br>
    </br>
    <textarea id="useCase" placeholder="Please tell us about your automation use case"></textarea>
    <style>
        #useCase{
            font-size: 12px;
            width: 300px;
            height: 80px;
        }
        #useCase::placeholder{
            font-size: 12px;
        }
        .whatAreYouAutomatingBtn{
            border-radius: 5px;
            padding: 5px;
            border: none;
            color: black
        }
        #whatAreYouAutomating-cancel:hover{
            background-color: #d7dbdb;
        }
        #whatAreYouAutomating-submit{
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
        }
        #whatAreYouAutomating-submit:hover{
            background-color: #1d42af;
        }
    </style>
    <div style="margin-top:10px; text-align: right">
        <button id="whatAreYouAutomating-cancel" class="whatAreYouAutomatingBtn" type="button" style="margin-right: 10px"><u>Cancel</u></button>
        <button id="whatAreYouAutomating-submit" class="whatAreYouAutomatingBtn" type="button">Submit</button>
    </div>`;

  popup = $('<div id="whatAreYouAutomatingPopup"></div>').css({
    'position': 'absolute',
    'display': 'none',
    'bottom': '50px',
    'z-index': '1',
    'background-color': '#f1f1f1',
    'max-width': '350px',
    'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
    'padding': '10px',
    'margin-bottom': '-1%',
    'right': '0',
    'color': 'black'

  }).html(dialogHTML);
  $("body").append(popup);
  $(popup).show();

  $("#whatAreYouAutomating-cancel").click(function () {
    $(popup).hide();
    $(popup).remove();
  });

  $("#whatAreYouAutomating-submit").click(function () {
    let userInput = $("#useCase").val();
    trackingSegment("kru_popup_automation_use_case", { answer: userInput });
    $(popup).remove();
  })
}


async function changeHandler(changes) {
  if (Object.keys(changes).includes("checkLoginData")) {
    let oldValue = changes.checkLoginData.oldValue;
    let newValue = changes.checkLoginData.newValue;
    let changeProperty = getChangedProperty(oldValue, newValue);
    if (changeProperty === "testCreated") {
      if (newValue.testCreated === 4) {
        popupWhatAreYouAutomating();
        browser.storage.onChanged.removeListener(changeHandler);
      }
    }
  }
}

$(document).ready(function () {
  browser.storage.onChanged.addListener(changeHandler);
})