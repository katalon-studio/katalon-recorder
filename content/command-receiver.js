/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

var selenium = new Selenium(BrowserBot.createForWindow(window));

// Declare global namespace before Locatorbuilders is instantanialized
window.neighborXpathsGenerator = window.neighborXpathsGenerator || {};

var locatorBuilders = new LocatorBuilders(window);
var commandFactory;

// load extension scripts
var extensionsLoaded = false;

if (!extensionsLoaded) {
	extensionsLoaded = true;
	chrome.storage.local.get('extensions', function(result) {

		extensions = result.extensions;
		if (extensions) {
			var extensionScripts = Object.values(extensions);
			for (var i = 0; i < extensionScripts.length; i++) {
				var extensionScript = extensionScripts[i];
				var f = new Function(extensionScript.content);
				f();
			}
        }

        // KAT-BEGIN register Selenium IDE commands
        commandFactory = new CommandHandlerFactory();
        commandFactory.registerAll(selenium);
        // KAT-END
	});
}

function doCommands(request, sender, sendResponse, type) {
    if (request.commands) {
        //console.log("indoCommands: " + request.commands);
        if (request.commands == "waitPreparation") {
            selenium["doWaitPreparation"]("", selenium.preprocessParameter(""));
            sendResponse({});
        } else if (request.commands == "prePageWait") {
            selenium["doPrePageWait"]("", selenium.preprocessParameter(""));
            sendResponse({ new_page: window.sideex_new_page });
        } else if (request.commands == "pageWait") {
            selenium["doPageWait"]("", selenium.preprocessParameter(""));
            sendResponse({ page_done: window.sideex_page_done });
        } else if (request.commands == "ajaxWait") {
            selenium["doAjaxWait"]("", selenium.preprocessParameter(""));
            sendResponse({ ajax_done: window.sideex_ajax_done });
        } else if (request.commands == "domWait") {
            selenium["doDomWait"]("", selenium.preprocessParameter(""));
            sendResponse({ dom_time: window.sideex_new_page });
        } else if (request.commands === 'captureEntirePageScreenshot' || request.commands === 'captureEntirePageScreenshotAndWait') {
            browser.runtime.sendMessage({
                captureEntirePageScreenshot: true
            }).then(function(captureResponse) {
                sendResponse({
                    result: 'success',
                    capturedScreenshot: captureResponse.image,
                    capturedScreenshotTitle: request.target
                });
            });
        } else {
            var upperCase = request.commands.charAt(0).toUpperCase() + request.commands.slice(1);
            if (selenium["do" + upperCase] != null) {
                try {
                    document.body.setAttribute("SideeXPlayingFlag", true);
                    let returnValue = selenium["do"+upperCase](request.target,selenium.preprocessParameter(request.value));
                    if (returnValue instanceof Promise) {
                        // The command is a asynchronous function
                        returnValue.then(function(value) {
                            // Asynchronous command completed successfully
                            document.body.removeAttribute("SideeXPlayingFlag");
                            if (value && value.capturedScreenshot) {
                                sendResponse(value);
                            } else {
                                sendResponse({result: "success"});
                            }
                        }).catch(function(reason) {
                            // Asynchronous command failed
                            document.body.removeAttribute("SideeXPlayingFlag");
                            sendResponse({result: reason});
                        });
                    } else {
                        // Synchronous command completed successfully
                        document.body.removeAttribute("SideeXPlayingFlag");
                        sendResponse({result: "success"});
                    }
                } catch(e) {
                    // Synchronous command failed
                    document.body.removeAttribute("SideeXPlayingFlag");
                    sendResponse({result: e.message});
                }
            } else {
                // KAT-BEGIN handle Selenium IDE commands
                try {
                    var command = request;
                    if (!command.command) {
                        command.command = command.commands;
                    }
                    var handler = commandFactory.getCommandHandler(command.command);
                    if (handler == null) {
                        sendResponse({ result: "Unknown command: " + request.commands });
                    }
                    command.target = selenium.preprocessParameter(command.target);
                    command.value = selenium.preprocessParameter(command.value);
                    var result = handler.execute(selenium, command);
                    var waitForCondition = result.terminationCondition;

                    continueTestWhenConditionIsTrue(waitForCondition, sendResponse, result);
                } catch(e) {
                    console.error(e);
                    // Synchronous command failed
                    document.body.removeAttribute("SideeXPlayingFlag");
                    sendResponse({result: e.message});
                }
                // KAT-END
            }
        }

        return true;
    }
    // TODO: refactoring
    if (request.selectMode) {
        if (request.selecting) {
            targetSelecter = new TargetSelecter(function (element, win) {
                if (element && win) {
                    //var locatorBuilders = new LocatorBuilders(win);
                    var target = locatorBuilders.buildAll(element);
                    locatorBuilders.detach();
                    if (target != null && target instanceof Array) {
                        if (target) {
                            //self.editor.treeView.updateCurrentCommand('targetCandidates', target);
                            browser.runtime.sendMessage({
                                selectTarget: true,
                                target: target
                            })
                        } else {
                            //alert("LOCATOR_DETECTION_FAILED");
                        }
                    }

                }
                targetSelecter = null;
            }, function () {
                browser.runtime.sendMessage({
                    cancelSelectTarget: true
                })
            });

        } else {
            if (targetSelecter) {
                targetSelecter.cleanup();
                targetSelecter = null;
                return;
            }
        }
    }
    // TODO: code refactoring
    if (request.attachRecorder) {
        browser.runtime.sendMessage({
            attachHttpRecorder: true
        });
        recorder.attach();
        return;
    } else if (request.detachRecorder) {
        browser.runtime.sendMessage({
            detachHttpRecorder: true
        });
        recorder.detach();
        return;
    }
}

// KAT-BEGIN handle Selenium IDE wait commands
function continueTestWhenConditionIsTrue(waitForCondition, sendResponse, result) {
    try {
        if (waitForCondition == null) {
            // Synchronous command completed successfully
            document.body.removeAttribute("SideeXPlayingFlag");
            if (result && result.failed) {
                sendResponse({result: 'did not match'});
            } else {
                sendResponse({result: "success"});
            }
        } else if (waitForCondition()) {
            // Synchronous command completed successfully
            document.body.removeAttribute("SideeXPlayingFlag");
            if (result && result.failed) {
                sendResponse({result: 'Failure message: ' + result.failureMessage});
            } else {
                sendResponse({result: "success"});
            }
        } else {
            //LOG.debug("waitForCondition was false; keep waiting!");
            setTimeout(function() {
                continueTestWhenConditionIsTrue(waitForCondition, sendResponse, result);
            }, 10);
        }
    } catch(e) {
        console.error(e);
        // Synchronous command failed
        document.body.removeAttribute("SideeXPlayingFlag");
        sendResponse({result: e.message});
    }
}
// KAT-END

function doClick2(element) {
    console.error("element:" + element);
}

browser.runtime.onMessage.addListener(doCommands);
