function testClassName(name) {
    return name;
}

newFormatters.dynatrace = function(name, commands) {

    let currentWindow = null;
    let currentFrame = null;

    const specialKeyMap = {
        'KEY_BACKSPACE': 8,
        'KEY_TAB': 9,
        'KEY_ENTER': 13,
        'KEY_PAGE_UP': 33,
        'KEY_PAGE_DOWN': 34,
        'KEY_HOME': 36,
        'KEY_LEFT': 37,
        'KEY_UP': 38,
        'KEY_RIGHT': 39,
        'KEY_DOWN': 40,
        'KEY_DEL': 46,
        'KEY_DELETE': 46,
        'KEY_F1': 112,
        'KEY_F2': 113,
        'KEY_F3': 114,
        'KEY_F4': 115,
        'KEY_F5': 116,
        'KEY_F6': 117,
        'KEY_F7': 118,
        'KEY_F8': 119,
        'KEY_F9': 120,
        'KEY_F10': 121,
        'KEY_F11': 122,
        'KEY_F12': 123,
    }

    const commandConverterMapping = {
        "open": (script, command) => script.convertToNavigateEvent(command),
        "goBack": (script, command) => script.convertGoBack(command),
        "goBackAndWait": (script, command) => script.convertGoBack(command),
        "refresh": (script, command) => script.convertRefresh(command),
        "refreshAndWait": (script, command) => script.convertRefresh(command),
        "click": (script, command) => script.convertToClickEvent(command),
        "clickAndWait": (script, command) => script.convertToClickEvent(command),
        "doubleClick": (script, command) => script.convertDoubleClick(command),
        "doubleClickAndWait": (script, command) => script.convertDoubleClick(command),
        "type": (script, command) => script.convertToKeystrokesEvent(command),
        "typeAndWait": (script, command) => script.convertToKeystrokesEvent(command),
        "pause": (script, command) => script.convertPause(command),
        "selectWindow": (script, command) => script.convertWindow(command),
        "selectFrame": (script, command) => script.convertFrame(command),
        "submit": (script, command) => script.convertSubmit(),
        "submitAndWait": (script, command) => script.convertSubmit(),
        "select": (script, command) => script.convertToSelectionEvent(command),
        "selectAndWait": (script, command) => script.convertToSelectionEvent(command),
        "echo": (script, command) => script.convertEcho(command),
        "sendKeys": (script, command) => script.convertSendKeys(command),
        "addSelection": (script, command) => script.convertAddSelection(command),
        "addSelectionAndWait": (script, command) => script.convertAddSelection(command),
        "createCookie": (script, command) => script.convertToCookieEvent(command),
        "createCookieAndWait": (script, command) => script.convertToCookieEvent(command),
        "assertText": (script, command) => script.convertAssertText(command),
        "assertNotText": (script, command) => script.convertAssertText(command, true),
        "verifyText": (script, command) => script.convertAssertText(command),
        "verifyNotText": (script, command) => script.convertAssertText(command, true),
        "assertTitle": (script, command) => script.convertAssertTitle(command),
        "assertNotTitle": (script, command) => script.convertAssertTitle(command, true),
        "verifyTitle": (script, command) => script.convertAssertTitle(command),
        "verifyNotTitle": (script, command) => script.convertAssertTitle(command, true),
        "assertValue": (script, command) => script.convertAssertValue(command),
        "assertNotValue": (script, command) => script.convertAssertValue(command, true),
        "verifyValue": (script, command) => script.convertAssertValue(command),
        "verifyNotValue": (script, command) => script.convertAssertValue(command, true),
        "waitForElementPresent": (script, command) => script.convertWaitForElement(command),
        "waitForElementNotPresent": (script, command) => script.convertWaitForElement(command, true)
    }

    class DynatraceScript {

        constructor(cmds) {
            this.configuration = {
                device: {
                    orientation: "landscape",
                    deviceName: "Desktop"
                }
            };
            this.type = "clickpath";
            this.version = "1.0";
            this.events = [];
            cmds.forEach((command) => this.mapCommand(command));
        }

        mapCommand(command) {
            if(commandConverterMapping[command.command] !== undefined){
                commandConverterMapping[command.command](this, command);
            }
        }

        convertToNavigateEvent(command) {
            this.events.push(new NavigateEvent(command));
        }

        convertToClickEvent(command) {
            this.events.push(new ClickEvent(command));
        }

        convertToCookieEvent(command) {
            this.events.push(new CookieEvent(command));
        }

        convertToSelectionEvent(command) {
            this.events.push(new SelectOptionEvent(command));
        }

        convertToKeystrokesEvent(command) {
            this.events.push(new KeystrokeEvent(command));
        }

        convertDoubleClick(command) {
            const clickEvent = new ClickEvent(command);
            clickEvent.wait = undefined;
            this.events.push(clickEvent);
            this.events.push(new ClickEvent(command));
            const dblClick = new JavaScriptEvent(command);
            dblClick.description = "double click";
            const loc = createJsLocator(command);
            dblClick.javaScript = `const elem = ${loc};
                const eventImpl = document.createEvent("Events");
                eventImpl.initEvent("dblclick", true, true);
                eventImpl.which = 1;
                eventImpl.button = 0;
                eventImpl.buttons = 0;
                elem.dispatchEvent(eventImpl);`;
            this.events.push(dblClick);
        }

        convertPause(command) {
            const jsEvent = new JavaScriptEvent(command);
            const time = command.target;
            jsEvent.javaScript = `api.startAsyncSyntheticEvent(); 
                setTimeout(() => {api.finish()}, ${time});`;
            jsEvent.wait = undefined;
            this.events.push(jsEvent);
        }

        convertWindow(command) {
            if (!command.target || command.target.endsWith("local")) {
                currentWindow = 0;
            } else if (command.target.startsWith("win_ser_")) {
                const windowIndex = command.target.substring(8);
                currentWindow = parseInt(windowIndex);
            }
            currentFrame = null;
        }

        convertFrame(command) {
            currentFrame = command.target;
            if(currentWindow === null) {
                currentWindow = 0;
            }
        }

        convertSubmit() {
            const keystrokeEvents = this.events.filter((event) => {
                return event.type === "keystrokes";
            });
            if(keystrokeEvents.length > 0) {
                const lastEvent = keystrokeEvents[keystrokeEvents.length -1];
                lastEvent.simulateReturnKey = true;
            }
        }

        convertEcho(command) {
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.javaScript = `api.info("${escapeDoubleQuotes(command.target)}");`;
            javaScriptEvent.description = "info log";
            this.events.push(javaScriptEvent);
        }

        convertAssertText(command, failIfFound = false) {
            if(this.events.length > 0) {
                const lastEvent = this.events[this.events.length - 1];
                if (lastEvent.type !== "cookie" && lastEvent.type !== "javascript") {
                    const ruleTarget = new Target();
                    ruleTarget.locators.push(createLocator(command));
                    let matchValue = command.value;
                    let isRegex = false;
                   if(matchValue.startsWith("regex:")) {
                       matchValue = matchValue.substring(6);
                       isRegex = true;
                   } else if(matchValue.startsWith("glob:")) {
                       matchValue = matchValue.substring(5).split("*").join(".*").split("?").join(".");
                       isRegex = true;
                   }

                    const validationRule = {
                        type: "element_match",
                        failIfFound: failIfFound,
                        isRegex: isRegex,
                        target: ruleTarget,
                        match: matchValue,
                    }
                    if (lastEvent.validate) {
                        lastEvent.validate.push(validationRule);
                    } else {
                        lastEvent.validate = [validationRule];
                    }
                } else {
                    const jsEvent = new JavaScriptEvent(command);
                    const loc = createJsLocator(command);
                    const matchPattern = convertMatchPatternToJsMatch(command.value, "textToMatch");
                    jsEvent.javaScript = `const elem = ${loc};
                        const textToMatch = elem.innerText;
                        const matches = ${matchPattern};
                        if(matches && ${failIfFound}) {
                            api.fail("Text ${escapeDoubleQuotes(command.value)} was present.");
                        } else if(!matches && !${failIfFound}) {
                            api.fail("Text ${escapeDoubleQuotes(command.value)} was not present.");
                        }`;
                    this.events.push(jsEvent);
                }
            }
        }

        convertGoBack(command) {
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.javaScript = "window.history.back();";
            javaScriptEvent.description = "back";
            this.events.push(javaScriptEvent);
        }

        convertRefresh(command) {
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.javaScript = "location.reload();";
            javaScriptEvent.description = "refresh";
            this.events.push(javaScriptEvent);
        }

        convertAssertTitle(command, failIfFound = false) {
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.description = "assert title";
            const matchPattern = convertMatchPatternToJsMatch(command.target, "document.title");
            if(failIfFound) {
                javaScriptEvent.javaScript = `if(${matchPattern}) { api.fail("Title matched ${escapeDoubleQuotes(command.target)}"); }`;
            } else {
                javaScriptEvent.javaScript = `if(!(${matchPattern})) { api.fail("Title did not match ${escapeDoubleQuotes(command.target)}"); }`;
            }
            this.events.push(javaScriptEvent);
        }

        convertAssertValue(command, failIfFound = false) {
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.description = "assert value";
            const jsLocator = createJsLocator(command);
            const matchPattern = convertMatchPatternToJsMatch(command.value, "elem.value");
            const escapedValue = escapeSingleQuotes(escapeDoubleQuotes(command.value));
            if(failIfFound) {
                javaScriptEvent.javaScript = `let elem = ${jsLocator};
                    if((elem.type === "checkbox" || elem.type === "radio") && ("${escapedValue}" === "on" || "${escapedValue}" === "off")) {
                        if(elem.checked && "${escapedValue}" === "on") {
                            api.fail("Checkbox had state ${escapedValue}");
                        } else if(!elem.checked && "${escapedValue}" === "off") {
                            api.fail("Checkbox had state ${escapedValue}");
                        }
                    } else if(${matchPattern}) {
                        api.fail("Element had value ${escapedValue}");
                    }`;
            } else {
                javaScriptEvent.javaScript = `let elem = ${jsLocator};
                    if((elem.type === "checkbox" || elem.type === "radio") && ("${escapedValue}" === "on" || "${escapedValue}" === "off")) {
                        if(elem.checked && "${escapedValue}" === "off") {
                            api.fail("Checkbox did not have state ${escapedValue}");
                        } else if(!elem.checked && "${escapedValue}" === "on") {
                            api.fail("Checkbox did not have state ${escapedValue}");
                        }
                    } else if(!(${matchPattern})) {
                        api.fail("Element did not have value ${escapedValue}");
                    }`;
            }
            this.events.push(javaScriptEvent);
        }

        convertWaitForElement(command, failIfFound = false) {
            const jsEvent = new JavaScriptEvent(command);
            jsEvent.wait = new WaitCondition();
            jsEvent.wait.waitFor = "validation";
            jsEvent.javaScript = "";
            jsEvent.wait.timeoutInMilliseconds = 60000;
            const loc = createLocator(command);
            const target = new Target();
            target.locators.push(loc);
            jsEvent.wait.validation = {
                target: target,
                type: "element_match",
                failIfFound: failIfFound,
                match: ""
            };
            this.events.push(jsEvent);
        }

        convertSendKeys(command) {
            const jsLocator = createJsLocator(command)
            const javaScriptEvent = new JavaScriptEvent(command);
            javaScriptEvent.description = "send keys";
            const keys = [];
            const regexp = /\${(KEY_\w+)}/g;
            let specialChar;
            let lastIndex = 0;
            while(specialChar = regexp.exec(command.value)) {
                const currentIndex = regexp.lastIndex - specialChar[0].length;
                if(specialKeyMap[specialChar[1]]) {
                    if(lastIndex < currentIndex) {
                        [...command.value.slice(lastIndex, currentIndex)].forEach((ch) => keys.push(ch.charCodeAt(0)));
                    }
                    keys.push(specialKeyMap[specialChar[1]]);
                    lastIndex = regexp.lastIndex;
                }
            }
            if(lastIndex < command.value.length) {
                [...command.value.slice(lastIndex, command.value.length)].forEach((ch) => keys.push(ch.charCodeAt(0)));
            }
            javaScriptEvent.javaScript = `
                const keys = [${keys.join(", ")}];
                const elem = ${jsLocator};
                keys.forEach((key) => {
                    let eventObj = document.createEvent("Events");
                    eventObj.initEvent("keydown", true, true);
                    eventObj.key = key;
                    eventObj.keyCode = key;
                    eventObj.which = key;
                    eventObj.charCode = key;
                    
                    elem.dispatchEvent(eventObj);
                    eventObj = document.createEvent("Events");
                    eventObj.initEvent("keypress", true, true);
                    eventObj.key = key;
                    eventObj.keyCode = key;
                    eventObj.which = key;
                    eventObj.charCode = key;
                    elem.dispatchEvent(eventObj);
                    
                    eventObj = document.createEvent("Events");
                    eventObj.initEvent("keyup", true, true);
                    eventObj.key = key;
                    eventObj.keyCode = key;
                    eventObj.which = key;
                    eventObj.charCode = key;
                    elem.dispatchEvent(eventObj);
                });`;
            this.events.push(javaScriptEvent);
        }

        convertAddSelection(command) {
            this.events.push(new SelectOptionEvent(command));
        }
    }

    function convertLocator(locatorType, value, fullValue) {
        const locator = new Locator();
        switch (locatorType) {
            case "css":
                locator.value = value;
                break;
            case "id":
                locator.value = `#${value}`;
                break;
            case "link":
                locator.value = `a:contains("${escapeDoubleQuotes(value)}")`;
                break;
            case "name":
                locator.value = `[name="${escapeDoubleQuotes(value)}"]`;
                break;
            case "tag_name":
                locator.value = value;
                break;
            case "xpath":
                locator.type = "dom";
                locator.value = `document.evaluate('${escapeSingleQuotes(value)}', document, null, XPathResult.ANY_TYPE, null).iterateNext()`;
                break;
            default:
                locator.type = "dom";
                locator.value = `document.evaluate('${escapeSingleQuotes(fullValue)}', document, null, XPathResult.ANY_TYPE, null).iterateNext()`;
                break;
        }
        return locator;
    }

    function convertMatchPatternToJsMatch(pattern, toMatch) {
        let patternValue = pattern;
        if(pattern.startsWith("regex:")) {
            patternValue = pattern.substring(6);
            return `${toMatch}.match("${escapeDoubleQuotes(patternValue)}")`;
        } else if(pattern.startsWith("glob:")) {
            patternValue = pattern.substring(5).split("*").join(".*").split("?").join(".");
            return `${toMatch}.match("${escapeDoubleQuotes(patternValue)}")`;
        }
        return `${toMatch} === "${escapeDoubleQuotes(patternValue)}"`;

    }

    function escapeSingleQuotes(text) {
        return text.replace(/'/g, "\\'");
    }

    function escapeDoubleQuotes(text) {
        return text.replace(/"/g, '\\"');
    }

    function createLocator(command) {
        const splitIndex = command.target.indexOf("=");
        const locType = command.target.substring(0, splitIndex);
        const locValue = command.target.substring(splitIndex + 1);
        return convertLocator(locType, locValue, command.target);
    }

    function createJsLocator(command) {
        const locator = createLocator(command);
        let jsLocator;
        if (locator.type === "css") {
            const escapedValue = escapeSingleQuotes(locator.value);
            jsLocator = `typeof $ !== 'undefined' ? $('${escapedValue}')[0] : document.querySelector('${escapedValue}')`;
        } else {
            jsLocator = locator.value;
        }
        return jsLocator;
    }

    class BaseEvent {

        constructor(command) {
            this.description = command.command;
            this.wait = new WaitCondition();
            this.target = new Target();
            const locator = createLocator(command);
            this.target.locators.push(locator);
        }
    }

    class NavigateEvent extends BaseEvent {

        constructor(command) {
            super(command);
            this.type = "navigate";
            this.url = command.target;
            this.description = `Loading of "${this.url}"`;
            this.target.locators = undefined;
        }
    }

    class ClickEvent extends BaseEvent {

        constructor(command) {
            super(command);
            this.type = "click";
            this.description = "click";
            this.button = 0;
        }
    }

    class KeystrokeEvent extends BaseEvent {

        constructor(command) {
            super(command);
            this.type = "keystrokes";
            this.textValue = command.value;
            this.description = `type ${command.value}`;
            this.simulateBlurEvent = true;
            this.masked = false;
        }
    }

    class SelectOptionEvent extends BaseEvent {

        constructor(command, add = false) {
            super(command);
            const selectIndex = command.value.indexOf("=");
            const type =  command.value.substring(0, selectIndex);
            const value = escapeDoubleQuotes(command.value.substring(selectIndex + 1));
            this.description = "select option";
            if(type === "label" || type === "id" || add) {
                const jsLocator = createJsLocator(command);
                this.type = "javascript";
                const property = type === "label" ? "text" : "id";
                this.javaScript = `
                    let add = ${add};
                    let x = ${jsLocator};
                    for (i = 0; i < x.options.length; i++) {
                        if (x.options[i].${property} === \"${value}\") {
                            if(add) {
                                x.options[i].selected = true;
                            } else {
                                x.options.selectedIndex = i;
                            }
                        }
                    }`;
                this.target.locators = undefined;
            } else {
                this.type = "selectOption";
                this.selections = [];
                if(type === "value") {
                    this.selections.push({
                        "index" : 999999,
                        "value" : value
                    });
                } else if(type === "index") {
                    this.selections.push({
                        "index" : value,
                        "value" : ""
                    });
                }
            }
        }
    }

    class CookieEvent extends BaseEvent {

        constructor(command) {
            super(command);
            this.type = "cookie";
            this.description = "set cookie";
            this.wait = undefined;
            this.target = undefined;
            const selectIndex = command.target.indexOf("=");
            const cookieName = command.target.substring(0, selectIndex);
            const value = command.target.substring(selectIndex + 1);
            const options = command.value.split(",").map((opt) => opt.trim());
            let domain = "";
            let path = "";
            options.forEach((opt) => {
                if(opt.startsWith("domain=")) {
                    domain = opt.substring(7);
                } else if(opt.startsWith("path=")) {
                    path = opt.substring(5);
                }
            })
            this.cookies = [{
                value: value,
                name: cookieName,
                domain: domain,
                path: path
            }];
        }
    }

    class JavaScriptEvent extends BaseEvent {

        constructor(command) {
            super(command);
            this.type = "javascript";
            this.target.locators = undefined;
        }
    }

    class WaitCondition {

        constructor() {
            this.waitFor = "page_complete";
        }
    }

    class Target {

        constructor() {
            this.locators = [];
            if(currentFrame !== null) {
                this.window = `window[${currentWindow}].frame[${currentFrame}]`;
            } else if(currentWindow !== null) {
                this.window = `window[${currentWindow}]`;
            } else {
                this.window = undefined;
            }
        }
    }

    class Locator {
        type = "css";
        value = "";
    }

    return {
        content: JSON.stringify(new DynatraceScript(commands), null, 4),
        extension: 'json',
        mimetype : 'application/json'
    }
}
