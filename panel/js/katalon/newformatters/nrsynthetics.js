


const newrelicSynthetics = function (scriptName) {

    var _scriptName = scriptName  || ""

    const locatorType = {

        xpath: (target) => {
            return `By.xpath("${target.replace(/\"/g, "\'")}")`
        },
        css: (target) => {
            return `By.css("${target.replace(/\"/g, "\'")}")`
        },

        id: (target) => {
            return `By.id("${target.replace(/\"/g, "\'")}")`
        },

        link: (target) => {
            return `By.linkText("${target.replace(/\"/g, "\'")}")`
        },

        name: (target) => {
            return `By.name("${target.replace(/\"/g, "\'")}")`
        },

        tag_name: (target) => {
            return `By.tagName("${target.replace(/\"/g, "\'")}")`
        }

    }
    // https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Key.html
    const specialKeyMap = {
        '\${KEY_LEFT}': '$driver.Key.ARROW_LEFT',
        '\${KEY_UP}': '$driver.Key.ARROW_UP',
        '\${KEY_RIGHT}': '$driver.Key.RIGHT',
        '\${KEY_DOWN}': '$driver.Key.DOWN',
        '\${KEY_PAGE_UP}': '$driver.Key.PAGE_UP',
        '\${KEY_PAGE_DOWN}': '$driver.Key.PAGE_DOWN',
        '\${KEY_BACKSPACE}': '$driver.Key.BACK_SPACE',
        '\${KEY_DEL}': '$driver.Key.DELETE',
        '\${KEY_DELETE}': '$driver.Key.DELETE',
        '\${KEY_ENTER}': '$driver.Key.ENTER',
        '\${KEY_TAB}': '$driver.Key.TAB',
        '\${KEY_HOME}': '$driver.Key.HOME'
    }

    // NR Synthetics
    // https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/synthetics-scripted-browser-reference-monitor-versions-050#browser-waitForAndFindElement
    // katalon
    // https://docs.katalon.com/katalon-recorder/docs/selenese-selenium-ide-commands-reference.html
    const seleneseCommands = {

        "open": () => {
            logger.log(_STEP_, "_TARGET_STR_");
            return $browser.get("_TARGET_");
        },

        "click": () => {
            logger.log(_STEP_, "clickElement _TARGET_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    el.click();
                })
        },
        "clickAndWait": () => {
            logger.log(_STEP_, "clickAndWait _TARGET_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    el.click();
                })
        },
        "doubleClick": () => {
            logger.log(_STEP_, "doubleClick _TARGET_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    return $browser.actions().doubleClick(el).perform();
                })
        },

        "type": () => {
            logger.log(_STEP_, "type _VALUE_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    el.clear();
                    el.sendKeys('_VALUE_');
                })
        },

        "pause": () => {
            logger.log(_STEP_, "pause for _VALUE_STR_");
            return $browser.sleep(_VALUE_);
        },

        "refresh": () => {
            logger.log(_STEP_, "refresh page");
            return $browser.navigate().refresh();
        },

        "selectWindow": () => {
            // switchTo window [1] as the new window
            logger.log(_STEP_, "switch window ");
            return $browser.sleep(1000)
                .then(function() {
                    return $browser.getAllWindowHandles()
                })
                .then(handles => {
                    return $browser.switchTo().window(handles[1])
                })
        },

        "sendKeys": () => {
            logger.log(_STEP_, "sendKeys _SEND_KEY_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    el.sendKeys(_SEND_KEY_);
                })
        },
        "submit": () => {
            logger.log(_STEP_, "submit  _TARGET_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function (el) {
                    el.submit();
                })
        },


        "selectFrame": () => {
            let type = ("_TARGET_").split("=")
            var value

            if (type[0] == "index") {
                value = parseInt(type[1]);  // int type
            } else {
                value = type[1]; // string type
            }

            logger.log(_STEP_, "switch to frame  _TARGET_STR_");
            return $browser.switchTo().frame(value)
        },

        "select": () => {
            let valueString = ("_VALUE_").split("=", 2);
            logger.log(_STEP_, "select option "+valueString[1]+" from dropdown list _TARGET_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function(selectElement){
                    return selectElement.findElement(By.xpath('//option[.="'+valueString[1]+'"]'))
                        .then(function(el){
                            el.isSelected().then(function(bool) {if (!bool) { el.click();}})
                        })
                })
        },

        "goBack": () => {
            logger.log(_STEP_, "go back a page");
            return $browser.navigate().back();
        },

        "verifyText": () => {
            logger.log(_STEP_, "verify text of _TARGET_STR_ includes _VALUE_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function(el){
                    return el.getText().then(function(text){
                        var found = text.includes("_VALUE_STR_");
                        assert.equal(true, found, "Verification failed! Unable to find text _VALUE_STR_ in element _TARGET_STR_. Text: " +text);
                    })
                })
        },

        "verifyTitle": () => {
            logger.log(_STEP_, "verify page title is _TARGET_STR_");
            return $browser.getTitle().then(function(title){
                assert.equal("_TARGET_STR_", title, "Verification failed! Page title is not _TARGET_STR_.  Page title: "+title);
            })
        },

        "verifyValue": () => {
            logger.log(_STEP_, "verify value of _TARGET_STR_ is _VALUE_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function(el){
                    return el.getAttribute("value").then(function(value){
                        assert.equal("_VALUE_STR_", value, "Verification failed! Element _TARGET_STR_ does not have value _VALUE_STR_. Current value: "+value);
                    })
                })
        },

        "assertText": () => {
            logger.log(_STEP_, "assert text of _TARGET_STR_ includes _VALUE_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function(el){
                    return el.getText().then(function(text){
                        var found = text.includes("_VALUE_STR_");
                        assert.equal(true, found, "Assertion failed! Unable to find text _VALUE_STR_ in element _TARGET_STR_. Text: "+text);
                    })
                })
        },

        "assertTitle": () => {
            logger.log(_STEP_, "assert page title is _TARGET_STR_");
            return $browser.getTitle().then(function(title){
                assert.equal("_TARGET_STR_", title, "Assertion failed! Page title is not _TARGET_STR_.  Page title: "+title);
            })
        },

        "assertValue": () => {
            logger.log(_STEP_, "assert value of _TARGET_STR_ is _VALUE_STR_");
            return $browser.waitForAndFindElement(_BY_LOCATOR_, DefaultTimeout)
                .then(function(el){
                    return el.getAttribute("value").then(function(value){
                        assert.equal("_VALUE_STR_", value, "Assertion failed! Element _TARGET_STR_ does not have value _VALUE_STR_.  Current value: "+value);
                    })
                })
        },

    }

    const header =
        "/**\n" +
        " * Script Name: {_SCRIPT_NAME_}\n" +
        " * \n" +
        " * Generated using  New Relic Synthetics Formatter for Katalon\n" +
        " *\n" +
        " * Feel free to explore, or check out the full documentation\n" +
        " * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-scripted-browsers\n" +
        " * for details.\n" +
        " */\n\n" +
        "/** CONFIGURATIONS **/\n\n" +
        "// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)\n" +
        "var ScriptTimeout = 180000;\n" +
        "// Script-wide timeout for all wait and waitAndFind functions (in ms)\n" +
        "var DefaultTimeout = 30000;\n" +
        "// Change to any User Agent you want to use.\n" +
        "// Leave as \"default\" or empty to use the Synthetics default.\n" +
        "var UserAgent = \"default\";\n\n" +
        "/** HELPER VARIABLES AND FUNCTIONS **/\n\n" +
        "const assert = require('assert'),\n" +
        "\tBy = $driver.By,\n" +
        "\tbrowser = $browser.manage()\n" +

        "/** BEGINNING OF SCRIPT **/\n\n" +
        "console.log('Starting synthetics script: {_SCRIPT_NAME_}');\n" +
        "console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');\n" +
        "\n" +
        "// Setting User Agent is not then-able, so we do this first (if defined and not default)\n" +
        "if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {\n" +
        "  $browser.addHeader('User-Agent', UserAgent);\n" +
        "  console.log('Setting User-Agent to ' + UserAgent);\n" +
        "}\n\n" +
        "// Get browser capabilities and do nothing with it, so that we start with a then-able command\n" +
        "$browser.getCapabilities().then(function () { })\n"

    const footer =
        "\t.then(function() {\n" +
        "\t\tlogger.end();\n" +
        "\t\tconsole.log('Browser script execution SUCCEEDED.');\n" +
        "\t}, function(err) {\n" +
        "\t\tlogger.end();\n" +
        "\t\tconsole.log ('Browser script execution FAILED.');\n" +
        "\t\tthrow(err);\n" +
        "\t});\n\n"

    function formatter(commands) {

        return header.replace(/_SCRIPT_NAME_/g, _scriptName) +
            commandExports(commands).content +
            footer +
            funcExports()


    }

    function commandExports(commands) {


        let output = commands.reduce((accObj, commandObj) => {
            let {command, target, value} = commandObj

            let cmd = seleneseCommands[command]
            if (typeof (cmd) == "undefined") {
                accObj.content += `\n\n\t// WARNING: unsupported command ${command}. Object= ${JSON.stringify(commandObj)}\n\n`
                return accObj
            }

            let tmpObj = {}
            tmpObj[command] = cmd

            let funcStr = Object.values(tmpObj)[0].toString()


            if (typeof (accObj) == "undefined") {
                accObj = {step: 1, content: ""}
            }

            let targetStr = target.trim().replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')

            let valueStr = value.trim().replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')


            let locatorStr = locator(target)


            funcStr = funcStr.replace(/_STEP_/g, accObj.step)
                .replace(/_TARGET_STR_/g, targetStr)
                .replace(/_BY_LOCATOR_/g, locatorStr)
                .replace(/_TARGET_/g, target)
                .replace(/_SEND_KEY_/g, specialKeyMap[value])
                .replace(/_VALUE_STR_/g, valueStr)
                .replace(/_VALUE_/g, value)


            accObj.step += 1
            accObj.content += `\t.then(${funcStr})\n`


            return accObj
        }, {step: 1, content: ""})


        return output
    }


    function locator(target) {
        let locType = target.split("=", 1)

        let selectorStr = target.substr(target.indexOf("=") + 1, target.length)
        let locatorFunc = locatorType[locType]
        if (typeof (locatorFunc) == 'undefined') {
            return `By.xpath("${target.replace(/\"/g, "\'")}")`
            // return 'not defined'
        }

        return locatorFunc(selectorStr)

    }


    function funcExports() {
        // ScriptTimeout defined globally see header
        let funcs =
            '\n//** Export Functions\n' +
            'const logger=(' + newrelicLogging.toString() + ')(ScriptTimeout)\n'
        return funcs
    }

    return {
        formatter,
        commandExports,
        funcExports,
        locator,
        seleneseCommands,
        locatorType,
        specialKeyMap
    }
}



const newrelicLogging = function (timeout=3000, mode='production') {

    var startTime = Date.now(),
        stepStartTime = Date.now(),
        prevMsg = '',
        prevStep = 0;


    if (typeof $util == 'undefined'  ){
        $util = {
            insights: {
                set: (msg) => {
                    console.log(`dryRun: sending to Insights using ${msg}`)
                }
            }
        }

    }

    function log(thisStep, thisMsg) {

        if (thisStep > prevStep && prevStep != 0) {
            end()
        }

        stepStartTime = Date.now() - startTime;

        if (mode != "production") {
            stepStartTime = 0

        }

        console.log(`Step ${thisStep}: ${thisMsg} STARTED at ${stepStartTime}ms.`);

        prevMsg = thisMsg;
        prevStep = thisStep;

    }

    function end() {
        var totalTimeElapsed = Date.now() - startTime;
        var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;

        if (mode != 'production') {
            prevStepTimeElapsed = 0
            totalTimeElapsed = 0
        }

        console.log(`Step ${prevStep}: ${prevMsg} FINISHED. It took ${prevStepTimeElapsed}ms to complete.`);

        $util.insights.set(`Step ${prevStep}: ${prevMsg}`, prevStepTimeElapsed);
        if (timeout > 0 && totalTimeElapsed > timeout) {
            throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + timeout + 'ms.');
        }
    }

    return {
        log,
        end
    }
}


newFormatters.nrsynthetics = function(name, commands) {
    return {
        content: newrelicSynthetics(name).formatter(commands),
        extension: 'txt',
        mimetype : 'application/javascript'
    }
}

