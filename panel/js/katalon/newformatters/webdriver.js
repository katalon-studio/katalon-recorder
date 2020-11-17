newFormatters.webdriver = function (name, commands) {
  let content = newWebDriver(name).formatter(commands);
  return {
    content: content,
    extension: 'js',
    mimetype: 'text/javascript'
  }
}

const newWebDriver = function (scriptName) {
  let _scriptName = scriptName || "";
  const locatorType = {
    xpath: (target) => {
      return `\`${target.replace(/'/g, "\\\'")}\``;
    },
    css: (target) => {
      return `\`${target.replace(/"/g, "\'")}\``;
    },
    id: (target) => {
      return `\`#${target.replace(/"/g, "\'")}\``;
    },
    link: (target) => {
      return `\`=${target.replace(/"/g, "\'")}\``;
    },
    name: (target) => {
      return `\`[name="${target.replace(/"/g, "\'")}"]\``;
    },
    tag_name: (target) => {
      return `\`${target.replace(/"/g, "\'")}\``;
    }
  };

  // https://w3c.github.io/webdriver/#keyboard-actions
  const specialKeyMap = {
    '\${KEY_LEFT}': 'ArrowLeft',
    '\${KEY_UP}': 'ArrowUp',
    '\${KEY_RIGHT}': 'ArrowRight',
    '\${KEY_DOWN}': 'ArrowDown',
    '\${KEY_PAGE_UP}': 'PageUp',
    '\${KEY_PAGE_DOWN}': 'PageDown',
    '\${KEY_BACKSPACE}': 'Backspace',
    '\${KEY_DEL}': 'Delete',
    '\${KEY_DELETE}': 'Delete',
    '\${KEY_ENTER}': 'Key.ENTER',
    '\${KEY_TAB}': 'Tab',
    '\${KEY_HOME}': 'Home',
    '\${KEY_END}': 'End'
  };

  // webdriver api
  // https://webdriver.io/docs/api.html
  // katalon
  // https://docs.katalon.com/katalon-recorder/docs/selenese-selenium-ide-commands-reference.html
  const seleneseCommands = {
    "open": "browser.url('_TARGET_');",
    "click": "$(_BY_LOCATOR_).click();",
    "clickAndWait":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tel__STEP_.waitForClickable();\n" +
      "\t\tel__STEP_.click();",
    "check":
        "const el__STEP_ = $(_BY_LOCATOR_);\n" +
        "\t\tif (!el__STEP_.isSelected()) " +
        "el__STEP_.click();\n",
    "doubleClick": "$(_BY_LOCATOR_).doubleClick();",
    "doubleClickAndWait":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tel__STEP_.waitForClickable();\n" +
      "\t\tel__STEP_.doubleClick();",
    "type": "$(_BY_LOCATOR_).setValue('_VALUE_');",
    "typeAndWait":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tel__STEP_.waitForClickable();\n" +
      "\t\tel__STEP_.setValue('_VALUE_');",
    "pause": "browser.pause(_VALUE_);",
    "refresh": "browser.refresh();",
    "sendKeys": "$(_BY_LOCATOR_).setValue(`_VALUE_`);",
    "sendKeysAndWait":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tel__STEP_.waitForClickable();\n" +
      "\t\tel__STEP_.setValue('_VALUE_');",
    "select": "$(_BY_LOCATOR_).selectByVisibleText('_SELECT_OPTION_');",
    "goBack": "browser.back();",
    "assertConfirmation": "browser.acceptAlert()",
    "verifyText": "expect( $(_BY_LOCATOR_)).toHaveTextContaining(`_VALUE_STR_`);",
    "verifyTitle": "expect( browser).toHaveTitle(`_VALUE_STR_`);",
    "verifyValue": "expect( $(_BY_LOCATOR_)).toHaveValueContaining(`_VALUE_STR_`)",
    "assertText": "expect( $(_BY_LOCATOR_)).toHaveTextContaining(`_VALUE_STR_`);",
    "assertTitle": "expect( browser).toHaveTitle(`_VALUE_STR_`);",
    "assertValue": "expect( $(_BY_LOCATOR_)).toHaveValueContaining(`_VALUE_STR_`)",
    "assertVisible": "expect($(_BY_LOCATOR_)).toBeDisplayed()",
    "waitForAlertPresent":
      "browser.waitUntil(function() {\n" +
      "\t\t\treturn browser.getAlertText()\n" +
      "\t\t})",
    "waitForElementPresent": "$(_BY_LOCATOR_).waitForExist();",
    "waitForValue":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tbrowser.waitUntil(() => el__STEP_.getValue() === `_VALUE_STR_`);",
    "waitForNotValue":
      "const el__STEP_ = $(_BY_LOCATOR_);\n" +
      "\t\tbrowser.waitUntil(() => el__STEP_.getValue() !== `_VALUE_STR_`);",
    "waitForVisible": "$(_BY_LOCATOR_).waitForDisplayed();",
  };

  const header =
    "/* This uses @webdriverio/sync */\n\n" +
    "describe('_SCRIPT_NAME_', function() {\n\n" +
    "\tit('should _SCRIPT_NAME_', function() {\n";

  const footer = "\t});\n\n});";

  function formatter(commands) {

    return header.replace(/_SCRIPT_NAME_/g, _scriptName) +
      commandExports(commands).content +
      footer;
  }

  function commandExports(commands) {

    return commands.reduce((accObj, commandObj) => {
      let { command, target, value } = commandObj;
      let cmd = seleneseCommands[command];
      if ( typeof (cmd) == "undefined" ) {
        accObj.content += `\n\n\t// WARNING: unsupported command ${command}. Object= ${JSON.stringify(commandObj)}\n\n`;
        return accObj;
      }

      let funcStr = cmd;

      if ( typeof (accObj) == "undefined" ) {
        accObj = { content: "" };
      }

      let targetStr = target.trim().replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

      let valueStr = value.trim().replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

      let selectOption = value.trim().split("=", 2)[1];

      let locatorStr = locator(target);

      funcStr = funcStr.replace(/_STEP_/g, accObj.step)
        .replace(/_TARGET_STR_/g, targetStr)
        .replace(/_BY_LOCATOR_/g, locatorStr)
        .replace(/_TARGET_/g, target)
        .replace(/_SEND_KEY_/g, specialKeyMap[value])
        .replace(/_VALUE_STR_/g, valueStr)
        .replace(/_VALUE_/g, value)
        .replace(/_SELECT_OPTION_/g, selectOption);

      accObj.step += 1;
      accObj.content += `\t\t${funcStr}\n`

      return accObj;
    }, { step: 1, content: "" });
  }

  function locator(target) {
    let locType = target.split("=", 1);
    let selectorStr = target.substr(target.indexOf("=") + 1, target.length);
    let locatorFunc = locatorType[locType];
    if ( typeof (locatorFunc) == 'undefined' ) {
      return `\`${target.replace(/'/g, '"')}\``;
    }

    return locatorFunc(selectorStr);
  }

  return {
    formatter,
    locator
  };
}

