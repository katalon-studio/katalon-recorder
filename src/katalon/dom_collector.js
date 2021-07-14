var needPost = true;
var isParentReady = false;

function startDomCollector() {
    // if window is top page
    if (window.location === window.parent.location) {
        setInterval(function(){ 
            if (needPost) {
                console.log('Start posting');
                postDomMap(qAutomate_server_url, createDomMap()); 
                needPost = false;
                console.log('End posting');
            }
        }, 5000);
    } else {
        var sendDomMapInterval = setInterval(function(){ 
            if (isParentReady) {
                sendDomMap();
                clearInterval(sendDomMapInterval);
            }
        }, 5000);
    }
    var arrFrames = document.getElementsByTagName("IFRAME");
    for (var i = 0; i < arrFrames.length; i++) {
        arrFrames[i].contentWindow.postMessage("parentLoadCompleted",  "*");
    }
    arrFrames = document.getElementsByTagName("FRAME");
    for (var i = 0; i < arrFrames.length; i++) {
        arrFrames[i].contentWindow.postMessage("parentLoadCompleted",  "*");
    }
}

function sendDomMap() {
    if (window.location === window.parent.location) {
        needPost = true;
        return;
    }
    var event = {};
    event['name'] = 'loadCompleted';
    event['data'] = createDomMap();
    window.parent.postMessage(JSON.stringify(event), "*");
}

function forwardPostDomMapEvent() {
    if (window.location === window.parent.location) {
        postDomMap(qAutomate_server_url, createDomMap());
        return;
    }
    var event = {};
    event['name'] = 'postDomMap';
    event['data'] = createDomMap();
    window.parent.postMessage(JSON.stringify(event), "*");
}

function postDomMap(url, object) {
    if (!object) {
        return;
    }
    var data = {keyword : 'elementsMap', obj : object, mode: 'INSPECT'  };
    if (detectChrome()) {
        chromePostData(url, data, function(response) {
            if (response) {
                console.log(response)
                // error happenened
                alert(response);
                setTimeout(function() {
                    window.focus();
                }, 1);
                return;
            }
            alert(POST_DOM_MAP_SUCCESS);
        });
        return;
    }
    if (detectIE() && window.httpRequestExtension) {
        var response = window.httpRequestExtension.postRequest(data, url);
        if (response === '200') {
            alert(POST_DOM_MAP_SUCCESS);
            return;
        } else {
            alert(response);
        }
        console.log(response);
        return;
    }
    self.port.emit("postDomMapData", { url : url, data : data });
}