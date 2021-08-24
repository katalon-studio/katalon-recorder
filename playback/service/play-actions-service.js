import { isCommandExcluded, isSelfHealingEnable } from "../../panel/js/UI/services/self-healing-service/utils.js";
import { logger } from "./log-service.js";
import {
    getCommandName,
    getCommandTarget,
    getCommandValue,
    getPossibleTargetList,
    getRecordsArray,
    isExtCommand,
    isWindowMethodCommand
} from "./util.js";
import { convertVariableToString, evalIfCondition, expandForStoreEval } from "./variable-sevice.js";
import { ExtCommand } from "../../panel/js/background/window-controller.js";

import { trackingExecuteTestSuite } from "../../panel/js/UI/services/tracking-service/segment-tracking-service.js"

let testSuiteData = [];
let selectedCaseIndex = 0;
let socketLog;
let testSuiteName = "";
const setTestSuiteData = (data) => {
    testSuiteName = data["testSuiteName"];
    testSuiteData = data["testCases"];
}

let dataService = null;
const setDataService = (service) => {
    dataService = service;
}


let extCommand = new ExtCommand();
let blockStack = [];
let labels = {};
let expectingLabel = null;
let declaredVars = {};

let currentPlayingCommandIndex = -1;
let currentPlayingFromHereCommandIndex = 0;
let currentTestCaseId = "";
let isPause = false;
let isPlayingSuite = false;
let isPlaying = false;

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

//self-healing variable
let enableSelfHealing;
let possibleTargets = [];
let successedTestCases = 0;
let failedTestCases = 0;


function initBeforePlay() {
    recorder.detach();
    // KAT-BEGIN focus on window
    /*if (contentWindowId) {
      browser.windows.update(contentWindowId, { focused: true });
    }*/
    declaredVars = {};
}


const playSuiteAction = (socket) => {
    socketLog = socket;
    initBeforePlay();
    playSuite(0);
    isPlaying = true;
}

function playSuite(i) {
    isPlayingSuite = true;
    let length = testSuiteData.length;
    if (i < length) {
        selectedCaseIndex = i;
        logger.info("Playing test case: " + testSuiteData[selectedCaseIndex]["testCaseName"]);
        socketLog.emit('logger', {
            mess: "Playing test case: " + testSuiteData[selectedCaseIndex]["testCaseName"],
            type: 'verbose'
        });
        //logStartTime();
        logger.logTime();
        play();
        nextCase(i);
    } else {
        trackingExecuteTestSuite(testSuiteData["testSuiteName"], successedTestCases, failedTestCases, false, true)
        socketLog.emit('doneSuite', {
            mess: "Finnish executing",
            type: "info"
        });
        isPlayingSuite = false;
    }
}

function play() {
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
    isPlaying = true;

    commandType = "preparation";
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";

    caseFailed = false;

    //currentTestCaseId = getSelectedCase().id;

    return Promise.resolve(true);
}

function nextCase(i) {
    if (isPlaying || isPause) setTimeout(function() {
        nextCase(i);
    }, 500);
    else if (isPlayingSuite) playSuite(i + 1);
}

function initializePlayingProgress() {
    blockStack = [];
    isPlaying = true;

    currentPlayingCommandIndex = currentPlayingFromHereCommandIndex - 1;
    currentPlayingFromHereCommandIndex = 0;

    // xian wait
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";
    caseFailed = false;

    currentTestCaseId = selectedCaseIndex
    return extCommand.init();
}

function executionLoop() {
    let commands = getRecordsArray(testSuiteData[selectedCaseIndex]["testCaseHTML"]);
    if (currentPlayingCommandIndex + 1 >= commands.length) {
        if (!caseFailed) {
            //logEndTime();
            logger.logTime();
            logger.info("Test case passed");
            socketLog.emit('logger', {
                mess: 'Test case passed',
                type: 'debug'
            });
            socketLog.emit('result', {
                testcase: testSuiteData[selectedCaseIndex]["testCaseName"],
                result: 'passed'
            });
            successedTestCases++;
        } else {
            caseFailed = false;
        }
        return true;
    }


    if (!isPlaying) {
        return Promise.reject("shutdown");
    }

    if (isPause) {
        return Promise.reject("shutdown");
    }

    currentPlayingCommandIndex++;

    let commandName = getCommandName(commands[currentPlayingCommandIndex]);
    let commandTarget = getCommandTarget(commands[currentPlayingCommandIndex]);
    let commandValue = getCommandValue(commands[currentPlayingCommandIndex]);

    if (commandName === "") {
        return Promise.reject("no command name");
    }

    if (isExtCommand(commandName)) {
        logger.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
        socketLog.emit('logger', {
            mess: "Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |",
            type: 'info'
        });
        //commandName = formalCommands[commandName.toLowerCase()];
        let upperCase = commandName.charAt(0).toUpperCase() + commandName.slice(1);
        commandTarget = convertVariableToString(commandTarget, declaredVars);
        return (extCommand["do" + upperCase](commandTarget, commandValue))
            .then(executionLoop);
    } else {
        return doPreparation()
            .then(doPrePageWait)
            .then(doPageWait)
            .then(doAjaxWait)
            .then(doDomWait)
            .then(doCommand)
            .then(executionLoop)
    }
}

function finalizePlayingProgress() {
    if (!isPause) {
        extCommand.clear();
    }
    //console.log("success");
    setTimeout(function() {
        isPlaying = false;
    }, 500);
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
    } else if (reason === "shutdown") {
        return;
    } else {
        extCommand.clear();
        logger.error(reason);
        socketLog.emit('logger', {
            mess: reason,
            type: 'error'
        });
        //logEndTime();
        logger.logTime();
        logger.info("Test case failed");
        socketLog.emit('logger', {
            mess: 'Test case failed',
            type: 'debug'
        });
        socketLog.emit('result', {
            testcase: testSuiteData[selectedCaseIndex]["testCaseName"],
            result: 'failed'
        });
        failedTestCases++;
        /* Clear the flag, reset to recording phase */
        /* A small delay for preventing recording events triggered in playing phase*/
        setTimeout(function() {
            isPlaying = false;
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
                logger.error("Page Wait timed out after 30000ms");
                socketLog.emit('logger', {
                    mess: 'Page Wait timed out after 30000ms',
                    type: 'error'
                });
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
                    logger.info("Wait for the new page to be fully loaded");
                    socketLog.emit('logger', {
                        mess: 'Wait for the new page to be fully loaded',
                        type: 'info'
                    });
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
                logger.error("Ajax Wait timed out after 30000ms");
                socketLog.emit('logger', {
                    mess: 'Ajax Wait timed out after 30000ms',
                    type: 'error'
                });
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
                    logger.info("Wait for all ajax requests to be done");
                    socketLog.emit('logger', {
                        mess: 'Wait for all ajax requests to be done',
                        type: 'info'
                    });
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
                logger.error("DOM Wait timed out after 30000ms");
                socketLog.emit('logger', {
                    mess: 'DOM Wait timed out after 30000ms',
                    type: 'error'
                });
                domCount = 0;
                domTime = "";
                return true;
            } else if (response && (Date.now() - response.dom_time) < 400) {
                domCount++;
                if (domCount === 1) {
                    domTime = Date.now();
                    logger.info("Wait for the DOM tree modification");
                    socketLog.emit('logger', {
                        mess: 'Wait for the DOM tree modification',
                        type: 'info'
                    });
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
    let commands = getRecordsArray(testSuiteData[selectedCaseIndex]["testCaseHTML"]);
    let commandName = getCommandName(commands[currentPlayingCommandIndex]);
    let commandTarget = getCommandTarget(commands[currentPlayingCommandIndex]);
    let commandValue = getCommandValue(commands[currentPlayingCommandIndex]);
    possibleTargets = await getPossibleTargetList(commands[currentPlayingCommandIndex]);

    let result = await runCommand(commands, commandName, commandTarget, commandValue);
}

async function runCommand(commands, commandName, commandTarget, commandValue) {

    if (commandName.indexOf("${") !== -1) {
        let originalVariable = commandName;
        commandName = convertVariableToString(commandName, declaredVars);
        logger.info("Expand variable '" + originalVariable + "' into '" + commandName + "'");
        socketLog.emit('logger', {
            mess: "Expand variable '" + originalVariable + "' into '" + commandName + "'",
            type: 'info'
        });

    }
    /*let formalCommandName = formalCommands[commandName.trim().toLowerCase()];
    if (formalCommandName) {
      commandName = formalCommandName;
    }*/
    //check for user setting of self healing
    enableSelfHealing = await isSelfHealingEnable();

    if (implicitCount === 0) {
        if (commandTarget.includes("d-XPath")) {
            logger.info("Executing: | " + commandName + " | " + getCommandTarget(commands[currentPlayingCommandIndex], true) + " | " + commandValue + " |");
            socketLog.emit('logger', {
                mess: "Executing: | " + commandName + " | " + getCommandTarget(commands[currentPlayingCommandIndex], true) + " | " + commandValue + " |",
                type: 'infor'
            });
        } else {
            if (commandName !== '#') {
                logger.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
                socketLog.emit('logger', {
                    mess: "Executing: | " + commandName + " | " + getCommandTarget(commands[currentPlayingCommandIndex], true) + " | " + commandValue + " |",
                    type: 'infor'
                });
            }
        }
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
            var limit = 30000 / 10;
            if (count > limit) {
                logger.error("Timed out after 30000ms");
                socketLog.emit('logger', {
                    mess: 'Timed out after 30000ms',
                    type: 'error'
                });
                reject("Window not Found");
                clearInterval(interval);
            }
            if (!extCommand.getPageStatus()) {
                if (count === 0) {
                    logger.info("Wait for the new page to be fully loaded");
                    socketLog.emit('logger', {
                        mess: 'Wait for the new page to be fully loaded',
                        type: 'info'
                    });
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
                pause();
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
                let originalVariable = commandValue;
                commandValue = convertVariableToString(commandValue, declaredVars);
                logger.info("Expand variable '" + originalVariable + "' into '" + commandValue + "'");
                socketLog.emit('logger', {
                    mess: "Expand variable '" + originalVariable + "' into '" + commandValue + "'",
                    type: 'info'
                });
            }
            if (commandTarget.indexOf("${") !== -1) {
                let originalVariable = commandTarget;
                commandTarget = convertVariableToString(commandTarget, declaredVars);
                logger.info("Expand variable '" + originalVariable + "' into '" + commandTarget + "'");
                socketLog.emit('logger', {
                    mess: "Expand variable '" + originalVariable + "' into '" + commandTarget + "'",
                    type: 'info'
                });
            }
            if ((commandName === 'storeEval') || (commandName === 'storeEvalAndWait')) {
                commandTarget = expandForStoreEval(commandTarget, declaredVars);
            }
            if (commandName === 'if') {
                let condition = evalIfCondition(commandTarget, declaredVars);
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
                    lastBlock.condition = evalIfCondition(commandTarget, declaredVars);
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
                    condition: evalIfCondition(commandTarget, declaredVars),
                    originalCommandTarget: originalCommandTarget
                });
                return {
                    result: 'success'
                };
            }
            if (commandName === 'endWhile') {
                let lastBlockCommandTarget = lastBlock.originalCommandTarget;
                if (lastBlockCommandTarget.indexOf("${") !== -1) {
                    let originalVariable = lastBlockCommandTarget;
                    lastBlockCommandTarget = convertVariableToString(lastBlockCommandTarget, declaredVars);
                    logger.info("Expand variable '" + originalVariable + "' into '" + lastBlockCommandTarget + "'");
                    socketLog.emit('logger', {
                        mess: "Expand variable '" + originalVariable + "' into '" + lastBlockCommandTarget + "'",
                        type: 'info'
                    });
                }
                lastBlock.condition = evalIfCondition(lastBlockCommandTarget, declaredVars);
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
                let parsedData = dataService.parseData(commandTarget);

                let data = parsedData.data;
                let block = {
                    isLoadVars: true,
                    index: currentPlayingCommandIndex,
                    currentLine: 0, // line of data
                    data: data,
                    type: parsedData.type,
                    done: data.length === 0 // done if empty file
                };
                blockStack.push(block);
                if (!block.done) { // if not done get next line
                    let line = block.data[block.currentLine];
                    Object.entries(line).forEach(entry => {
                        let key = entry[0];
                        let value = entry[1];
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
                    var line = lastBlock.data[lastBlock.currentLine] // next data
                    Object.entries(line).forEach(entry => {
                        let key = entry[0];
                        let value = entry[1];
                        declaredVars[key] = value;
                    })
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
                if (evalIfCondition(commandTarget, declaredVars)) {
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
                let tokens = commandTarget.split(',');
                let csvValue = dataService.parseData(tokens[0]).data[parseInt(tokens[1])][tokens[2]];
                logger.info("Store '" + csvValue + "' into '" + commandValue + "'");
                socketLog.emit('logger', {
                    mess: "Store '" + csvValue + "' into '" + commandValue + "'",
                    type: 'info'
                });
                declaredVars[commandValue] = csvValue;
                return {
                    result: 'success'
                };
            }


            if (isWindowMethodCommand(commandName)) {
                return extCommand.sendCommand(commandName, commandTarget, commandValue, true);
            }
            return extCommand.sendCommand(commandName, commandTarget, commandValue);
        })
        .then(async function(result) {
            if (result.result !== "success") {
                let originalCurrentPlayingCommandIndex = currentPlayingCommandIndex;
                if (result.result.match(/Element[\s\S]*?not found/) ||
                    result.result.includes("Unrecognised locator type") ||
                    result.result.includes("Invalid xpath")) {
                    let commandExcluded = await isCommandExcluded(commandName);
                    if (enableSelfHealing && !commandExcluded) {
                        if (implicitTime && (Date.now() - implicitTime > 1000)) {
                            implicitCount = 0;
                            implicitTime = "";
                            if (possibleTargets.length > 0) {
                                let nextTarget = possibleTargets.shift();
                                logger.info(`Cannot find element ${commandTarget} after 1000ms switch to ${nextTarget}`);
                                socketLog.emit('logger', {
                                    mess: `Cannot find element ${commandTarget} after 1000ms switch to ${nextTarget}`,
                                    type: 'info'
                                });
                                return runCommand(commands, commandName, nextTarget, commandValue);
                            }
                            logger.error("Cannot find element");
                            socketLog.emit('logger', {
                                mess: `Cannot find element`,
                                type: 'error'
                            });
                        } else {
                            //rerun the test step
                            implicitCount++;
                            if (implicitCount === 1) {
                                logger.info("Wait until the element is found");
                                socketLog.emit('logger', {
                                    mess: `Wait until the element is found`,
                                    type: 'info'
                                });
                                implicitTime = Date.now();
                            }
                            return runCommand(commands, commandName, commandTarget, commandValue);
                        }
                    } else {
                        if (implicitTime && (Date.now() - implicitTime > 10000)) {
                            logger.error("Implicit Wait timed out after 10000ms");
                            socketLog.emit('logger', {
                                mess: `Implicit Wait timed out after 10000ms`,
                                type: 'error'
                            });
                            implicitCount = 0;
                            implicitTime = "";
                        } else {
                            implicitCount++;
                            if (implicitCount === 1) {
                                logger.info("Wait until the element is found");
                                socketLog.emit('logger', {
                                    mess: `Implicit Wait timed out after 10000ms`,
                                    type: 'error'
                                });
                                implicitTime = Date.now();
                            }
                            return doCommand();
                        }
                    }
                }

                implicitCount = 0;
                implicitTime = "";
                logger.error(result.result);
                socketLog.emit('logger', {
                    mess: result.result,
                    type: 'error'
                });


                if (commandName.includes("verify") && result.result.includes("did not match")) {

                } else {
                    //logEndTime();
                    logger.logTime();
                    logger.info("Test case failed");
                    socketLog.emit('logger', {
                        mess: `Test case failed`,
                        type: 'debug'
                    });
                    socketLog.emit('result', {
                        testcase: testSuiteData[selectedCaseIndex]["testCaseName"],
                        result: 'failed'
                    });
                    failedTestCases++;
                    caseFailed = true;
                    currentPlayingCommandIndex = commands.length;
                }
                return browser.runtime.sendMessage({
                    captureEntirePageScreenshot: true,
                    captureWindowId: extCommand.getContentWindowId()
                }).then(function(captureResponse) {
                }).catch(function(e) {
                    console.log(e);
                });
            } else {}
            return {
                commandName,
                commandTarget,
                commandValue
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
browser.runtime.onMessage.addListener(handleFormatCommand);

function handleFormatCommand(message, sender, response) {
    if (message.storeVar !== undefined) {
        logger.info("Store '" + message.storeStr + "' into '" + message.storeVar + "'");
        socketLog.emit('logger', {
            mess: "Store '" + message.storeStr + "' into '" + message.storeVar + "'",
            type: 'info'
        });
        declaredVars[message.storeVar] = message.storeStr;
    } else {
        if (message.echoStr) {
            logger.info("echo: " + message.echoStr);
            socketLog.emit('logger', {
                mess: "echo: " + message.echoStr,
                type: 'info'
            });
        }
    }
}

export {
    setTestSuiteData,
    playSuiteAction,
    setDataService
}