import { saveLog } from "../../services/html-service/save-log.js";

$(document).ready(function() {
    $("#save-log").click(saveLog);

    $("#clear-log").click(function(){
        $("#ka-upload").addClass("disable");
        emptyNode(document.getElementById("logcontainer"));
    })
})