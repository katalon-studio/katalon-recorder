/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

class KURecorder {

    constructor(window) {
        this.window = window;
        this.attached = false;
        this.ku_locatorBuilders = new KULocatorBuilders(window);
        this.frameLocation = this.getFrameLocation();
        browser.runtime.sendMessage({
            frameLocation: this.frameLocation
        }).catch(function (reason) {
            // Failed silently if receiving end does not exist
        });
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    parseEventKey(eventKey) {
        if (eventKey.match(/^C_/)) {
            return { eventName: eventKey.substring(2), capture: true };
        } else {
            return { eventName: eventKey, capture: false };
        }
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    attach(version) {
        if (this.attached) {
            return;
        }
        var self = this;
        this.elementKeyword = (!version) ? 'element' : 'elementAction';
        this.attached = true;
        this.eventListeners = {};
        for (let eventKey in KURecorder.eventHandlers) {
            var eventInfo = this.parseEventKey(eventKey);
            var eventName = eventInfo.eventName;
            var capture = eventInfo.capture;
            // create new function so that the variables have new scope.
            function register() {
                var handlers = KURecorder.eventHandlers[eventKey];
                var listener = function (event) {
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i].call(self, event);
                    }
                }
                this.window.document.addEventListener(eventName, listener, capture);
                this.eventListeners[eventKey] = listener;
            }
            register.call(this);
        }


        if (this.window.addEventListener) {
            function register() {
                var listener = function (event) {
                    self.rec_receiveMessage.call(self, event);
                }
                this.window.addEventListener("message", listener, false);
            }
            register.call(this);
        } else {
            function register() {
                var listener = function (event) {
                    self.rec_receiveMessage.call(self, event);
                }
                this.window.attachEvent("onmessage", self.rec_receiveMessage);
            }
            register.call(this);
        }
        this.rec_navigateActionRecorded = false;
        this.rec_infoDiv; // parent div to contains information
        this.rec_elementInfoDiv; // informational div to show xpath of current hovered element
        this.rec_elementInfoDivText; // xpath text to show in rec_elementInfoDiv    
        this.rec_hoverElement; // whatever element the mouse is over       

        this.queuedKeyCombinations = "";
        this.window.document.addEventListener("keydown", KURecorder.keyDownEventHandler.bind(this));
        this.window.document.addEventListener("keyup", KURecorder.keyUpEventHandler.bind(this));

        this.rec_createInfoDiv();
        var currentURL = this.window.document.url;	
        this.checkForNavigateAction(currentURL);
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    detach() {
        if (!this.attached) {
            return;
        }
        this.attached = false;
        for (let eventKey in this.eventListeners) {
            var eventInfo = this.parseEventKey(eventKey);
            var eventName = eventInfo.eventName;
            var capture = eventInfo.capture;
            this.window.document.removeEventListener(eventName, this.eventListeners[eventKey], capture);
        }
        delete this.eventListeners;
        if (this.window.addEventListener) {
            function unregister() {
                var listener = function (event) {
                    self.rec_receiveMessage.call(self, event);
                }
                this.window.removeEventListener("message", listener, false);
            }
            unregister.call(this);
        } else {
            function unregister() {
                var listener = function (event) {
                    self.rec_receiveMessage.call(self, event);
                }
                this.window.detachEvent("message", listener);
            }
            unregister.call(this);
        }
        this.window.document.removeEventListener("keydown", KURecorder.keyDownEventHandler.bind(this));
        this.window.document.removeEventListener("keyup", KURecorder.keyUpEventHandler.bind(this));
        this.rec_removeInfoDiv();
        this.rec_clearHoverElement();
    }

    getFrameLocation() {
        let currentWindow = window;
        let currentParentWindow;
        let frameLocation = ""
        while (currentWindow !== window.top) {
            currentParentWindow = currentWindow.parent;
            for (let idx = 0; idx < currentParentWindow.frames.length; idx++)
                if (currentParentWindow.frames[idx] === currentWindow) {
                    frameLocation = ":" + idx + frameLocation;
                    currentWindow = currentParentWindow;
                    break;
                }
        }
        return frameLocation = "root" + frameLocation;
    }

    // NOTE: Not using this in KU
    record(command, target, value, insertBeforeLastCommand, actualFrameLocation) {
        let self = this;
        browser.runtime.sendMessage({
            command: command,
            target: target,
            value: value,
            insertBeforeLastCommand: insertBeforeLastCommand,
            frameLocation: (actualFrameLocation != undefined) ? actualFrameLocation : this.frameLocation,
        }).catch(function (reason) {
            // If receiving end does not exist, detach the recorder
            /* KAT-BEGIN remove self.detach
            self.detach();
            KAT-END */
        });
    }

    rec_receiveMessage (event) {
        // Check if sender is from any child frame belong to this window
        var childFrame = null;
        var arrFrames = this.window.document.getElementsByTagName("IFRAME");
        for (var i = 0; i < arrFrames.length; i++) {
            if (arrFrames[i].contentWindow === event.source) {
                childFrame = arrFrames[i];
                break;
            }
        }
        arrFrames = this.window.document.getElementsByTagName("FRAME");
        for (var i = 0; i < arrFrames.length; i++) {
            if (arrFrames[i].contentWindow === event.source) {
                childFrame = arrFrames[i];
                break;
            }
        }
        if (!childFrame) {
            return;
        }
        
        var object = JSON.parse(event.data);
        var action = {};
        action["actionName"] = "goIntoFrame";
        action["actionData"] = "";
        var json = mapDOMForRecord(action, childFrame, window);
        if (json) 
            this.rec_setParentJson(object, json);
        
        this.rec_processObject(object);        
    }

    rec_processObject (object) {
        if (this.window.location !== this.window.parent.location) {
            this.window.parent.postMessage(JSON.stringify(object), "*");
        } else {
            this.rec_postData(qAutomate_server_url, object);
        }
    }

    rec_setParentJson (object, parentJson) {
        if ('parent' in object) {
            this.rec_setParentJson(object['parent'], parentJson);
        } else {
            object['parent'] = parentJson;
        }
    }


    rec_postData (url, object) {
        if (!object) {
            return;
        }
        var data = { keyword : this.elementKeyword, obj : object, mode: 'RECORD'};
        if (detectChrome()) {
            chromePostData(url, data, function (response) {
                if (response) {
                    console.log(response)
                    // error happenened
                    alert(response);
                    setTimeout(function () {
                        window.focus();
                    }, 1);
                    return;
                }
                console.log("POST success");
            });
            return;
        }
        if (detectIE() && this.window.httpRequestExtension) {
            var response = this.window.httpRequestExtension.postRequest(data, url);
            if (response === '200') {
                console.log("POST success");
            } else {
                console.log(response);
            }
            return;
        }
        self.port.emit("rec_postData", {
            url: url,
            data: object
        });
    }

    rec_clearHoverElement() {
        if (!this.rec_hoverElement) {
            return;
        }
        this.rec_hoverElement.style.outline = '';
        this.rec_hoverElement = null;
    }

    rec_createInfoDiv () {
        addCustomStyle();
        this.rec_infoDiv = this.window.document.createElement('div');
        this.rec_infoDiv.id = 'katalon';
        this.rec_createXpathDiv();
        this.window.document.body.appendChild(this.rec_infoDiv);
    }

    rec_removeInfoDiv () {
        this.rec_infoDiv.parentNode.removeChild(this.rec_infoDiv);
        this.rec_infoDiv = null;
        this.instructionDiv = null;
        this.rec_elementInfoDiv = null;
        this.rec_elementInfoDivText = null;
    }

    rec_updateInfoDiv (text) {
        if (this.rec_elementInfoDivText == null) {
            this.rec_elementInfoDivText = this.window.document.createTextNode('');
            this.rec_elementInfoDiv.appendChild(this.rec_elementInfoDivText);
        }
        this.rec_elementInfoDivText.nodeValue = (text);
    }

    rec_createXpathDiv () {
        this.rec_elementInfoDiv = this.window.document.createElement('div');
        this.rec_elementInfoDiv.id = 'katalon-rec_elementInfoDiv';
        this.rec_elementInfoDiv.style.display = 'none';
        this.rec_infoDiv.appendChild(this.rec_elementInfoDiv);
    }

    checkForNavigateAction (currentURL) {
        if (this.rec_navigateActionRecorded) {
            return;
        }
        if (this.window.location !== this.window.parent.location) {
            return;
        }
        var action = {};
        action["actionName"] = "navigate";
        action["actionData"] = currentURL || this.window.document.URL;
        this.rec_sendData(action, this.window.document);
        this.rec_navigateActionRecorded = true;
    }

    rec_getSelectValues (select) {
        var result = [];
        var options = select && select.options;
        var opt;
    
        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];
            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    processOnInputChangeTarget(selectedElement){
        if (!selectedElement) {
            return;
        }
        var elementTagName = selectedElement.tagName.toLowerCase();
        var elementTypeName = (selectedElement.type) ? ( selectedElement.type.toLowerCase()) : null;
        var isRecorded = (elementTagName === 'input' && 
                (elementTypeName && KURecorder.INPUT_TYPE_INPUT_EVENT.indexOf(elementTypeName) !== -1)) 
                || (elementTagName === 'textarea');
        if (!isRecorded) {
            return;
        }
        this.checkForNavigateAction();
        var action = {};
        action["actionName"] = 'inputChange';
        action["actionData"] = selectedElement.value;
        this.rec_sendData(action, selectedElement);
    }
    
    processOnChangeTarget (selectedElement) {
        if (!selectedElement) {
            return;
        }
        var elementTagName = selectedElement.tagName.toLowerCase();
        var elementTypeName = (selectedElement.type) ? ( selectedElement.type.toLowerCase()) : null;
        var isRecorded = ((elementTagName !== 'input' && elementTagName !== 'textarea') 
                || (elementTagName == 'input' && elementTypeName != 'radio' && elementTypeName != 'checkbox' 
                    && (elementTypeName && KURecorder.INPUT_TYPE_INPUT_EVENT.indexOf(elementTypeName) !== -1)));
        if (!isRecorded) {
            return;
        }
        this.checkForNavigateAction();
        var action = {};
        action["actionName"] = 'inputChange';
        if (selectedElement.tagName.toLowerCase() == 'select') {
            action["actionData"] = {};
            action["actionData"]["oldValue"] = selectedElement.oldValue
            action["actionData"]["newValue"] = this.rec_getSelectValues(selectedElement);
            selectedElement.oldValue = action["actionData"]["newValue"];            
        } else if (selectedElement.contentEditable && selectedElement.contentEditable == 'true'){
            action["actionData"] = selectedElement.innerHTML;
        }
        else {
            action["actionData"] = selectedElement.value;
        }
        this.rec_sendData(action, selectedElement);
    }

    processOnSendKeyTarget (selectedElement) {
        var action = {};
        action["actionName"] = 'sendKeys';
        action["actionData"] = 13;
        this.rec_sendData(action, selectedElement);
    
    }

    getActionFromContextMenu (keyword, selectedElement, data) {
        var action = {};
            action["actionName"] = keyword;
            action["actionData"] = data;
        this.rec_sendData(action, selectedElement);
    }

    rec_isElementMouseUpEventRecordable (selectedElement, clickType) {
        if (clickType != 'left') {
            return true;
        }        
        var elementTag = selectedElement.tagName.toLowerCase();
        if (elementTag == 'input') {
            var elementInputType = selectedElement.type.toLowerCase();
            if (elementInputType == 'button' || elementInputType == 'submit' || elementInputType == 'radio'
                || elementInputType == 'image' || elementInputType == 'checkbox' || elementInputType == 'text') {
                return true;
            }
            return false;
        }
        
        if(selectedElement.contentEditable && selectedElement.contentEditable == 'true'){
            return false;
        }
        return elementTag != 'select' && elementTag != 'option' && elementTag != 'textarea';
    }

    rec_getMouseButton (e) {
        if (!e) {
            return;
        }
        if (e.which) {
            if (e.which == 3) {
                return 'right';
            }
            if (e.which == 2) {
                return 'middle';
            }
            return 'left';
        }
        if (e.button) {
            if (e.button == 2) {
                return 'right';
            }
            if (e.button == 4) {
                return 'middle';
            }
            return 'left';
        }
    }

    processOnClickTarget (selectedElement, clickType, currentURL) {
        this.checkForNavigateAction(currentURL);
        if (clickType === "right" && selectedElement.tagName === "INPUT" && selectedElement.type === "text") {
            selectedElement.disabled = true;
            selectedElement.disabled = false;
        }
        var action = {};
        action["actionName"] = 'click';
        action["actionData"] = clickType;
        this.rec_sendData(action, selectedElement);
    }

    processOnDbClickTarget (selectedElement) {
        this.checkForNavigateAction();
        var action = {};
        action["actionName"] = 'doubleClick';
        action["actionData"] = '';
        this.rec_sendData(action, selectedElement);
    }

    rec_sendData(action, element) {
        if (!element) {
            return;
        }
        var jsonObject = mapDOMForRecord(action, element, window);
        this.rec_processObject(jsonObject);
    }

    rec_windowFocus(selectedElement) {
        if (selectedElement.tagName.toLowerCase() == 'select') {
            selectedElement.oldValue = this.rec_getSelectValues(selectedElement);
            selectedElement.onfocus = null;
        }
    }    
    moveDivAway(e){
        var y = 0;
        var windowHeight = $(window).height();
        if (e.clientY - this.rec_infoDiv.offsetHeight - 20 < 0) {
            y = windowHeight - this.rec_infoDiv.offsetHeight;
        }
        this.rec_infoDiv.style.top = y + 'px';
    }
}

KURecorder.INPUT_TYPE_INPUT_EVENT = ['email', 'number', 'password', 'search', 'tel', 'text', 'url']; // input type that will be handled by input event

KURecorder.eventHandlers = {};
KURecorder.addEventHandler = function (handlerName, eventName, handler, options) {
    handler.handlerName = handlerName;
    if (!options) options = false;
    let key = options ? ('C_' + eventName) : eventName;
    if (!this.eventHandlers[key]) {
        this.eventHandlers[key] = [];
    }
    this.eventHandlers[key].push(handler);
}

KURecorder.keyHandlers = {};
KURecorder.addOnKeyUpHandler = function(handlerName, keyCombinations, handler) {
    handler.handlerName = handlerName;
    if(!this.keyHandlers[keyCombinations]) {
        this.keyHandlers[keyCombinations] = [];
    }
    this.keyHandlers[keyCombinations].push(handler);
}

/**
 * This key down handler continually queues the pressed key
 */
KURecorder.keyDownEventHandler = function(event) {
    let stringValue = keycode.getValueByEvent(event);
    this.queuedKeyCombinations += (" " + stringValue);
}

/**
 * This key up handler releases the queue and trigger handler on appropriate pressed key combinations.
 * It also stops event propagation when a handler is recognized
 */
KURecorder.keyUpEventHandler = function(event) {
    try{
        let key = this.queuedKeyCombinations.trim();
        let handlers = KURecorder.keyHandlers[key];

        if(handlers && handlers.length > 0) {
            event.stopPropagation();
        }

        for(var i = 0; i < handlers.length; i++) {
            handlers[i].call(this, this.rec_hoverElement);
        }
    } catch(e) {
        // Do nothing for now
    } finally {
        this.queuedKeyCombinations = "";
    }
}


// TODO: new by another object
var ku_recorder = new KURecorder(window);

/* // TODO: move to appropriate file
// show element
function startShowElement(message, sender, sendResponse){
    if (message.showElement) {
        result = selenium["doShowElement"](message.targetValue);
        return Promise.resolve({result: result});
    }
}
browser.runtime.onMessage.addListener(startShowElement); */
