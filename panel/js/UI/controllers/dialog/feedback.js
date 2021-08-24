import { trackingSegment } from "../../services/tracking-service/segment-tracking-service.js";

const htmlString = `
    <div class="header">
        <div class="title">Feedback</div>
         <button id="feedback-close">
              <img src="/katalon/images/SVG/close-icon.svg"/>
          </button>
    </div>
    <div class="content">
        <div class="message">
            Hello there, we redesigned Katalon Recorder and would really appreciate to hear your feedbacks!
        </div>
        <textarea id="feedback-content"></textarea>
    </div>
    <div class="footer">
        <div id="feedback-status">Thank you for your feedback!</div>
        <button id="feedback-cancel">Cancel</button>
        <button class="disable" id="feedback-send">Send</button>
    </div>
`;

function renderFeedbackDialog(){
  $("<div id='feedbackDialog'></div>")
    .html(htmlString)
    .dialog({
      autoOpen: true,
      dialogClass: 'feedbackDialog',
      resizable: true,
      height: "336",
      width: "400",
      modal: true,
      draggable: false,
      open: function(){
        $('.ui-widget-overlay').addClass("dim-overlay");
      },
    }).parent()
    .draggable();
  $("#feedbackDialog").dialog('close');
}

$(document).ready(function(){
  renderFeedbackDialog();

  $("#feedback").click(function(event){
    $("#feedbackDialog").dialog('open');
  });

  $("#feedback-cancel").click(() => {
    $("#feedbackDialog").dialog('close');
    $("#feedback-status").css("display", "none");
  });

  $("#feedback-close").click(() => {
    $("#feedbackDialog").dialog('close');
    $("#feedback-status").css("display", "none");
  });

  $("#feedback-content").on("input", (event) => {
    if (event.target.value.length > 0){
      $("#feedback-send").removeClass("disable");
    } else {
      $("#feedback-send").addClass("disable");
    }
  });

  $("#feedback-send").click(function(event){
    const feedbackContent = $("#feedback-content").val();
    if (feedbackContent.length > 0){
      trackingSegment("kr_feedback", {
        feedback: feedbackContent
      });
      $("#feedback-status").css("display", "block");
    }
  });

})