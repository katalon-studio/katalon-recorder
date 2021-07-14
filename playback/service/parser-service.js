function getTestCaseName(testSteps) {
    let tdHTML = testSteps.slice(0, 1)[0].match(/<td[\s\S]*?<\/td>/gi)[0];
    let tr = document.createElement("tr");
    tr.innerHTML = tdHTML;
    return tr.innerText;
}

function getTestSuiteName(test_suite) {
    let testSuiteHTML = test_suite.match(/<title[\s\S]*?<\/title>/gi);
    let head = document.createElement("head");
    head.innerHTML = testSuiteHTML;
    return head.innerText;
}

function trimBeforeElementTag(htmlString) {
    return htmlString.split("\n").map(line => line.trim()).join("");
}

function changeAfterValueElement(htmlString) {
    if (/\\n/.test(htmlString)) {
        htmlString = htmlString.replace(/\\n/g, '\n');
    }
    return htmlString;
}

function readSuiteFromString(test_suite) {
    let testSuiteName = getTestSuiteName(test_suite);
    let testCases = test_suite.match(/<table[\s\S]*?<\/table>/gi);
    testCases = testCases.map(testCase => {
        let testSteps = testCase.match(/<tr[\s\S]*?<\/tr>/gi);
        let testCaseName = getTestCaseName(testSteps);
        let testCaseHTML = trimBeforeElementTag(testSteps.slice(1).join(""));
        testCaseHTML = changeAfterValueElement(testCaseHTML);
        return {
            testCaseName: testCaseName,
            testCaseHTML: testCaseHTML
        }
    });
    return { testCases, testSuiteName };
}

export { readSuiteFromString }