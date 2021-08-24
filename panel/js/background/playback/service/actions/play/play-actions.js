import { trackingLocalPlayback } from "../../../../../UI/services/tracking-service/playback-local-tracking.js";
import { addBrokenLocator, updateTestCaseStatusUI } from "../../../../../UI/view/self-healing/self-healing-tab.js";
import {
    getPossibleTargetList,
    isCommandExcluded,
    isSelfHealingEnable
} from "../../../../../UI/services/self-healing-service/utils.js";
import { trackingExecuteTestSuites, trackingTestCase } from "../../../../../UI/services/tracking-service/segment-tracking-service.js";
import { executeWriteToCSV } from "./execute-writeToCSV.js";
import { executeAppendToCSV } from "./execute-appendToCSV.js";
import { executeStoreCSV } from "./execute-storeCSV.js";
import { saveData } from "../../../../../UI/services/data-service/save-data.js"
import { getSelectedCase, setSelectedCase } from "../../../../../UI/view/testcase-grid/selected-case.js";
import { classifyRecords } from "../../../../../UI/view/records-grid/re-assign-id.js";
import { getRecordsArray } from "../../../../../UI/view/records-grid/get-records-array.js";
import { setColor } from "../../../../../UI/view/records-grid/set-color.js";
import { setCaseScrollTop } from "../../../../../UI/view/records-grid/set-case-scroll-top.js";
import { getSelectedSuite, setSelectedSuite } from "../../../../../UI/view/testcase-grid/selected-suite.js";
import { findTestCaseById } from "../../../../../UI/services/data-service/test-case-service.js";
import { findTestSuiteById, getAllTestSuites } from "../../../../../UI/services/data-service/test-suite-service.js";
import { testSuitContainerOpen } from "../../../../../UI/view/testcase-grid/test-suite-container.js";
import { testSuiteDropdownOpen } from "../../../../../UI/view/testcase-grid/render-new-test-suite.js";
let blockStack = [];
let labels = {};
let expectingLabel = null;

let currentPlayingCommandIndex = -1;

let currentTestCaseId = "";
let isPause = false;
let isPlayingSuite = false;
let isPlayingAll = false;

let commandType = "";
let pageCount = 0;
let pageTime = "";
let ajaxCount = 0;
let ajaxTime = "";
let domCount = 0;
let domTime = "";
let implicitCount = 0;
let implicitTime = "";

let caseFailed = false;

let trackingPlay = false;

//self-healing variables
let enableSelfHealing;
let possibleTargets = [];
let isSelfHealingInvoke = false;

function initBeforePlay() {
    $("#selfHealingList").empty();
    saveData();
    $("#logcontainer").empty();
    $("#result-runs").html("0");
    $("#result-failures").html("0");
    recorder.detach();
    cleanCommandToolBar();
    initAllSuite();
    clearScreenshotContainer();
    // KAT-BEGIN focus on window when playing test suite
    if (contentWindowId) {
        browser.windows.update(contentWindowId, { focused: true });
    }
    declaredVars = {};
    // KAT-END
    isSelfHealingInvoke = false;
}

const playTestAllTestSuitesAction = () => {
    initBeforePlay();
    playSuites(0);
}

const playTestSuiteAction = (i = 0, isInit = true) => {
    if (isInit) {
        initBeforePlay();
    }
    playSuite(i);
}

const playTestCaseAction = async() => {
    let s_suite = getSelectedSuite();
    let s_case = getSelectedCase();

    if (s_suite && s_case) {
        const testSuiteID = s_suite.id;
        const testCaseID = s_case.id;
        const testSuite = findTestSuiteById(testSuiteID)
        const testCase = findTestCaseById(testCaseID);
        initBeforePlay();
        setCaseScrollTop(s_case);
        sideex_log.info("Playing test case " + testSuite.name + " / " + testCase.name);
        logStartTime();
        play();
        trackingPlay = true;
    } else {
        showDialog("Please select a test case to play!", true);
    }

}

const executeCommandAction = (event) => {
    let temp = event.target;
    cleanCommandToolBar();
    while (temp.tagName.toLowerCase() !== "body") {
        if (/records-(\d)+/.test(temp.id)) {
            let index = temp.id.split("-")[1];
            recorder.detach();
            executeCommand(index);
        }
        if (temp.id === "command-grid") {
            break;
        } else temp = temp.parentElement;
    }
}

const stopAction = async() => {
    if (isPause) {
        isPause = false;
        switchPR();
    }

    isPlaying = false;

    if (isPlayingSuite) {
        isPlayingSuite = false;
        trackingExecuteTestSuites('suite');
    }
    if (isPlayingAll) {
        isPlayingAll = false;
        trackingExecuteTestSuites('all');
    }

    switchPS();
    sideex_log.info("Stop executing");
    initAllSuite();
    finalizePlayingProgress();
}

const resumeAction = async() => {
    if (currentTestCaseId !== getSelectedCase().id)
        setSelectedCase(currentTestCaseId);
    if (isPause) {
        sideex_log.info("Resuming");
        isPlaying = true;
        isPause = false;
        extCommand.attach();
        switchPR();
        disableClick();
        executionLoop()
            .then(finalizePlayingProgress)
            .catch(catchPlayingError);
    }
}

const pauseAction = () => {
    if (isPlaying) {
        sideex_log.info("Pausing");
        isPause = true;
        isPlaying = false;
        switchPR();
    }
}

function disableClick() {
    document.getElementById("pause").disabled = false;
    document.getElementById('testCase-grid').style.pointerEvents = 'none';
    document.getElementById('command-container').style.pointerEvents = 'none';
    document.getElementById('selfHealingContainer').style.pointerEvents = 'none';
}

function enableClick() {
    document.getElementById("pause").disabled = true;
    document.getElementById('testCase-grid').style.pointerEvents = 'auto';
    document.getElementById('command-container').style.pointerEvents = 'auto';
    document.getElementById('selfHealingContainer').style.pointerEvents = 'auto';

}

function cleanCommandToolBar() {
    $("#command-command").val("");
    $("#command-target").val("");
    $("#command-value").val("");
}

function openTestSuiteExplorer(){
    const image = $("#testSuiteDropdown").find("img");
    const src = $(image).attr("src");
    if (src.includes("off")) {
        testSuitContainerOpen()
    }
    const testCase = getSelectedCase();
    const testSuite = testCase.parentElement;
    if (testSuite){
        testSuiteDropdownOpen(testSuite.id);
    }
    testCase.scrollIntoView({block: "center"})
}

function play() {
    openTestSuiteExplorer();
    addSampleDataToScreenshot();
    initializePlayingProgress()
        .then(executionLoop)
        .then(finalizePlayingProgress)
        .catch(catchPlayingError);
}

function playAfterConnectionFailed() {
    if (isPlaying) {
        initializeAfterConnectionFailed()
            .then(executionLoop)
            .then(finalizePlayingProgress)
            .catch(catchPlayingError);
    }
}

function initializeAfterConnectionFailed() {
    disableClick();

    isRecording = false;
    isPlaying = true;

    commandType = "preparation";
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";

    caseFailed = false;

    currentTestCaseId = getSelectedCase().id;

    return Promise.resolve(true);
}

function initAllSuite() {
    let suites = $("#testCase-grid .message");
    for (let suite of suites) {
        let testCases = suite.getElementsByTagName("p");
        for (let testCase of testCases) {
            $(testCase).removeClass('fail success');
        }
    }
}

function playSuite(i) {
    isPlayingSuite = true;
    const selectedTestSuite = getSelectedSuite();
    const testSuiteID = selectedTestSuite.id;
    const testSuite = findTestSuiteById(testSuiteID);

    let length = testSuite.getTestCaseCount();
    if (i < length) {
        const testCase = testSuite.testCases[i];
        setSelectedCase(testCase.id);
        setCaseScrollTop(getSelectedCase());
        sideex_log.info("Playing test case " + testSuite.name + " / " + testCase.name);
        logStartTime();
        play();
        nextCase(i);
    } else {
        isPlayingSuite = false;
        switchPS();
        if (!isPlayingAll) {
            trackingExecuteTestSuites('suite');
            trackingLocalPlayback("selfHealing", isSelfHealingInvoke);
        }
    }
}

function nextCase(i) {
    if (isPlaying || isPause) setTimeout(function() {
        nextCase(i);
    }, 500);
    else if (isPlayingSuite) playSuite(i + 1);
}

function playSuites(i) {
    isPlayingAll = true;
    let suites = getAllTestSuites();
    let length = suites.length;
    if (i < length) {
        setSelectedSuite(suites[i].id);
        playSuite(0);
        nextSuite(i);
    } else {
        isPlayingAll = false;
        switchPS();
        trackingExecuteTestSuites('all');
        trackingLocalPlayback("selfHealing", isSelfHealingInvoke);
    }
}

function nextSuite(i) {
    if (isPlayingSuite) setTimeout(function() {
        nextSuite(i);
    }, 2000);
    else if (isPlayingAll) playSuites(i + 1);
}

function logExecutingTestStep(commandName, commandTarget, commandValue) {
    if (commandTarget.includes("d-XPath")) {
        sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
    } else {
        if (commandName !== '#') {
            sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
        }
    }
}

function executeCommand(index) {
    index = parseInt(index) - 1;
    const selectedCase = getSelectedCase();
    const testCase = findTestCaseById(selectedCase.id);
    const testCommand = testCase.commands[index];
    let commandName = testCommand.name;
    let commandTarget = testCommand.defaultTarget;
    let commandValue = testCommand.value;

    logExecutingTestStep(commandName, commandTarget, commandValue);

    initializePlayingProgress(true);

    setColor(index + 1, "executing");

    browser.tabs.query({
            windowId: extCommand.getContentWindowId(),
            active: true
        })
        .then(function(tabs) {
            if (commandName === 'writeToCSV') {
                let executionResult = executeWriteToCSV(commandTarget, commandValue);
                if (executionResult.success === true) {
                    return {
                        result: 'success'
                    }
                } else {
                    return {
                        result: executionResult.errorMessage
                    }
                }
            }
            if (commandName === 'appendToCSV') {
                let executionResult = executeAppendToCSV(commandTarget, commandValue);
                if (executionResult.success === true) {
                    return {
                        result: 'success'
                    }
                } else {
                    return {
                        result: executionResult.errorMessage
                    }
                }
            }
            return browser.tabs.sendMessage(tabs[0].id, {
                commands: commandName,
                target: commandTarget,
                value: commandValue
            }, {
                frameId: extCommand.getFrameId(tabs[0].id)
            })
        })
        .then(function(result) {
            if (result.result !== "success") {
                sideex_log.error(result.result);
                setColor(index + 1, "fail");
                if (!result.result.includes("did not match")) {
                    return true;
                }
            } else {
                setColor(index + 1, "success");
            }
        })

    finalizePlayingProgress();
}

function cleanStatus() {
    let commands = getRecordsArray();
    for (let i = 0; i < commands.length; ++i) {
        commands[i].setAttribute("class", "");
        commands[i].getElementsByTagName("td")[0].classList.remove("stopping");
    }
    classifyRecords(1, commands.length);
}

function initializePlayingProgress(isDbclick) {

    blockStack = [];

    disableClick();

    isRecording = false;
    isPlaying = true;

    switchPS();

    currentPlayingCommandIndex = currentPlayingFromHereCommandIndex - 1;
    currentPlayingFromHereCommandIndex = 0;

    // xian wait
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";

    caseFailed = false;

    currentTestCaseId = getSelectedCase().id;

    if (!isDbclick) {
        $("#" + currentTestCaseId).removeClass('fail success');
    }

    cleanStatus();

    return extCommand.init();
}

function executionLoop() {
    const testCase = findTestCaseById(currentTestCaseId);

    handleDisplayVariables();

    if (currentPlayingCommandIndex + 1 >= testCase.getTestCommandCount()) {
        if (!caseFailed) {
            setColor(currentTestCaseId, "success");
            logEndTime();
            sideex_log.info("Test case passed");
            if (enableSelfHealing) {
                updateTestCaseStatusUI();
            }
            if (trackingPlay) {
                trackingTestCase('execute', null, true);
                trackingPlay = false;
                if (!isPlayingAll && !isPlayingSuite) {
                    //only for execute test case
                    getCheckLoginData().then(result => {
                        if (result.checkLoginData.passedTestCase !== undefined) {
                            result.checkLoginData.passedTestCase++;
                            browser.storage.local.set(result);
                        }
                    });
                }
                if (!isPlayingSuite && !isPlayingAll) {
                    trackingLocalPlayback("executeTestCase", true).then(() => {
                        trackingLocalPlayback("selfHealing", isSelfHealingInvoke);
                    });

                }
            }

        } else {
            caseFailed = false;
        }
        return true;
    }

    let commandElements = getRecordsArray();
    if (commandElements[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.contains("break") &&
        !commandElements[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.contains("stopping")) {
        commandElements[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.add("stopping");
        sideex_log.info("Breakpoint: Stop.");
        pauseAction();
        return Promise.reject("shutdown");
    }

    if (!isPlaying) {
        cleanStatus();
        return Promise.reject("shutdown");
    }

    if (isPause) {
        return Promise.reject("shutdown");
    }

    currentPlayingCommandIndex++;

    if (commandElements[currentPlayingCommandIndex].getElementsByTagName("td")[0].classList.contains("stopping")) {
        commandElements[currentPlayingCommandIndex].getElementsByTagName("td")[0].classList.remove("stopping");
    }

    const testCommand = testCase.commands[currentPlayingCommandIndex];
    let commandName = testCommand.name;
    let commandTarget = testCommand.defaultTarget;
    let commandValue = testCommand.value;

    if (commandName === "") {
        return Promise.reject("no command name");
    }

    setColor(currentPlayingCommandIndex + 1, "executing");

    return delay($('#slider').slider("option", "value")).then(function() {
        if (!blockStack) {
            blockStack = [];
        }
        // get the last block
        let lastBlock;
        if (blockStack.length === 0) {
            lastBlock = undefined;
        } else {
            lastBlock = blockStack[blockStack.length - 1];
        }
        // check if this block is skipped
        let skipped = lastBlock &&
            (lastBlock.dummy ||
                (lastBlock.isLoadVars && lastBlock.done) ||
                (lastBlock.isIf && !lastBlock.condition) ||
                (lastBlock.isWhile && !lastBlock.condition));
        if (isExtCommand(commandName) && !skipped) {
            sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
            commandName = formalCommands[commandName.toLowerCase()];
            let upperCase = commandName.charAt(0).toUpperCase() + commandName.slice(1);
            commandTarget = convertVariableToString(commandTarget);
            return (extCommand["do" + upperCase](commandTarget, commandValue))
                .then(function() {
                    setColor(currentPlayingCommandIndex + 1, "success");
                }).then(executionLoop);
        } else {
            return doPreparation()
                .then(doPrePageWait)
                .then(doPageWait)
                .then(doAjaxWait)
                .then(doDomWait)
                .then(doCommand)
                .then(executionLoop)
        }
    });
}

function delay(t) {
    return new Promise(function(resolve) {
        setTimeout(resolve, t)
    });
}

function finalizePlayingProgress() {
    if (!isPause) {
        enableClick();
        extCommand.clear();
    }
    setTimeout(function() {
        isPlaying = false;
        switchPS();
    }, 500);
}

function playDisable(setting) {
    // KAT-BEGIN reset label and icon for record button on playing
    if (setting) {
        document.getElementById("record").childNodes[1].textContent = "Record";
        switchRecordButton(true);
    }
    // KAT-END
    document.getElementById("record").disabled = setting;
    document.getElementById("playback").disabled = setting;
    document.getElementById("playSuite").disabled = setting;
    document.getElementById("playSuites").disabled = setting;
    // KAT-BEGIN set disabled state for new and export button
    document.getElementById("export").disabled = setting;
    // KAT-END
}

function switchPS() {
    if ((isPlaying || isPause) || isPlayingSuite || isPlayingAll) {
        playDisable(true);
        document.getElementById("playback").style.display = "none";
        document.getElementById("stop").style.display = "";
    } else {
        playDisable(false);
        document.getElementById("playback").style.display = "";
        document.getElementById("stop").style.display = "none";

        $.ajax({
            url: testOpsUrls.getFirstProject,
            type: 'GET',
        }).then(projects => {
            if (projects.length === 1) {
                let project = projects[0];
                uploadTestReportsToTestOps(null, project.id, true);
            } else {
                sideex_log.appendA('Upload this execution to Katalon TestOps', 'ka-upload-log');
            }
        })
    }
}

function switchPR() {
    if (isPause) {
        document.getElementById("pause").style.display = "none";
        document.getElementById("resume").style.display = "";
    } else {
        document.getElementById("pause").style.display = "";
        document.getElementById("resume").style.display = "none";
    }
}

function catchPlayingError(reason) {
    console.log('Playing error', reason);
    // doCommands is depend on test website, so if make a new page,
    // doCommands function will fail, so keep retrying to get connection
    if (isReceivingEndError(reason)) {
        commandType = "preparation";
        setTimeout(function() {
            currentPlayingCommandIndex--;
            playAfterConnectionFailed();
        }, 100);
    } else if (reason === "shutdown") {} else {
        extCommand.clear();
        enableClick();
        sideex_log.error(reason);

        if (currentPlayingCommandIndex >= 0) {
            setColor(currentPlayingCommandIndex + 1, "fail");
        }
        setColor(currentTestCaseId, "fail");
        logEndTime();
        sideex_log.info("Test case failed");
        if (enableSelfHealing) {
            updateTestCaseStatusUI();
        }
        if (trackingPlay) {
            trackingTestCase('execute', null, false);
            trackingPlay = false;
        }
        if (!isPlayingSuite && !isPlayingAll) {
            trackingLocalPlayback("executeTestCase", false).then(function() {
                trackingLocalPlayback("selfHealing", isSelfHealingInvoke);
            });
        }

        /* Clear the flag, reset to recording phase */
        /* A small delay for preventing recording events triggered in playing phase*/

        setTimeout(function() {
            isPlaying = false;
            switchPS();
        }, 500);
    }
}

function doPreparation() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("waitPreparation", "", "")
        .then(function() {
            return true;
        })
}

function doPrePageWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("prePageWait", "", "")
        .then(function(response) {
            if (response && response.new_page) {
                return doPrePageWait();
            } else {
                return true;
            }
        })
}

function doPageWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("pageWait", "", "")
        .then(function(response) {
            if (pageTime && (Date.now() - pageTime) > 30000) {
                sideex_log.error("Page Wait timed out after 30000ms");
                pageCount = 0;
                pageTime = "";
                return true;
            } else if (response && response.page_done) {
                pageCount = 0;
                pageTime = "";
                return true;
            } else {
                pageCount++;
                if (pageCount === 1) {
                    pageTime = Date.now();
                    sideex_log.info("Wait for the new page to be fully loaded");
                }
                return doPageWait();
            }
        })
}

function doAjaxWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("ajaxWait", "", "")
        .then(function(response) {
            if (ajaxTime && (Date.now() - ajaxTime) > 30000) {
                sideex_log.error("Ajax Wait timed out after 30000ms");
                ajaxCount = 0;
                ajaxTime = "";
                return true;
            } else if (response && response.ajax_done) {
                ajaxCount = 0;
                ajaxTime = "";
                return true;
            } else {
                ajaxCount++;
                if (ajaxCount === 1) {
                    ajaxTime = Date.now();
                    sideex_log.info("Wait for all ajax requests to be done");
                }
                return doAjaxWait();
            }
        })
}

function doDomWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("domWait", "", "")
        .then(function(response) {
            if (domTime && (Date.now() - domTime) > 30000) {
                sideex_log.error("DOM Wait timed out after 30000ms");
                domCount = 0;
                domTime = "";
                return true;
            } else if (response && (Date.now() - response.dom_time) < 400) {
                domCount++;
                if (domCount === 1) {
                    domTime = Date.now();
                    sideex_log.info("Wait for the DOM tree modification");
                }
                return doDomWait();
            } else {
                domCount = 0;
                domTime = "";
                return true;
            }
        })
}

async function doCommand() {
    const selectedTestCase = getSelectedCase();
    const testCase = findTestCaseById(selectedTestCase.id);

    let commands = testCase.commands;
    const testCommand = commands[currentPlayingCommandIndex];
    let commandName = testCommand.name;
    let commandTarget = testCommand.defaultTarget;
    let commandValue = testCommand.value;

    possibleTargets = await getPossibleTargetList(testCommand);
    let result = await runCommand(commands, commandName, commandTarget, commandValue);
    let optionList = testCommand.targets;

    if (result &&
        optionList.includes(result.commandTarget) &&
        commandTarget !== result.commandTarget) {
        isSelfHealingInvoke = true;
        const selectedTestCase = getSelectedCase();
        const testCaseID = selectedTestCase.id;
        addBrokenLocator(testCaseID, commandTarget, result.commandTarget);
    }
}

async function runCommand(commands, commandName, commandTarget, commandValue) {
    let originalCommandTarget = commandTarget;
    if (commandName.indexOf("${") !== -1) {
        commandName = convertVariableToString(commandName);
    }
    let formalCommandName = formalCommands[commandName.trim().toLowerCase()];
    if (formalCommandName) {
        commandName = formalCommandName;
    }
    //check for user setting of self healing
    enableSelfHealing = await isSelfHealingEnable();

    if (implicitCount === 0) {
        logExecutingTestStep(commandName, commandTarget, commandValue);
    }

    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }

    let p = new Promise(function(resolve, reject) {
        let count = 0;
        let interval = setInterval(function() {
            if (!isPlaying) {
                currentPlayingCommandIndex--;
                reject("shutdown");
                clearInterval(interval);
            }
            let limit = 30000 / 10;
            if (count > limit) {
                sideex_log.error("Timed out after 30000ms");
                reject("Window not Found");
                clearInterval(interval);
            }
            if (!extCommand.getPageStatus()) {
                if (count === 0) {
                    sideex_log.info("Wait for the new page to be fully loaded");
                }
                count++;
            } else {
                resolve();
                clearInterval(interval);
            }
        }, 10);
    });
    return p.then(function() {
            if (commandName === 'break') {
                pauseAction();
                return Promise.reject("shutdown");
            }
            if (commandName === '#') {
                return {
                    result: 'success'
                };
            }
            if (expectingLabel !== null && commandName !== 'label') {
                return {
                    result: 'success'
                };
            }
            let originalCommandTarget = commandTarget;
            // in case blockStack is undefined
            if (!blockStack) {
                blockStack = [];
            }
            // get the last block
            let lastBlock;
            if (blockStack.length === 0) {
                lastBlock = undefined;
            } else {
                lastBlock = blockStack[blockStack.length - 1];
            }
            // check if this block is skipped
            let skipped = lastBlock &&
                (lastBlock.dummy ||
                    (lastBlock.isLoadVars && lastBlock.done) ||
                    (lastBlock.isIf && !lastBlock.condition) ||
                    (lastBlock.isWhile && !lastBlock.condition));
            // normal command: just skipped
            if (skipped && (['loadVars', 'endLoadVars', 'if', 'else', 'elseIf', 'endIf', 'while', 'endWhile'].indexOf(commandName) < 0)) {
                return {
                    result: 'success'
                };
            } else if (skipped && (['loadVars', 'if', 'while'].indexOf(commandName) >= 0)) {
                // open block commands: push dummy block
                blockStack.push({
                    dummy: true
                });
                return {
                    result: 'success'
                };
            } else if (skipped && (['endLoadVars', 'endIf', 'endWhile'].indexOf(commandName) >= 0)) {
                // remove dummy block on end
                if (lastBlock.dummy) {
                    blockStack.pop();
                    return {
                        result: 'success'
                    };
                }
            } else if (skipped && (['else', 'elseIf'].indexOf(commandName) >= 0)) {
                // intermediate statement: only ignore if inside skipped block
                if (lastBlock.dummy) {
                    return {
                        result: 'success'
                    };
                }
            }
            if (commandValue.indexOf("${") !== -1) {
                commandValue = convertVariableToString(commandValue);
            }
            if (commandTarget.indexOf("${") !== -1) {
                commandTarget = convertVariableToString(commandTarget);
            }
            if ((commandName === 'storeEval') || (commandName === 'storeEvalAndWait')) {
                commandTarget = expandForStoreEval(commandTarget);
            }
            if (commandName === 'if') {
                let condition = evalIfCondition(commandTarget);
                blockStack.push({
                    isIf: true,
                    condition: condition,
                    met: condition // if block has "true" condition
                });
                return {
                    result: 'success'
                };
            }
            if (commandName === 'else') {
                if (lastBlock.met) {
                    lastBlock.condition = false;
                } else {
                    lastBlock.condition = !lastBlock.condition;
                    lastBlock.met = lastBlock.condition;
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'elseIf') {
                if (lastBlock.met) {
                    lastBlock.condition = false;
                } else {
                    lastBlock.condition = evalIfCondition(commandTarget);
                    lastBlock.met = lastBlock.condition;
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'endIf') {
                // end block
                blockStack.pop();
                return {
                    result: 'success'
                };
            }
            if (commandName === 'while') {
                blockStack.push({
                    isWhile: true,
                    index: currentPlayingCommandIndex,
                    condition: evalIfCondition(commandTarget),
                    originalCommandTarget: originalCommandTarget
                });
                return {
                    result: 'success'
                };
            }
            if (commandName === 'endWhile') {
                let lastBlockCommandTarget = lastBlock.originalCommandTarget;
                if (lastBlockCommandTarget.indexOf("${") !== -1) {
                    lastBlockCommandTarget = convertVariableToString(lastBlockCommandTarget);
                }
                lastBlock.condition = evalIfCondition(lastBlockCommandTarget);
                if (lastBlock.condition) {
                    // back to while
                    currentPlayingCommandIndex = lastBlock.index;
                    return {
                        result: 'success'
                    };
                } else {
                    blockStack.pop();
                    return {
                        result: 'success'
                    };
                }
            }
            if (commandName === 'loadVars') {
                // parse once
                let parsedData = parseData(commandTarget);
                let data = parsedData.data;
                let block = {
                    isLoadVars: true,
                    index: currentPlayingCommandIndex,
                    currentLine: 0, // line of data
                    data: data,
                    type: parsedData.type,
                    done: data.length == 0 // done if empty file
                };
                blockStack.push(block);
                if (!block.done) { // if not done get next line
                    let line = block.data[block.currentLine];
                    $.each(line, function(key, value) {
                        declaredVars[key] = value;
                    });
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'endLoadVars') {
                // next data line
                lastBlock.currentLine++;
                lastBlock.done = lastBlock.currentLine >= lastBlock.data.length; // out of data
                if (lastBlock.done) {
                    blockStack.pop(); // quit block
                } else {
                    currentPlayingCommandIndex = lastBlock.index; // back to command after while
                    let line = lastBlock.data[lastBlock.currentLine] // next data
                    $.each(line, function(key, value) {
                        declaredVars[key] = value;
                    });
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'label') {
                let label = currentTestCaseId + '-' + commandTarget;
                labels[label] = currentPlayingCommandIndex;
                if (expectingLabel === label) {
                    expectingLabel = null;
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'gotoIf') {
                if (evalIfCondition(commandTarget)) {
                    let label = currentTestCaseId + '-' + commandValue;
                    let jumpTo = labels[label];
                    if (jumpTo === undefined) {
                        expectingLabel = label;
                    } else {
                        currentPlayingCommandIndex = jumpTo;
                    }
                    return {
                        result: 'success'
                    };
                } else {
                    return {
                        result: 'success'
                    };
                }
            }
            if (commandName === 'gotoLabel') {
                let label = currentTestCaseId + '-' + commandTarget;
                let jumpTo = labels[label];
                if (jumpTo === undefined) {
                    expectingLabel = label;
                } else {
                    currentPlayingCommandIndex = jumpTo;
                }
                return {
                    result: 'success'
                };
            }
            if (commandName === 'storeCsv') {
                let executionResult = executeStoreCSV(commandTarget, commandValue);
                if (executionResult.success === true) {
                    let logMessage = executionResult.successMessage;
                    sideex_log.info(logMessage);
                    return {
                        result: 'success'
                    }
                } else {
                    return {
                        result: executionResult.errorMessage
                    }
                }
            }
            if (commandName === 'writeToCSV') {
                let executionResult = executeWriteToCSV(commandTarget, commandValue);
                if (executionResult.success === true) {
                    return {
                        result: 'success'
                    }
                } else {
                    return {
                        result: executionResult.errorMessage
                    }
                }
            }
            if (commandName === 'appendToCSV') {
                let executionResult = executeAppendToCSV(commandTarget, commandValue);
                if (executionResult.success === true) {
                    return {
                        result: 'success'
                    }
                } else {
                    return {
                        result: executionResult.errorMessage
                    }
                }
            }

            if (isWindowMethodCommand(commandName)) {
                return extCommand.sendCommand(commandName, commandTarget, commandValue, true);
            }
            return extCommand.sendCommand(commandName, commandTarget, commandValue);
        })
        .then(async function(result) {
            if (result.result !== "success") {
                let originalCurrentPlayingCommandIndex = currentPlayingCommandIndex;
                // implicit
                if (result.result.match(/Element[\s\S]*?not found/) ||
                    result.result.includes("Unrecognised locator type") ||
                    result.result.includes("Invalid xpath")) {
                    let isCommandExcludedResult = await isCommandExcluded(commandName);
                    if (enableSelfHealing && !isCommandExcludedResult) {
                        if (implicitTime && (Date.now() - implicitTime > 1000)) {
                            implicitCount = 0;
                            implicitTime = "";
                            if (possibleTargets.length > 0) {
                                let nextTarget = possibleTargets.shift();
                                sideex_log.info(`Cannot find element ${commandTarget} after 1000ms switch to ${nextTarget}`);
                                return runCommand(commands, commandName, nextTarget, commandValue);
                            }
                            sideex_log.error("Cannot find element");
                        } else {
                            //rerun the test step
                            implicitCount++;
                            if (implicitCount === 1) {
                                sideex_log.info("Wait until the element is found");
                                implicitTime = Date.now();
                            }
                            return runCommand(commands, commandName, commandTarget, commandValue);
                        }
                    } else {
                        if (implicitTime && (Date.now() - implicitTime > 10000)) {
                            sideex_log.error("Implicit Wait timed out after 10000ms");
                            implicitCount = 0;
                            implicitTime = "";
                        } else {
                            implicitCount++;
                            if (implicitCount === 1) {
                                sideex_log.info("Wait until the element is found");
                                implicitTime = Date.now();
                            }
                            return doCommand();
                        }
                    }
                }

                implicitCount = 0;
                implicitTime = "";
                sideex_log.error(result.result);
                setColor(currentPlayingCommandIndex + 1, "fail");
                setColor(currentTestCaseId, "fail");
                // KAT-BEGIN
                // document.getElementById("result-failures").textContent = parseInt(document.getElementById("result-failures").textContent) + 1;
                // KAT-END
                if (commandName.includes("verify") && result.result.includes("did not match")) {
                    setColor(currentPlayingCommandIndex + 1, "fail");
                } else {
                    logEndTime();
                    sideex_log.info("Test case failed");
                    if (enableSelfHealing) {
                        updateTestCaseStatusUI();
                    }
                    if (trackingPlay) {
                        trackingTestCase('execute', null, false);
                        trackingPlay = false;
                    }
                    if (!isPlayingSuite && !isPlayingAll) {
                        trackingLocalPlayback("executeTestCase", false).then(function() {
                            trackingLocalPlayback("selfHealing", isSelfHealingInvoke);
                        });

                    }
                    currentPlayingCommandIndex = commands.length;
                }
                return browser.runtime.sendMessage({
                    captureEntirePageScreenshot: true,
                    captureWindowId: extCommand.getContentWindowId()
                }).then(function(captureResponse) {
                    const testCaseElement = document.getElementById(currentTestCaseId);
                    const testCaseID = testCaseElement.id;
                    const testCase = findTestCaseById(testCaseID);
                    addToScreenshot(captureResponse.image, 'fail-' + testCase.name + '-' + originalCurrentPlayingCommandIndex);
                }).catch(function(e) {
                    console.log(e);
                });
            } else {
                setColor(currentPlayingCommandIndex + 1, "success");
                if (result.capturedScreenshot) {
                    addToScreenshot(result.capturedScreenshot, result.capturedScreenshotTitle);
                }
            }
            return {
                "commandName": commandName,
                "commandValue": commandValue,
                "commandTarget": originalCommandTarget,
            };
        });

}

function isReceivingEndError(reason) {
    return reason === "TypeError: response is undefined" ||
        reason === "Error: Could not establish connection. Receiving end does not exist." ||
        // Below message is for Google Chrome
        reason.message === "Could not establish connection. Receiving end does not exist." ||
        // Google Chrome misspells "response"
        reason.message === "The message port closed before a reponse was received." ||
        reason.message === "The message port closed before a response was received.";

}

function isWindowMethodCommand(command) {
    return command === "answerOnNextPrompt" ||
        command === "chooseCancelOnNextPrompt" ||
        command === "assertPrompt" ||
        command === "chooseOkOnNextConfirmation" ||
        command === "chooseCancelOnNextConfirmation" ||
        command === "assertConfirmation" ||
        command === "assertAlert" ||
        command === "verifyAlert";

}

function isExtCommand(command) {
    switch (command) {
        case "pause":
            //case "open":
        case "selectFrame":
        case "selectWindow":
        case "close":
            return true;
        default:
            return false;
    }
}

function convertVariableToString(variable, log = true) {
    let originalVariable = variable;
    let frontIndex = variable.indexOf("${");
    let newStr = "";
    while (frontIndex !== -1) {
        let prefix = variable.substring(0, frontIndex);
        let suffix = variable.substring(frontIndex);
        let tailIndex = suffix.indexOf("}");
        if (tailIndex >= 0) {
            let suffix_front = suffix.substring(0, tailIndex + 1);
            let suffix_tail = suffix.substring(tailIndex + 1);
            newStr += prefix + xlateArgument(suffix_front);
            variable = suffix_tail;
            frontIndex = variable.indexOf("${");
        } else {
            // e.g. ${document https://forum.katalon.com/discussion/6083
            frontIndex = -1;
        }
    }
    let expanded = newStr + variable;
    if (log) {
        sideex_log.info("Expand variable '" + originalVariable + "' into '" + expanded + "'");
    }
    return expanded;
}

export {
    playTestAllTestSuitesAction,
    playTestSuiteAction,
    playTestCaseAction,
    executeCommandAction,
    stopAction,
    resumeAction,
    pauseAction,
    executeCommand,
    initAllSuite
}