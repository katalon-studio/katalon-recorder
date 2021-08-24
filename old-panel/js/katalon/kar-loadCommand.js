// load all Selenium IDE command
function _loadSeleniumCommands() {
    var commands = [];

    var nonWaitActions = ['open', 'selectWindow', 'chooseCancelOnNextConfirmation', 'answerOnNextPrompt', 'close', 'setContext', 'setTimeout', 'selectFrame'];

    for (func in Selenium.prototype) {
        //this.log.debug("func=" + func);
        var r;
        if (func.match(/^do[A-Z]/)) {
            var action = func.substr(2,1).toLowerCase() + func.substr(3);
            commands.push(action);
            if (!action.match(/^waitFor/) && nonWaitActions.indexOf(action) < 0) {
                commands.push(action + "AndWait");
            }
        } else if (func.match(/^assert.+/)) {
            commands.push(func);
            commands.push("verify" + func.substr(6));
        } else if ((r = func.match(/^(get|is)(.+)$/))) {
            var base = r[2];
            commands.push("assert" + base);
            commands.push("verify" + base);
            commands.push("store" + base);
            commands.push("waitFor" + base);
            var r2;
            if ((r = func.match(/^is(.*)Present$/))) {
                base = r[1];
                commands.push("assert" + base + "NotPresent");
                commands.push("verify" + base + "NotPresent");
                commands.push("waitFor" + base + "NotPresent");
            } else {
                commands.push("assertNot" + base);
                commands.push("verifyNot" + base);
                commands.push("waitForNot" + base);
            }
        }
    }

    commands.push("pause");
    commands.push("store");
    commands.push("echo");
    commands.push("break");

    commands.push('if');
    commands.push('elseIf');
    commands.push('else');
    commands.push('endIf');
    commands.push('while');
    commands.push('endWhile');
    commands.push('loadVars');
    commands.push('endLoadVars');
    commands.push('storeCsv');
    commands.push('writeToCSV');
    commands.push('appendToCSV');

    commands.push('dragAndDropToObjectByJqueryUI');

    commands.push('gotoIf');
    commands.push('gotoLabel');
    commands.push('label');
    commands.push('upload');

    commands.sort();

    var uniqueCommands = [];
    var previousCommand = null;
    for (var i = 0; i < commands.length; i++) {
        var currentCommand = commands[i];
        if (previousCommand != currentCommand) {
            uniqueCommands.push(currentCommand);
        }
        previousCommand = currentCommand;
    }
    return uniqueCommands;
}

// load Selenium IDE command reference
$(function() {
    $.ajax({
        url: 'js/katalon/selenium-ide/iedoc-core.xml',
        success: function (document) {
            Command.apiDocuments = new Array(document);
        },
        async: false,
        dataType: 'xml'
    });
});

// get a command reference
function scrape(word){
    emptyNode(document.getElementById("refercontainer"));
    var command = new Command(word);
    var def = command.getDefinition();
    help_log.logHTML((def) ? def.getReferenceFor(command): '');
    $('#tab4.case_roll').scrollTop(0);
}
