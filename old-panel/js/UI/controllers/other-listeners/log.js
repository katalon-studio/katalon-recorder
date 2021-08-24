import { saveLog } from "../../services/html-service/save-log.js";

$(document).ready(function() {
    $("#save-log").click(saveLog);

    $("#clear-log").click(function(){
        emptyNode(document.getElementById("logcontainer"));
    })
})