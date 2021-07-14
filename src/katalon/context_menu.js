function context_processObject(object) {
    if (!(window.location === window.parent.location)) {
        var event = {};
        event['name'] = 'context_forwardObject';
        event['data'] = object;
        window.parent.postMessage(JSON.stringify(event), "*");
        return;
    }
    context_postData(qAutomate_server_url, object);
}

function context_sendData(element) {
    if (!element) {
        return;
    }
    if (element.nodeName.toLowerCase() == 'iframe') {
        element.contentWindow.postMessage({msg: "context_keyboardTriggerEvent", body : element}, "*");
    } else {
        var jsonObject = mapDOM(element, window);
        context_processObject(jsonObject);
    }
}

function context_postData(url, object) {
    if (!object) {
        return;
    }
    var data = { keyword : 'element', obj : object, mode: 'INSPECT'  }
    if (detectChrome()) {
        chromePostData(url, data, function(response) {
            if (response) {
                // error happenened
                alert(response);
                setTimeout(function() {
                    window.focus();
                }, 1);
                return;
            }
        });
        return;
    }
    if (detectIE() && window.httpRequestExtension) {
        var response = window.httpRequestExtension.postRequest(data, url);
        if (response !== '200') {
            alert(response);
        }
        return;
    }
    self.port.emit("context_postData", {
        url : url,
        data : data
    });
}

function context_setParentJson(object, parentJson) {
    if ('parent' in object) {
        context_setParentJson(object['parent'], parentJson);
        return;
    }
    object['parent'] = parentJson;
}

function context_receiveMessage(event) {
    // Check if sender is from parent frame
    if (event.source === window.parent) {
        if (event.data.msg == "context_keyboardTriggerEvent") {
            context_sendData(event.data.body);
        }
        return;
    }
    // Check if sender is from any child frame belong to this window
    var childFrame = null;
    var arrFrames = document.getElementsByTagName("IFRAME");
    for (var i = 0; i < arrFrames.length; i++) {
        if (arrFrames[i].contentWindow === event.source) {
            childFrame = arrFrames[i];
            break;
        }
    }
    arrFrames = document.getElementsByTagName("FRAME");
    for (var i = 0; i < arrFrames.length; i++) {
        if (arrFrames[i].contentWindow === event.source) {
            childFrame = arrFrames[i];
            break;
        }
    }
    if (!childFrame) {
        return;
    }
    context_currentEventOrigin = event.origin;
    var eventObject = JSON.parse(event.data);
    if(eventObject['name'] =='context_forwardObject') {
        var object = eventObject['data'];
        var json = mapDOM(childFrame, window);
        if (json) {
            context_setParentJson(object, json);
        }
        context_processObject(object);
        return;
    }
}