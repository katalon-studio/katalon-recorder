import { TestSuite } from '../../models/test-model/test-suite.js';
import { TestCase } from '../../models/test-model/test-case.js';
import { TestCommand } from '../../models/test-model/test-command.js';

/**
 * get default target and target list from <td> string
 * @param {HTMLElement} targetElement - a <td> pairs that contains data about command's target
 * @returns {{defaultTarget: string, targetList: string[]}}
 */
function parseTarget(targetElement) {
    const commandDefaultTarget = targetElement.childNodes[0].data ?? "";
    const commandTargetList = [...targetElement.querySelectorAll("option")].map(element => {
        return element.innerHTML;
    });
    return { defaultTarget: commandDefaultTarget, targetList: commandTargetList }
}

/**
 * parse HTML <table> string to TestCase object
 *
 * @param {HTMLElement} testCaseElement - HTML <table> string
 * @returns {null|TestCase} - parsed TestCase object
 */
function parseTestCase(testCaseElement) {
    const testCaseTitle = testCaseElement.querySelector("thead>tr>td").innerHTML;
    const testCase = new TestCase(testCaseTitle);
    const commandElements = testCaseElement.querySelectorAll("tbody tr");
    for (const commandElement of commandElements) {
        const commandPartElements = commandElement.querySelectorAll("td");
        const commandName = commandPartElements[0].innerHTML;
        const commandValue = commandPartElements[2].innerHTML;
        const { defaultTarget: commandDefaultTarget, targetList: commandTargetList } = parseTarget(commandPartElements[1]);
        const command = new TestCommand(commandName, commandDefaultTarget, commandTargetList, commandValue);
        testCase.commands.push(command);
    }
    return testCase;
}

/**
 * parse HTML string to TestSuite object
 * @param suiteName
 * @param suiteHTLMString
 * @returns {TestSuite}
 */
const unmarshall = (suiteName, suiteHTLMString) => {
    if (!suiteHTLMString) {
        throw "Incorrect format";
    }
    try {
        let testSuite = new TestSuite(suiteName);
        const doc = new DOMParser().parseFromString(suiteHTLMString, "text/html");
        const testCaseElements = doc.getElementsByTagName("table");
        for (const testCaseElement of testCaseElements) {
            const testCase = parseTestCase(testCaseElement);
            testSuite.testCases.push(testCase);
        }
        return testSuite;
    } catch (e) {
        throw "Incorrect format";
    }

}


/**
 * convert TestCommand object to pre-defined HTML string format
 * @param {TestCommand} command
 * @returns {string}
 */
function marshallCommand(command) {
    let targetListHTML = command.targets.map(target => `<option>${target}</option>`).join('');
    return `<tr><td>${command.name}</td><td>${command.defaultTarget}<datalist>${targetListHTML}</datalist></td><td>${command.value}</td></tr>`
}

/**
 * convert TestCase object to pre-defined HTML string format
 * @param {TestCase} testCase
 * @returns {string}
 */
function marshallTestCase(testCase) {
    let commandsHTMLString = testCase.commands.map(command => marshallCommand(command)).join('\n');
    return `<table cellpadding="1" cellspacing="1" border="1">
<thead>
<tr><td rowspan="1" colspan="3">${testCase.name}</td></tr>
</thead>
<tbody>
${commandsHTMLString}
</tbody></table>`
}

/**
 * convert TestSuite object to pre-defined HTML string format
 * @param {TestSuite} testSuite
 * @returns {string}
 */
const marshall = (testSuite) => {
    let testCasesHTMLString = testSuite.testCases.map(testCase => marshallTestCase(testCase)).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="content-type" />
<title>${testSuite.name}</title>
</head>
<body>
${testCasesHTMLString}
</body>
</html>`
}

/**
 * parse test suite name from HTML string
 * @param htmlString
 * @returns {string}
 */
const parseSuiteName = (htmlString) => {
    const pattern = /<title>(.*)<\/title>/gi;
    const suiteName = pattern.exec(htmlString)[1];
    return suiteName;
}

export { unmarshall, marshall, parseSuiteName }