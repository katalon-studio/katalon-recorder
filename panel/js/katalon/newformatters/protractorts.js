

newFormatters.protractorts = function(name, commands) {
    var content = newprotractorts(name).formatter(commands);
    return {
      content: content,
      extension: 'ts',
      mimetype: 'text/javascript'
    }
  }

  const newprotractorts = function (scriptName){
    var _scriptName = scriptName  || "";
    const locatorType = {

        xpath: (target) => {
            return `by.xpath("${target.replace(/\"/g, "\'")}")`
        },
        css: (target) => {
            return `by.css("${target.replace(/\"/g, "\'")}")`
        },
    
        id: (target) => {
            return `by.id("${target.replace(/\"/g, "\'")}")`
        },
    
        link: (target) => {
            return `by.linkText("${target.replace(/\"/g, "\'")}")`
        },
    
        name: (target) => {
            return `by.name("${target.replace(/\"/g, "\'")}")`
        },
    
        tag_name: (target) => {
            return `by.tagName("${target.replace(/\"/g, "\'")}")`
        }
    }

    // https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Key.html
    const specialKeyMap = {
        '\${KEY_LEFT}': 'Key.ARROW_LEFT',
        '\${KEY_UP}': 'Key.ARROW_UP',
        '\${KEY_RIGHT}': 'Key.RIGHT',
        '\${KEY_DOWN}': 'Key.DOWN',
        '\${KEY_PAGE_UP}': 'Key.PAGE_UP',
        '\${KEY_PAGE_DOWN}': 'Key.PAGE_DOWN',
        '\${KEY_BACKSPACE}': 'Key.BACK_SPACE',
        '\${KEY_DEL}': 'Key.DELETE',
        '\${KEY_DELETE}': 'Key.DELETE',
        '\${KEY_ENTER}': 'Key.ENTER',
        '\${KEY_TAB}': 'Key.TAB',
        '\${KEY_HOME}': 'Key.HOME'
    }
    
    // protracto api
    // https://www.protractortest.org/#/api
    // katalon
    // https://docs.katalon.com/katalon-recorder/docs/selenese-selenium-ide-commands-reference.html
    const seleneseCommands = {
        "open": "await browser.get('_TARGET_');",
        "click": "await element(_BY_LOCATOR_).click();",
        "clickAndWait": 
            "const el__STEP_ = element(_BY_LOCATOR_);\n" +
            "\t\tawait browser.wait(EC.elementToBeClickable(el__STEP_));\n" + 
            "\t\tawait el__STEP_.click();",
        "doubleClick": "await browser.actions().doubleClick(element(_BY_LOCATOR_)).perform();",
        "type": "await element(_BY_LOCATOR_).sendKeys('_VALUE_');",
        "pause": "await browser.sleep(_VALUE_);",
        "refresh": "await browser.refresh();",
        "selectWindow":
            "const handles__STEP_ = await browser.getAllWindowHandles();\n" +
            "\t\tawait browser.switchTo().window(handles__STEP_[handles__STEP_.length - 1]);",
        "sendKeys": "await element(_BY_LOCATOR_).sendKeys(_SEND_KEY_);",
        "submit": "await element(_BY_LOCATOR_).submit();",
        "selectFrame":"await browser.switchTo().frame(element(_BY_LOCATOR_).getWebElement());",
        "select": "await element(_BY_LOCATOR_).element(by.cssContainingText('option', '_SELECT_OPTION_')).click();",
        "goBack": "await browser.navigate().back();",
        "assertConfirmation": "await browser.switchTo().alert().accept();",
        "verifyText": "expect(await element(_BY_LOCATOR_).getText()).toContain('_VALUE_STR_');",
        "verifyTitle": "expect(await browser.getTitle()).toContain('_VALUE_STR_');",
        "verifyValue": "expect(await element(_BY_LOCATOR_).getAttribute('value')).toContain('_VALUE_STR_')",
        "assertText": "expect(await element(_BY_LOCATOR_).getText()).toContain('_VALUE_STR_');",
        "assertTitle": "expect(await browser.getTitle()).toContain('_VALUE_STR_');",
        "assertValue": "expect(await element(_BY_LOCATOR_).getAttribute('value')).toContain('_VALUE_STR_')"
    }

    const header =
        "import { browser, by, element, Key, logging, ExpectedConditions as EC } from 'protractor';\n\n" +
        "describe('_SCRIPT_NAME_', () => {\n\n" +
        "\tbeforeAll(async () => { });\n" +
        "\tbeforeEach(async () => { });\n\n" +
        "\tit('should do something', async () => {\n"

    const footer =
        "\t});\n\n" +
        "\tafterEach(async () => {\n" +
        "\t\t// Assert that there are no errors emitted from the browser\n" +
        "\t\tconst logs = await browser.manage().logs().get(logging.Type.BROWSER);\n" +
        "\t\texpect(logs).not.toContain(jasmine.objectContaining({\n" +
        "\t\t\tlevel: logging.Level.SEVERE,\n" +
        "\t\t} as logging.Entry));\n" +
        "\t});\n\n" +
        "});"

    function formatter(commands) {

        return header.replace(/_SCRIPT_NAME_/g, _scriptName) +
            commandExports(commands).content +
            footer;
    }

    function commandExports(commands) {
        
        let output = commands.reduce((accObj, commandObj) => {
            let {command, target, value} = commandObj
            let cmd = seleneseCommands[command]
            if (typeof (cmd) == "undefined") {
                accObj.content += `\n\n\t// WARNING: unsupported command ${command}. Object= ${JSON.stringify(commandObj)}\n\n`
                return accObj
            }

            let funcStr = cmd;

            if (typeof (accObj) == "undefined") {
                accObj = {content: ""}
            }

            let targetStr = target.trim().replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')

            let valueStr = value.trim().replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')

            let selectOption = value.trim().split("=", 2)[1];

            let locatorStr = locator(target)

            funcStr = funcStr.replace(/_STEP_/g, accObj.step)
                .replace(/_TARGET_STR_/g, targetStr)
                .replace(/_BY_LOCATOR_/g, locatorStr)
                .replace(/_TARGET_/g, target)
                .replace(/_SEND_KEY_/g, specialKeyMap[value])
                .replace(/_VALUE_STR_/g, valueStr)
                .replace(/_VALUE_/g, value)
                .replace(/_SELECT_OPTION_/g, selectOption)

            accObj.step += 1
            accObj.content += `\t\t${funcStr}\n`

            return accObj
        }, {step: 1, content: ""})


        return output
    }

    function locator(target) {
        let locType = target.split("=", 1)

        let selectorStr = target.substr(target.indexOf("=") + 1, target.length)
        let locatorFunc = locatorType[locType]
        if (typeof (locatorFunc) == 'undefined') {
            return `by.xpath("${target.replace(/\"/g, "\'")}")`
            // return 'not defined'
        }

        return locatorFunc(selectorStr)

    }

    return {
        formatter,
        locator
    };
  }
  
