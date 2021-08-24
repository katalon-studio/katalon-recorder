//this must be a global variable so that every time this script is loaded, it won't cause redeclaration error
//used to store variables for later check declarations
//this object will store the name of declared variables and their type
this.katalonStudioStoredVars = {};
this.katalonStudioDefaultTimeoutTimeBySecond = 60;

this.unsupportedCommands = ["ajaxWait",
  "ajaxWaitAndWait",
  "break",
  "chooseCancelOnNextPrompt",
  "chooseCancelOnNextPromptAndWait",
  "domWait",
  "domWaitAndWait",
  "editContent",
  "editContentAndWait",
  "pageWait",
  "pageWaitAndWait",
  "prePageWait",
  "prePageWaitAndWait",
  "sendKeys",
  "sendKeysAndWait",
  "showElement",
  "showElementAndWait",
  "waitPreparation",
  "waitPreparationAndWait",
  "gotoIf",
  "gotoLabel",
  "label",
  "writeToCSV",
  "appendToCSV",
  "assertNotWhetherThisFrameMatchFrameExpression",
  "assertNotWhetherThisWindowMatchWindowExpression",
  "assertWhetherThisFrameMatchFrameExpression",
  "assertWhetherThisWindowMatchWindowExpression",
  "verifyWhetherThisFrameMatchFrameExpression",
  "verifyWhetherThisWindowMatchWindowExpression",
  "verifyNotWhetherThisFrameMatchFrameExpression",
  "verifyNotWhetherThisWindowMatchWindowExpression",
  "storeWhetherThisFrameMatchFrameExpression",
  "storeWhetherThisWindowMatchWindowExpression",
  "waitForWhetherThisFrameMatchFrameExpression",
  "waitForWhetherThisWindowMatchWindowExpression",
  "waitForNotWhetherThisFrameMatchFrameExpression",
  "waitForNotWhetherThisWindowMatchWindowExpression",
  "loadVars",
  "endLoadVars",
  "storeCsv"
]

this.name = "katalon";

this.options = {
  receiver: "selenium",
  environment: "*chrome",
  packageName: "com.example.tests",
  superClass: "GroovySeleneseTestCase",
  indent: 'tab',
  initialIndents: '2',
  defaultExtension: "groovy"

};

options.header =
  "import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint\n" +
  "import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase\n" +
  "import static com.kms.katalon.core.testdata.TestDataFactory.findTestData\n" +
  "import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject\n" +
  "import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint\n" +
  "import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory\n" +
  "import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords\n" +
  "import com.kms.katalon.core.model.FailureHandling as FailureHandling\n" +
  "import com.kms.katalon.core.testcase.TestCase as TestCase\n" +
  "import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory\n" +
  "import com.kms.katalon.core.testdata.TestData as TestData\n" +
  "import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory\n" +
  "import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository\n" +
  "import com.kms.katalon.core.testobject.TestObject as TestObject\n" +
  "import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords\n" +
  "import com.kms.katalon.core.webui.driver.DriverFactory as DriverFactory\n" +
  "import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords\n" +
  "import internal.GlobalVariable as GlobalVariable\n" +
  "import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI\n" +
  "import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile\n" +
  "import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS\n" +
  "import com.kms.katalon.core.testobject.SelectorMethod\n" +
  "\n" +
  "import com.thoughtworks.selenium.Selenium\n" +
  "import org.openqa.selenium.firefox.FirefoxDriver\n" +
  "import org.openqa.selenium.WebDriver\n" +
  "import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium\n" +
  "import static org.junit.Assert.*\n" +
  "import java.util.regex.Pattern\n" +
  "import static org.apache.commons.lang3.StringUtils.join\n" +
  "import org.testng.asserts.SoftAssert\n" +
  "\n" +
  "SoftAssert softAssertion = new SoftAssert();\n" +
  "WebUI.openBrowser('${baseURL}')\n" +
  "def driver = DriverFactory.getWebDriver()\n" +
  'String baseUrl = "${baseURL}"\n' +
  'selenium = new WebDriverBackedSelenium(driver, baseUrl)\n';

options.footer = '';

Equals.prototype.verify = function () {
  return "softAssertion.assertEquals(" + this.e1.toString() + ", " + this.e2.toString() + ")";
};

NotEquals.prototype.verify = function () {
  return "assertNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ")";
};

function RegexpMatch(pattern, expression, command) {
  this.pattern = pattern;
  this.expression = expression;
  this.command = command;
}

function RegexpNotMatch(pattern, expression, command) {
  this.pattern = pattern;
  this.expression = expression;
  this.negative = true;
  this.command = command;
}

RegexpMatch.prototype.verify = function () {
  let pattern = string(this.pattern);
  if (pattern.includes("$")) {
    let regEx = /"/g;
    pattern = pattern.replaceAll(regEx, "'");
  }
  if (this?.command?.command.includes("verify")) {
    return `softAssertion.assertEquals(Pattern.matches('${this.expression}', ${pattern}), true)`
  }
  return `WebUI.verifyMatch(${this.expression}, ${pattern}, true)`;
};

RegexpNotMatch.prototype.verify = function () {
  let pattern = string(this.pattern);
  if (pattern.includes("$")) {
    let regEx = /"/g;
    pattern = pattern.replaceAll(regEx, "'");
  }
  if (this.command.command.includes("verify")) {
    return `softAssertion.assertEquals(Pattern.matches('${this.expression}', ${pattern}), false)`
  }
  return `WebUI.verifyNotMatch(${this.expression}, ${pattern}, true)`
};

CallSelenium.prototype.toString = function (command) {
  let result = '';
  if (this.negative) {
    result += '!';
  }
  if (options.receiver) {
    result += options.receiver + '.';
  }

  result += this.message;
  result += '(';
  if (command?.command === "storeEval") {

    result += `" ${expandForStoreEvalCommand()} " + `;
  }

  for (let i = 0; i < this.args.length; i++) {
    //need to wrap the last argument of selenium.type ().toString()
    if (i === this.args.length -1 && command?.command === "type" && !/^"\w*"$/.test(this.args[i])){
      result += '(';
    }
    result += this.args[i];
    if (i < this.args.length - 1) {
      result += ', ';
    }
  }
  if (command?.command === "type" && !/^"\w*"$/.test(this.args[this.args.length - 1])) {
      result += ').toString()';
  }

  result += ')';
  return result;
};

function indents() {
  return '';
}

function formatComment(comment) {
  return `/* ${comment.comment} */`;
}

function convertConditionExpression(originalExpression) {
  let expression = originalExpression;
  if (/"\${/.test(expression)) {
    //expression has "" surround it => convert the expression to string
    expression = expression.replaceAll('"${', "").replaceAll('}"', ".toString()");
  } else {
    expression = expression.replaceAll("${", "").replaceAll("}", "");
  }
  return expression;
}

function convertRunScript(expression, command){
  let target = xlateArgument(command.target);
  //remove both " surrounding target
  target = target.substring(1, target.length - 1);
  if (command.value === "") {
    return `WebUI.executeJavaScript("${target}", null)`;
  }
  //store result into variable
  addDeclaredVar(command.value);
  // KR allows variable with empty space, but javascript doesn't.
  let varName = command.value.replace(/ /g, '_').replace(/\./g, '_');

  if (this.katalonStudioStoredVars[varName]) {
    let bracket = target.includes("$") ? `'` : `"`;
    let statement = `${varName} = WebUI.executeJavaScript(${bracket}${target}${bracket}, null)`;
    let type = this.katalonStudioStoredVars[varName];
    return statement + getTypeConversion(type);
  }

  //declare new variable
  this.katalonStudioStoredVars[varName] = command.target;
  let bracket = target.includes("$") ? `'` : `"`;
  return `String ${varName} = WebUI.executeJavaScript(${bracket}${target}${bracket}, null)`;
}

//https://docs.katalon.com/katalon-studio/docs/webui-drag-and-drop-to-object.html
function convertDragAndDrop(expression, command){
  let draggedObjectDeclaration = `TestObject draggedObject = new TestObject('draggedObject');\n`;
  let draggedObjectLocator = parse_locator(command.target);
  let selector = convertLocatorToKatalonStudioSelector(draggedObjectLocator, "draggedObject");
  if (selector) {
    draggedObjectDeclaration += selector;
  } else {
    draggedObjectDeclaration += `/*Cannot find suitable Katalon Studio selector for ${command.target}*/`
  }

  let destinationObjectDeclaration = `TestObject destinationObject = new TestObject('destination');\n`
  let destinationObjectLocator = parse_locator(command.value);
  selector = convertLocatorToKatalonStudioSelector(destinationObjectLocator, "destinationObject");
  if (selector) {
    destinationObjectDeclaration += selector;
  } else {
    destinationObjectDeclaration += `/*Cannot find suitable Katalon Studio selector for ${command.value}*/`
  }

  return draggedObjectDeclaration + destinationObjectDeclaration + `WebUI.dragAndDropToObject(draggedObject, destinationObject)`;
}

//https://docs.katalon.com/katalon-studio/docs/webui-upload-file-drag-and-drop.html
function convertUpload(expression, command){
  let filePaths = command?.value;
  //KS multiple files separate by \n
  if (filePaths?.split(",").length > 0) {
    filePaths = filePaths.split(",").join(`\\n`)
  }
  if (command?.target === "") {
    return `WebUI.uploadFileWithDragAndDrop(${xlateArgument(filePaths)})`
  } else {
    let testObject = `TestObject testObject = new TestObject('source');\n`;
    let testObjectLocator = parse_locator(command.target);
    let selector = convertLocatorToKatalonStudioSelector(testObjectLocator, "testObject");
    if (selector) {
      testObject += selector;
    } else {
      testObject += `/*Cannot find suitable Katalon Studio selector for ${command.target}*/`
    }
    return testObject + `WebUI.uploadFileWithDragAndDrop(testObject, ${xlateArgument(filePaths)})`
  }
}

function statement(expression, command) {
  //this means KR does not support this command
  if (command === undefined) {
    if (expression?.message === "#") {
      return expression.args[0];
    } else if (this.unsupportedCommands.includes(expression?.message)){
      return `Katalon Studio does not support: ${expression.message}`;
    }
  }

  if (this.unsupportedCommands.includes(command?.command)) {
    return formatComment(new Comment(`Katalon Studio does not support: ${command.command}`));
  }

  switch (command?.command) {
    case "captureEntirePageScreenshot":
      return `WebUI.takeScreenshot('${command.target}.png')`;
    case "runScript":
      return convertRunScript(expression, command);
    case "if": {
      let conditionExpression = convertConditionExpression(command.target);
      return `if (${conditionExpression}) {`;
    }
    case "endIf":
      return `}`;
    case "else":
      return `} else {`;
    case "elseIf": {
      let conditionExpression = convertConditionExpression(command.target);
      return `} else if (${conditionExpression}) {`
    }
    case "while": {
      let conditionExpression = convertConditionExpression(command.target);
      return `while (${conditionExpression}) {`;
    }
    case "endWhile":
      return `}`;
    case "setTimeout": {
      this.katalonStudioDefaultTimeoutTimeBySecond = parseInt(command.target) / 1000
      return;
    }
    case "dragAndDropToObjectByJqueryUI":
    case "dragAndDropToObject":
      return convertDragAndDrop(expression, command);
    case "upload":
      return convertUpload(expression, command);
    default:
      return expression.toString(command);
  }
}

//Understand KS test object: https://docs.katalon.com/katalon-studio/docs/manage-web-test-object.html
//Check for how many type of locator support by KR: go to selenium-browserbot.js search for this.locationStrategies
function convertLocatorToKatalonStudioSelector(locatorObject, objectName) {
  let result = "";
  switch (locatorObject?.type) {
    case "class":
      result += `${objectName}.setSelectorValue(SelectorMethod.CSS,".${locatorObject.string}")\n`
      result += `${objectName}.setSelectorMethod(SelectorMethod.CSS)\n`
      break;
    case "css":
      result += `${objectName}.setSelectorValue(SelectorMethod.CSS,"${locatorObject.string}")\n`
      result += `${objectName}.setSelectorMethod(SelectorMethod.CSS)\n`
      break;
    case "id":
      result += `${objectName}.setSelectorValue(SelectorMethod.CSS,"#${locatorObject.string}")\n`
      result += `${objectName}.setSelectorMethod(SelectorMethod.CSS)\n`
      break;
    case "alt":
      result += `${objectName}.setSelectorValue(SelectorMethod.XPATH,"//*[contains(@alt, \\"${locatorObject.string}\\")]")\n`
      result += `${objectName}.setSelectorMethod(SelectorMethod.XPATH)\n`
      break;
    case "xpath":
      result += `${objectName}.setSelectorValue(SelectorMethod.XPATH,"${locatorObject.string}")\n`
      result += `${objectName}.setSelectorMethod(SelectorMethod.XPATH)\n`
      break;
    case "name":
      result += `${objectName}.setSelectorValue(SelectorMethod.XPATH,"//*[contains(@name, \\"${locatorObject.string}\\")]")`
      result += `${objectName}.setSelectorMethod(SelectorMethod.XPATH)\n`
      break;
    case "implicit":
      if (locatorObject.string.startsWith('//')) {
        result += `${objectName}.setSelectorValue(SelectorMethod.XPATH,"${locatorObject.string}")\n`
        result += "${objectName}.setSelectorMethod(SelectorMethod.XPATH)\n";
        break;
      }
    default:
      result = null;
  }
  return result;
}


function waitFor(expression) {
  return `for (int second = 0;; second++){
    if (second >= ${this.katalonStudioDefaultTimeoutTimeBySecond ?? 60}) fail("timeout")
    try{
        ${expression.setup ? expression.setup() + " " : ""}
        if (${expression.toString()}) break
    } catch (Exception e){
    
    }
    Thread.sleep(1000)
  }`;
}

function echo(message) {
  return "println(" + xlateArgument(message) + ")";
}

function expandForStoreEvalCommand() {
  let variables = '';
  //inject declared variables to javascript code
  for (let i in this.katalonStudioStoredVars) {
    if (isVarName(i)) {
      variables += `var ${i} = \\"" + ${i} + "\\";`
    }
  }
  //inject storedVars object
  if (Object.keys(this.katalonStudioStoredVars).length !== 0) {
    let str = `{ ${Object.keys(this.katalonStudioStoredVars).map(key => `'${key}': ${key}`)} }`;
    variables += `var storedVars = ${str};`
  }
  return variables;
}

function assignToVariable(type, variable, expression, command) {
  if (!type) type = "def";
  if (!expression || !command || !variable) return "";
  //This flag to represent whether expression assigned to the variable is primitive type
  let isLiteral = false;
  //KR allows variable with empty space, but Groovy doesn't.
  let varName = variable.replace(/ /g, '_').replace(/\./g, '_');
  let varValue = expression.toString(command);
  //Get exact type of variable
  try {
    if (!isNaN(parseFloat(eval(varValue)))) {
      varValue = eval(varValue);
      isLiteral = true;
      if (varValue % 1 === 0) {
        type = "int";
      } else {
        type = "double";
      }
    }
  } catch (e) {
  }
  //When the command contains eval we cannot use varValue to pass to eval() function
  //This happen because after go through expression.toString() the varValue become the code on KS
  //Ex: Command{command = "storeEval", target = 5, value = "pages"} => varValue = "selenium.getEval(\"  \" + \"5\")"
  //Therefore, we need to check the value of command.target
  if (command?.command.includes("Eval")) {
    try {
      if (!isNaN(parseFloat(eval(command?.target)))) {
        if (eval(command?.target) % 1 === 0) {
          type = "int";
        } else {
          type = "double";
        }
      }
    } catch (e) {
    }
  }

  if (this.katalonStudioStoredVars[varName]) {
    type = this.katalonStudioStoredVars[varName];
    //If this variable has been declared and the expression is not primitive
    //then we have to convert it to the type of the declared variable
    if (!isLiteral) {
      return `${varName} = ${varValue}${getTypeConversion(type)}`
    }
    return varName + " = " + varValue;
  }
  this.katalonStudioStoredVars[varName] = type;
  //If this variable has been declared and the expression is not primitive
  //then we have to convert it to the type of the declared variable
  if (!isLiteral) {
    return type + " " + varName + " = " + varValue + getTypeConversion(type);
  }
  return type + " " + varName + " = " + varValue;
}

function getTypeConversion(type) {
  switch (type) {
    case "int":
      return ".toInteger()";
    case "double":
      return ".toDouble()";
    default:
      return "";
  }

}

function verifyTrue(expression) {
  if (expression === null) {
    return "";
  }
  return "softAssertion.assertEquals(" + expression.toString() + ", true)";
}

function verifyFalse(expression) {
  if (expression === null) {
    return "";
  }
  return "softAssertion.assertEquals(" + expression.toString() + ", false)";
}


//this is a override method from formatCommandOnlyAdapter.js
//bypass unsupported AndWait commands
function filterForRemoteControl(originalCommands) {
  if (this.remoteControl) {
    let commands = [];
    for (let i = 0; i < originalCommands.length; i++) {
      let c = originalCommands[i];
      if (c.type === 'command' && c.command.match(/AndWait$/) && !this.unsupportedCommands.includes(c.command)) {
        let c1 = c.createCopy();
        c1.command = c.command.replace(/AndWait$/, '');
        commands.push(c1);
        commands.push(new Command("waitForPageToLoad", options['global.timeout'] || "30000"));
      } else {
        commands.push(c);
      }
    }
    if (this.postFilter) {
      // formats can inject command list post-processing here
      commands = this.postFilter(commands);
    }
    return commands;
  } else {
    return originalCommands;
  }
}
