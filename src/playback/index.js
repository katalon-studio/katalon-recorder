var recorder;

const socket = io.connect('http://localhost:3500');
console.log('listen socket 3500')
let isAutomated;
let executionData;
browser.runtime.onMessage.addListener(browserAutomationListener);

function browserAutomationListener(mess) {
    if (mess.command !== "checkForAutomated") {
        return;
    }
    isAutomated = mess.isAutomated;
    browser.runtime.onMessage.removeListener(browserAutomationListener);
}

socket.on("sendHtml", function(data) {
    let intervalID = setInterval(() => {
        if (isAutomated == true && data) {
            let html = data.data;
            if (data.datafiles) {
                executeTestSuite(html, data.datafiles);
            } else {
                executeTestSuite(html);
            }
            clearInterval(intervalID);
        } else if (isAutomated == false) {
            //socket.emit("manual-disconnection", socket.id);
            clearInterval(intervalID);
        }
    }, 300);
});

const executeTestSuite = async function(html, datafiles) {
    let loadSettingData = await
    import ("../panel/js/background/load-setting-data.js");
    await loadSettingData.loadSettingData();
    let recorderModule = await
    import ("../panel/js/background/recorder.js");
    recorder = new recorderModule.BackgroundRecorder();

    let dataServiceModule = await
    import ("./service/data-service.js");
    let dataService = new dataServiceModule.DataService();

    if (datafiles) {
        dataService.setDataFiles(datafiles);
    }
    //parse data from HTML
    let parser = await
    import ("./service/parser-service.js");
    let testSuiteData = parser.readSuiteFromString(html);
    let testSuiteName = testSuiteData["testSuiteName"];
    let testCaseNames = testSuiteData["testCases"].map(testCase => testCase["testCaseName"]);

    socket.emit('infoTestSuite', {
        testSuite: testSuiteName,
        testCases: testCaseNames
    });
    //run test suite
    let actions = await
    import ("./service/play-actions-service.js");
    actions.setDataService(dataService);
    actions.setTestSuiteData(testSuiteData);
    actions.playSuiteAction(socket);
};