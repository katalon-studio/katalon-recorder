//GLOBALS
var spy_hoverElement; // whatever element the mouse is over
var spy_infoDiv; // parent div to contains information
var spy_instructionDiv; // instruction div to guide user how to capture object
var spy_elementInfoDiv; // informational div to show xpath of current hovered
// element
var spy_elementInfoDivText; // xpath text to show in spy_elementInfoDiv
var spy_currentEventOrigin; // store event origin for posting message
// html elements
var space = '\u00A0';
var dot = '\u25CF';

// default hot key config
var spy_captureObjectHotKey = {
    keyCode : 192, // ~
    useAltKey : true,
    useShiftKey : false,
    useCtrlKey : false,
    useMetaKey : false
};

var spy_loadDomMapHotKey = {
    keyCode : 192, // ~
    useAltKey : true,
    useShiftKey : false,
    useCtrlKey : true,
    useMetaKey : false
};

// setup
function spy_setupEventListeners() {
    document.onkeyup = spy_keyUp;
    document.onmouseover = spy_mouseOver;
    document.onmouseout = spy_mouseOut;
    window.onmousemove = spy_mouseMoveWindow;
    window.onmouseout = spy_mouseOutWindow;

    if (window.addEventListener) {
        window.addEventListener("message", spy_receiveMessage, false);
    } else {
        window.attachEvent("onmessage", spy_receiveMessage);
    }
}

function spy_disposeEventListeners() {
    document.onkeyup = null;
    document.onmouseover = null;
    document.onmouseout = null;
    window.onmousemove = null;
    window.onmouseout = null;

    if (window.addEventListener) {
        window.removeEventListener("message", spy_receiveMessage);
    } else {
        window.detachEvent("onmessage", spy_receiveMessage);
    }
}

// setup informational div to show which element the mouse is over.
function spy_createInfoDiv() {
    addCustomStyle();
    spy_infoDiv = document.createElement('div');
    spy_infoDiv.id = 'katalon';
    if (isInTopWindow()) {
        spy_createInstructionDiv();
    }
    spy_createXpathDiv();
    document.body.appendChild(spy_infoDiv);
}

function spy_removeInfoDiv() {
    spy_infoDiv.parentNode.removeChild(spy_infoDiv);
    spy_infoDiv = null;
    spy_instructionDiv = null;
    spy_elementInfoDiv = null;
    spy_elementInfoDivText = null;
    spy_currentEventOrigin = null;
}

function spy_createInstructionDiv() {
    spy_instructionDiv = document.createElement('div');
    spy_instructionDiv.id = 'katalon-spy_instructionDiv';

    addSpanElementToElement('Capture object: ', spy_instructionDiv)
    createElementForHotKey(spy_captureObjectHotKey, spy_instructionDiv)

    addSpanElementToElement(dot + ' Load DOM Map: ', spy_instructionDiv)
    createElementForHotKey(spy_loadDomMapHotKey, spy_instructionDiv)
    spy_infoDiv.appendChild(spy_instructionDiv);
}

function createElementForHotKey(hotKeyObject, parentDiv) {
    if (!hotKeyObject) {
        return;
    }
    if (hotKeyObject.useCtrlKey) {
        addKbdElementToElement('Ctrl', parentDiv);
        parentDiv.appendChild(document.createTextNode(space));
    }
    if (hotKeyObject.useAltKey) {
        addKbdElementToElement('Alt', parentDiv);
        parentDiv.appendChild(document.createTextNode(space));
    }
    if (hotKeyObject.useShiftKey) {
        addKbdElementToElement('Shift', parentDiv);
        parentDiv.appendChild(document.createTextNode(space));
    }
    if (hotKeyObject.useMetaKey) {
        addKbdElementToElement(String.fromCharCode(224), parentDiv);
        parentDiv.appendChild(document.createTextNode(space));
    }
    if (hotKeyObject.keyCode) {
        var keyCode = hotKeyObject.keyCode;
        var keyCodeChar = keyCode === 192 ? '`' : String.fromCharCode(hotKeyObject.keyCode);
        addKbdElementToElement(keyCodeChar, parentDiv);
        parentDiv.appendChild(document.createTextNode(space));
    }
}

function spy_createXpathDiv() {
    spy_elementInfoDiv = document.createElement('div');
    spy_elementInfoDiv.id = 'katalon-spy_elementInfoDiv';
    spy_elementInfoDiv.style.display = 'none';
    spy_infoDiv.appendChild(spy_elementInfoDiv);
}

function spy_mouseMoveWindow(e) {
    var y = 0;
    var windowHeight = $(window).height();
    if (e.clientY - spy_infoDiv.offsetHeight - 20 < 0) {
        y = windowHeight - spy_infoDiv.offsetHeight;
    }
    spy_infoDiv.style.top = y + 'px';
}

function spy_mouseOutWindow(e) {
    spy_mouseMoveWindow(e);
}

function spy_mouseOver(e) {
    var selectedElement = e ? e.target : window.event.srcElement;
    if (selectedElement.nodeName.toLowerCase() == 'iframe' || selectedElement.nodeName.toLowerCase() == 'frame') {
        var iframeContentWindow = selectedElement.contentWindow;
        if (iframeContentWindow) {
            iframeContentWindow.focus();
        }
    } else {
        var doc = selectedElement.ownerDocument;
        var win = doc.defaultView || doc.parentWindow;
        win.focus();
    }

    if (selectedElement == spy_hoverElement) {
        return;
    }
    if (spy_hoverElement != null) {
        spy_hoverElement.style.outline = '';
    }
    spy_hoverElement = selectedElement;
    spy_hoverElement.style.outline = ELEMENT_HOVER_OUTLINE_STYLE;
    spy_elementInfoDiv.style.display = 'block';
    spy_updateInfoDiv(getElementInfo(spy_hoverElement));
}

function spy_updateInfoDiv(text) {
    if (spy_elementInfoDivText == null) {
        spy_elementInfoDivText = document.createTextNode('');
        spy_elementInfoDiv.appendChild(spy_elementInfoDivText);
    }
    spy_elementInfoDivText.nodeValue = (text);
}

function spy_mouseOut(e) {
    var selectedElement = e ? e.target : window.event.srcElement;
    if (spy_hoverElement != selectedElement) {
        return;
    }
    spy_elementInfoDiv.style.display = 'none';
    spy_updateInfoDiv("");
    spy_clearHoverElement();
}

function spy_clearHoverElement() {
    if (!spy_hoverElement) {
        return;
    }
    spy_hoverElement.style.outline = '';
    spy_hoverElement = null;
}

function spy_flashElement() {
    if (!spy_hoverElement) {
        return;
    }
    $(spy_hoverElement).css({
        outline : ELEMENT_FLASHING_OUTLINE_STYLE
    }).animate({
        outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_1
    }, 100).animate({
        outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_2
    }, 100).animate({
        outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_1
    }, 100).animate({
        outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_2
    }, 100)
            .animate(
                    {
                        outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_3
                    },
                    100,
                    function() {
                        if (spy_hoverElement
                                && (spy_hoverElement.nodeName.toLowerCase() == 'iframe' || spy_hoverElement.nodeName
                                        .toLowerCase() == 'frame')) {
                            var iframeContentWindow = spy_hoverElement.contentWindow;
                            if (iframeContentWindow && spy_currentEventOrigin) {
                                iframeContentWindow.postMessage("responseSuccess", spy_currentEventOrigin);
                            }
                        }
                    });
}

function spy_sendData() {
    if (!spy_hoverElement) {
        return;
    }
    if (spy_hoverElement.nodeName.toLowerCase() == 'iframe') {
        spy_hoverElement.contentWindow.postMessage("keyboardTriggerEvent", "*");
    } else {
        var jsonObject = mapDOM(spy_hoverElement, window);
        spy_processObject(jsonObject);
    }
}

function spy_keyUp(e) {
    if (isHotKeyPressed(spy_captureObjectHotKey, e)) {
        spy_sendData();
        return;
    }
    if (isHotKeyPressed(spy_loadDomMapHotKey, e)) {
        forwardPostDomMapEvent();
    }
}

function isHotKeyPressed(hotkeyObject, event) {
    var keyCode = document.all ? window.event.keyCode : event.keyCode;
    var isAltKeyPressed = event ? event.altKey : window.event.altKey;
    var isCtrlKeyPressed = event ? event.ctrlKey : window.event.ctrlKey;
    var isShiftKeyPressed = event ? event.shiftKey : window.event.shiftKey;
    var isMetaKeyPressed = event ? event.metaKey : window.event.metaKey;
    return (keyCode === hotkeyObject.keyCode && isAltKeyPressed === hotkeyObject.useAltKey
            && isCtrlKeyPressed === hotkeyObject.useCtrlKey && isShiftKeyPressed === hotkeyObject.useShiftKey && isMetaKeyPressed === hotkeyObject.useMetaKey);
}

function spy_postData(url, object) {
    if (!object) {
        return;
    }
    var data = { keyword : 'element', obj : object, mode: 'INSPECT'  };
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
            spy_flashElement();
        });
        return;
    }
    if (detectIE() && window.httpRequestExtension) {
        var response = window.httpRequestExtension.postRequest(data, url);
        if (response === '200') {
            spy_flashElement();
        } else {
            alert(response);
        }
        return;
    }
    self.port.emit("spy_postData", {
        url : url,
        data : data
    });
}

function spy_setParentJson(object, parentJson) {
    if ('parent' in object) {
        spy_setParentJson(object['parent'], parentJson);
        return;
    }
    object['parent'] = parentJson;
}

function spy_processObject(object) {
    if (!isInTopWindow()) {
        var event = {};
        event['name'] = 'forwardObject';
        event['data'] = object;
        window.parent.postMessage(JSON.stringify(event), "*");
        return;
    }
    spy_postData(qAutomate_server_url, object);
}

function spy_receiveMessage(event) {
    // Check if sender is from parent frame
    if (event.source === window.parent) {
        if (event.data == "responseSuccess" && spy_hoverElement) {
            spy_flashElement();
        } else if (event.data == "keyboardTriggerEvent") {
            spy_sendData();
        } else if (event.data == "parentLoadCompleted") {
            isParentReady = true;
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
    spy_currentEventOrigin = event.origin;
    var eventObject = JSON.parse(event.data);
    switch (eventObject['name']) {
    case 'forwardObject':
        var object = eventObject['data'];
        var json = mapDOM(childFrame, window);
        if (json) {
            spy_setParentJson(object, json);
        }
        spy_processObject(object);
        break;
    case 'loadCompleted':
        var object = eventObject['data'];
        childFrame.domData = object;
        sendDomMap();
        break;
    case 'postDomMap':
        var object = eventObject['data'];
        childFrame.domData = object;
        forwardPostDomMapEvent();
        break;
    }
}

function startInspection(data) {
    console.log(data)
    if (data && data.captureObjectHotKey) {
        spy_captureObjectHotKey = data.captureObjectHotKey;
    }
    if (data && data.loadDomMapHotKey) {
        spy_loadDomMapHotKey = data.loadDomMapHotKey;
    }
    // START
    spy_setupEventListeners();
    spy_createInfoDiv();

    // for Firefox
    if (!detectChrome() && !detectIE() && !(typeof self === 'undefined')) {
        self.on('message', function(message) {
            console.log(message.kind)
            console.log(message.text)
            if (message.kind == "postSuccess") {
                spy_flashElement();
            } else if (message.kind == "postFail" || message.kind == "postDomMapSuccess") {
                alert(message.text);
            }
        });
    }
};

function endInspection() {
    spy_disposeEventListeners();
    spy_removeInfoDiv();
    spy_clearHoverElement();
}
