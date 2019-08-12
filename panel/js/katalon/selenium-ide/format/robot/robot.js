/*
 * An adapter that lets you use format() function with the format
 * that only defines formatCommand() function.
 *
 */

/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
    testCase.header = null;
    testCase.footer = null;
    var commands = [];

    var reader = new LineReader(source);
    var line;
    while ((line = reader.read()) != null) {
        commands.push(new Line(line));
    }
    testCase.commands = commands;
    testCase.formatLocal(this.name).header = "";
}

/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name) {
    this.log.info("formatting testCase: " + name);
    var result = "";
    var header = "";
    var footer = "";
    this.commandCharIndex = 0;
    if (this.formatHeader) {
        header = formatHeader(testCase);
    }
    result += header;
    this.commandCharIndex = header.length;
    testCase.formatLocal(this.name).header = header;
    result += formatCommands(testCase.commands);
    return result;
}

function filterForRemoteControl(originalCommands) {
    var commands = [];
    for (var i = 0; i<originalCommands.length;i++)
    {
        var c = originalCommands[i];
        c1 = String(c);
        if (c1.match("|"))
        {
            c1 = c1.replace("|","  ").replace("|","  ");    
        }

        if (c1.match("label="))
        {
            c1 = c1.replace(/label=/g,"");
        }

        //Xu ly xpath
        var temp = c1.indexOf("//");
        if (temp != -1 && c1.charAt(temp-1) == " ")
        {
            c1 = c1.replace("//","xpath=//");
        }
        var str = '/html';
        if (c1.indexOf(str) != -1)
        {
            c1 = c1.replace("/html","xpath=/html");
        }
        commands.push(c1);
    }
    return commands;
}

function formatCommands(commands) {
    commands = filterForRemoteControl(commands);
    var result = 'Test Case\n' + '    ';
    for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        line = formatCommand(command);
        if (line != null) {
            line = line + "\n" + "    ";
            result += line;
        }
    }
    return result;
}

function formatHeader(testCase) {
    var header = (options.getHeader ? options.getHeader() : options.header).
        replace(/\$\{baseURL\}/g, testCase.getBaseURL()).
        replace(/\$\{([a-zA-Z0-9_]+)\}/g, function(str, name) { return options[name]; });
    return header;
}

function CallSelenium(message, args) {
    this.message = message;
    if (args) {
        this.args = args;
    } else {
        this.args = [];
    }
}

function formatCommand(command) {
    return command;
}

this.remoteControl = true;
this.playable = false;

//Ham xu li comment
function formatComment(comment) {
    return comment.comment.replace(/.+/mg, function(str) {
            return "// " + str;
        });
}

//cai dat cac thuoc tinh hien thi tren plugin
this.options = {
    version: "v1.86",
    receiver: "",
    environment: "firefox",
    indent: "2",
    initialIndents: '2',
    defaultExtension: 'robot'
};

this.configForm = 
    '<description>Variable for Selenium instance</description>' +
    '<textbox id="options_receiver" />' +
    '<description>Environment</description>' +
    '<textbox id="options_environment" />' +
    '<description>Indent</description>' +
    '<menulist id="options_indent"><menupopup>' +
    '<menuitem label="Tab" value="tab"/>' +
    '<menuitem label="1 space" value="1"/>' +
    '<menuitem label="2 spaces" value="2"/>' +
    '<menuitem label="3 spaces" value="3"/>' +
    '<menuitem label="4 spaces" value="4"/>' +
    '<menuitem label="5 spaces" value="5"/>' +
    '<menuitem label="6 spaces" value="6"/>' +
    '<menuitem label="7 spaces" value="7"/>' +
    '<menuitem label="8 spaces" value="8"/>' +
    '</menupopup></menulist>';




this.name = "robotframework-testing_selenium";

options.header =
    '*** Settings ***\n' +
    'Suite Setup    Open Browser    ${baseURL}    ${environment}\n' +
    'Suite Teardown    Close Browser\n'+
    'Resource    seleniumLibrary.robot\n\n'+
    '*** Variables ***\n' +
    '${${homepage}}' + '    ${baseURL}\n\n'+
    '*** Test Cases ***\n';

options.footer = '';
