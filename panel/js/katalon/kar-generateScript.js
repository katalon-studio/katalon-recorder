
var newFormatters = {};

function handleGenerateToScript() {
    var selectedTestCase = getSelectedCase();
    if (selectedTestCase) {
        loadScripts();
    } else {
        alert('Please select a testcase');
    }
}

function getCommandsToGenerateScripts() {
    var ret = [];
    let commands = getRecordsArray();
    for (var index=0; index<commands.length; index++) {
        let commandName = getCommandName(commands[index]);
        let commandTarget = getCommandTarget(commands[index]);
        let commandValue = getCommandValue(commands[index]);

        ret.push(new Command(commandName, commandTarget, commandValue));
    }
    return ret;
}

function loadScripts() {
    var language = $("#select-script-language-id").val();
    var scriptNames = [];
    var isExternalCapability = false;
    var newFormatter = null;
    switch (language) {
        case 'cs-wd-nunit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/csharp/cs-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/csharp/cs-wd.js"
            ];
            break;
        case 'cs-wd-mstest':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/csharp/cs-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/csharp/cs-wd.js",
                "js/katalon/selenium-ide/format/csharp/cs-mstest-wd.js"
            ];
            break;
        case 'katalon':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                "js/katalon/selenium-ide/format/java/java-backed-junit4.js",
                "js/katalon/selenium-ide/format/katalon/katalon.js"
            ];
            break;
        case 'java-wd-testng':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/java/webdriver-testng.js"
            ];
            break;
        case 'java-wd-junit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/java/webdriver-junit4.js"
            ];
            break;
        case 'java-rc-junit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                "js/katalon/selenium-ide/format/java/java-backed-junit4.js"
            ];
            break;
        case 'python-appdynamics':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/python/python2-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/python/python-appdynamics.js"
            ];
            break;
        case 'python2-wd-unittest':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/python/python2-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/python/python2-wd.js"
            ];
            break;
        case 'robot':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/format/robot/robot.js'
            ];
            break;
        case 'ruby-wd-rspec':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/ruby/ruby-rc.js",
                "js/katalon/selenium-ide/format/ruby/ruby-rc-rspec.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/ruby/ruby-wd-rspec.js"
            ];
            break;
        case 'xml':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/format/xml/XML-formatter.js'
            ];
            break;
        default:
            if (language.indexOf('new-formatter') >= 0) {
                var newFormatterId = language.replace('new-formatter-', '');
                newFormatter = newFormatters[newFormatterId];
            } else {
                isExternalCapability = true;
            }
    }

    if (isExternalCapability) {
        generateScripts(isExternalCapability, language);
    } else if (newFormatter) {
        generateScripts(isExternalCapability, language, newFormatter);
    } else {
        $("[id^=formatter-script-language-id-]").remove();
        var j = 0;
        for (var i = 0; i < scriptNames.length; i++) {
            var script = document.createElement('script');
            script.id = "formatter-script-language-id-" + language + '-' + i;
            script.src = scriptNames[i];
            script.async = false; // This is required for synchronous execution
            script.onload = function() {
                j++;
            }
            document.head.appendChild(script);
        }
        var interval = setInterval(
            function() {
                if (j == scriptNames.length) {
                    clearInterval(interval);
                    generateScripts(isExternalCapability, language);
                }
            },
            100
        );
    }
}

function getTestCaseName() {
    var selectedTestCase = getSelectedCase();
    return sideex_testCase[selectedTestCase.id].title;
}

function generateScripts(isExternalCapability, language, newFormatter) {

    let commands = getCommandsToGenerateScripts();
    var name = getTestCaseName();

    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    if (cm) {
        cm.toTextArea();
    }
    $textarea.data('cm', null);
    $("#generateToScriptsDialog").dialog("open");

    if (isExternalCapability) {
        var option = $('#' + language);
        var extensionId = option.data('extensionId');
        var capabilityId = option.data('capabilityId');
        window.options = {
            defaultExtension: 'txt',
            mimetype: 'text/plain'
        };
        browser.runtime.sendMessage(
            extensionId,
            {
                type: 'katalon_recorder_export',
                payload: {
                    capabilityId: capabilityId,
                    name: name,
                    commands: commands
                }
            }
        ).then(function(response) {
            var payload = response.payload;
            if (response.status) {
                options = {
                    defaultExtension: payload.extension,
                    mimetype: payload.mimetype
                };
                displayOnCodeMirror(language, payload.content);
            } else {
                throw(payload);
            }
        }).catch(function(err) {
            var content = 'Could not export.';
            if (err) {
                content += ' Error: ' + JSON.stringify(err) + '.';
            }
            displayOnCodeMirror(language, content);
        });
    } else if (newFormatter) {
        var payload = newFormatter(name, commands);
        options = {
            defaultExtension: payload.extension,
            mimetype: payload.mimetype
        };
        displayOnCodeMirror(language, payload.content);
    } else {

        var testCase = new TestCase(name);
        testCase.commands = commands;
        testCase.formatLocal(name).header = "";
        testCase.formatLocal(name).footer = "";

        displayOnCodeMirror(language, format(testCase, name));

        $("[id^=formatter-script-language-id-]").remove();
        var script = document.createElement('script');
        script.id = "formatter-script-language-id-" + language;
        script.src = 'js/background/formatCommand.js';
        script.async = false; // This is required for synchronous execution
        document.head.appendChild(script);
    }
}
// KAT-END

// save last selected language
function saveSetting() {
    try {
        var data = {
            language: $("#select-script-language-id").val()
        };
        browser.storage.local.set(data);
    } catch (e) {
        console.log(e);
    }
}

function copyToClipboard() {
    $("#txt-script-id").show();
    $("#txt-script-id").select();
    document.execCommand("copy");
    $("#txt-script-id").hide();
}

function saveToFile() {
    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    var format = '.' + window.options.defaultExtension;
    var fileName = testClassName(getTestCaseName()) + format;
    var content = cm.getValue();
    saveAsFileOfTestCase(fileName, content);
}

// export test case as script
function saveAsFileOfTestCase(fileName, content) {
    var link = makeTextFile(content);
    var downloading = browser.downloads.download({
        filename: fileName,
        url: link,
        saveAs: true,
        conflictAction: 'overwrite'
    });
    var result = function(id) {
        browser.downloads.onChanged.addListener(function downloadCompleted(downloadDelta) {
            if (downloadDelta.id == id && downloadDelta.state &&
                downloadDelta.state.current == "complete") {
                $( "#generateToScriptsDialog" ).dialog("close");
            } else if (downloadDelta.id == id && downloadDelta.error) {
                browser.downloads.onChanged.removeListener(downloadCompleted);
            }
        })
    };
    var onError = function(error) {
        console.log(error);
    };
    downloading.then(result, onError);
}

function displayOnCodeMirror(language, outputScript) {
    var $textarea = $("#txt-script-id");
    $textarea.val(outputScript);
    var textarea = $textarea.get(0);

    var language = $("#select-script-language-id").val();
    var mode = window.options && window.options.mimetype;
    if (!mode) {
        switch (language) {
            case 'cs-wd-nunit':
            case 'cs-wd-mstest':
                mode = 'text/x-csharp';
                break;
            case 'katalon':
                mode = 'text/x-groovy';
                break;
            case 'java-wd-testng':
            case 'java-wd-junit':
            case 'java-rc-junit':
                mode = 'text/x-java';
                break;
            case 'python-appdynamics':
            case 'python2-wd-unittest':
                mode = 'text/x-python';
                break;
            case 'robot':
                break;
            case 'ruby-wd-rspec':
                mode = 'text/x-ruby';
                break;
            case 'xml':
                mode = 'application/xml';
                break;
            default:
                mode = 'text/plain';
        }
    }
    var codeMirrorOptions = {
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        lineWrapping: true
    };
    if (mode) {
        codeMirrorOptions.mode = mode;
    }
    var cm = CodeMirror.fromTextArea(textarea, codeMirrorOptions);

    $('.kat').show();
    $('.CodeMirror').removeClass('kat-90').addClass('kat-75');

    $textarea.data('cm', cm);

    try {
        _gaq.push(['_trackEvent', 'generate-code', language]);
    } catch (e) {

    }
}

$(function() {
    $("#export").click(function() {

        browser.runtime.sendMessage({
            getExternalCapabilities: true
        }).then(function(externalCapabilities) {
            var selectInput = $('#select-script-language-id');
            var language = selectInput.val();
            selectInput.find('option.external-exporter').remove();
            Object.keys(externalCapabilities).forEach(function(capabilityGlobalId) {
                var capability = externalCapabilities[capabilityGlobalId];
                if (capability.type == 'export') {
                    var optionId = 'external-exporter-' + capabilityGlobalId;
                    var summary = capability.summary + ' (via plugin)';
                    var tooltip = 'Extension ID: ' + capability.extensionId;
                    selectInput.append($('<option></option>')
                        .attr('id', optionId)
                        .attr('value', optionId)
                        .attr('title', tooltip)
                        .data('extensionId', capability.extensionId)
                        .data('capabilityId', capability.capabilityId)
                        .addClass('external-exporter')
                        .text(summary));
                }
            });
            var option = selectInput.find('option[value=' + language + ']');
            if (option.length > 0) {
                selectInput.val(language);
            }
            handleGenerateToScript();
        });
    });

    $("#select-script-language-id").change(function() {
        handleGenerateToScript();
        saveSetting();
    });
})

$(function() {
    var dialog = $( "#generateToScriptsDialog" );
    dialog.dialog({
        autoOpen: false,
        modal: true,
        height: 600,
        width: '90%',
        buttons: {
            "Copy to Clipboard": copyToClipboard,
            "Save As File...": saveToFile,
            Close: function() {
                $(this).dialog("close");
            }
        }
    });
    dialog.dialog({
        close: function() {
        }
    });
});
