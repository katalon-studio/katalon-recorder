initPortText();
addEventHandler();

function initPortText() {
    getKatalonServerPort( function(port) {
        document.getElementById("port").value = port;
    });
}

function addEventHandler() {
    $('#port').on('input', function() {
        setKatalonServerPort($(this).val())
    });
}