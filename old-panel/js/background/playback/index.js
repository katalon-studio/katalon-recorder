import { ExtCommand } from "../window-controller.js";
import { commandFactory } from "./service/command/CommandFactory.js";

window.isSelecting = false;
window.extCommand = new ExtCommand();
window.currentPlayingFromHereCommandIndex = 0;


window.segmentService = async function () {
  return await import('../../UI/services/tracking-service/segment-tracking-service.js');
}


window.onload = function () {

  $("#refercontainer").hide();
  $('#command-command').on('input change', function () {
    scrape(document.getElementById("command-command").value);
  });



  $("#record").click(function () {
    let command = commandFactory.createCommand("record");
    command.execute();
  });
  $("#playback").click(function () {
    let command = commandFactory.createCommand("playTestCase");
    command.execute();
  });
  $("#stop").click(function () {
    let command = commandFactory.createCommand("stop");
    command.execute();
  });
  $("#pause").click(function () {
    let command = commandFactory.createCommand("pause");
    command.execute();
  });
  $("#resume").click(function () {
    let command = commandFactory.createCommand("resume");
    command.execute();
  });
  $("#playSuite").click(function () {
    let command = commandFactory.createCommand("playTestSuite");
    command.execute();
  });
  $("#playSuites").click(function () {
    let command = commandFactory.createCommand("playAll");
    command.execute();
  });
  $("#showElementButton").click(function () {
    let command = commandFactory.createCommand("showElement");
    command.execute();
  });
  $("#selectElementButton").click(function () {
    let command = commandFactory.createCommand("selectElement");
    command.execute();
  });

  $(document).dblclick(function (event) {
    let command = commandFactory.createCommand("executeTestStep", event);
    command.execute();
  });
};



