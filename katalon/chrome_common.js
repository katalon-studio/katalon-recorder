var katalonServerPortStorage = "katalonServerPortStorage";

function setKatalonServerPort(port) {
    chrome.storage.local.set({ katalonServerPortStorage : port },  
    function() {
        if (chrome.runtime.error) {
            console.log("Runtime error setting server port to storage.");
            return;
        }
        console.log("Katalon server port set to " + port);
    });
}

function getKatalonServerPort(callback) {
    chrome.storage.local.get(katalonServerPortStorage, function(result) {
        var port;
        if (!(katalonServerPortStorage in result)) {
            port = (bowser.name == "Chrome") ? (katalonServerPort ? katalonServerPort : katalonServerPortForChrome) : katalonServerPortForFirefox;
            setKatalonServerPort(port);
        } else {
            port = result[katalonServerPortStorage];
        }
        callback(port);
    })
}

function chromePostData(url, data, callback) {
    chrome.runtime.sendMessage({
        method: XHTTP_POST_METHOD,
        action: XHTTP_ACTION,
        url: url,
        data: data
    }, callback);
}