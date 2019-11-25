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

    result += formatHeader(name,testCase);
    result += formatCommands(name,testCase.commands);
    result += formatFooter(name,testCase);
    
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

        if (c1.indexOf("/html") == 0)
        {
            c1 = "xpath=" + c1;
        }
        var key_str_start = c1.search(/\${KEY_.*}/)
        if (key_str_start != -1)
        {
            var key_str_stop  = c1.indexOf("}",key_str_start+6);
            var key_str = c1.slice(key_str_start+6,key_str_stop);
            c1 = c1.replace(/\${KEY_.*}/,key_str);
        }
        commands.push(c1);
    }
    return commands;
}

function formatCommands(name,commands) {
    commands = filterForRemoteControl(commands);
    var result = "";
    for (var i = 0; i < commands.length; i++) {
        if (commands[i] != null) {
            result += "    " + commands[i] + "\n";
        }
    }
    return result;
}

function formatHeader(name,testCase) {
    var header = "";
    var openurl = "";
    header = options.header;
    if ((name) && (name != "")) { header += name + "\n";   } 
    else                        { header += "Test Case\n"; }
    if (testCase.commands[0] != null) {
        var firstcmd = String(testCase.commands[0]);
        if (firstcmd.startsWith("open")) { 
            var firstcmds = [ firstcmd ];
            firstcmds = filterForRemoteControl(firstcmds);
            firstcmd = firstcmds[0];
            openurl = firstcmd.split(/\s+/).slice(1,2);
            testCase.commands[0] = "# " + testCase.commands[0];
        }
        else { 
            openurl = testCase.getBaseURL();
        }
    }
    header += "    [Setup]  Run Keywords  Open Browser  " + openurl + "  ${BROWSER}\n";
    header += "    ...              AND   Set Selenium Speed  ${SELSPEED}\n";
    return header;
}

function formatFooter(name,testCase) {
    var footer = "";
    footer += "    [Teardown]  Close Browser\n";
    footer += options.footer;
    return footer;
}

function CallSelenium(message, args) {
    this.message = message;
    if (args) {
        this.args = args;
    } else {
        this.args = [];
    }
}

this.remoteControl = true;
this.playable = false;

//Ham xu li comment
function formatComment(comment) {
    return comment.comment.replace(/.+/mg, function(str) {
            return "// " + str;
        });
}

if      (bowser.chrome)  { this.active_browser = "chrome"; }
else if (bowser.firefox) { this.active_browser = "firefox"; }
else                     { this.active_browser = "firefox"; }

//cai dat cac thuoc tinh hien thi tren plugin
this.options = {
    version: "v1.87",
    receiver: "",
    environment: this.active_browser,
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
    'Library  SeleniumLibrary\n\n' +
    '*** Variables ***\n' +
    '${BROWSER}   ' + this.active_browser + '\n' +
    '${SELSPEED}  0.0s\n\n' +
    '*** Test Cases ***\n';

options.footer =
    '\n*** Keywords ***\n' +
    'open\n' +
    '    [Arguments]    ${element}\n' +
    '    Go To          ${element}\n\n' +
    'clickAndWait\n' +
    '    [Arguments]    ${element}\n' +
    '    Click Element  ${element}\n\n' +
    'click\n' +
    '    [Arguments]    ${element}\n' +
    '    Click Element  ${element}\n\n' +
    'sendKeys\n' +
    '    [Arguments]    ${element}    ${value}\n' +
    '    Press Keys     ${element}    ${value}\n\n' +
    'submit\n' +
    '    [Arguments]    ${element}\n' +
    '    Submit Form    ${element}\n\n' +
    'type\n' +
    '    [Arguments]    ${element}    ${value}\n' +
    '    Input Text     ${element}    ${value}\n\n' +
    'selectAndWait\n' +
    '    [Arguments]        ${element}  ${value}\n' +
    '    Select From List   ${element}  ${value}\n\n' +
    'select\n' +
    '    [Arguments]        ${element}  ${value}\n' +
    '    Select From List   ${element}  ${value}\n\n' +
    'verifyValue\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'verifyText\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'verifyElementPresent\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'verifyVisible\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'verifyTitle\n' +
    '    [Arguments]                  ${title}\n' +
    '    Title Should Be              ${title}\n\n' +
    'verifyTable\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'assertConfirmation\n' +
    '    [Arguments]                  ${value}\n' +
    '    Alert Should Be Present      ${value}\n\n' +
    'assertText\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'assertValue\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'assertElementPresent\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'assertVisible\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'assertTitle\n' +
    '    [Arguments]                  ${title}\n' +
    '    Title Should Be              ${title}\n\n' +
    'assertTable\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'waitForText\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'waitForValue\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'waitForElementPresent\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'waitForVisible\n' +
    '    [Arguments]                  ${element}\n' +
    '    Page Should Contain Element  ${element}\n\n' +
    'waitForTitle\n' +
    '    [Arguments]                  ${title}\n' +
    '    Title Should Be              ${title}\n\n' +
    'waitForTable\n' +
    '    [Arguments]                  ${element}  ${value}\n' +
    '    Element Should Contain       ${element}  ${value}\n\n' +
    'doubleClick\n' +
    '    [Arguments]           ${element}\n' +
    '    Double Click Element  ${element}\n\n' +
    'doubleClickAndWait\n' +
    '    [Arguments]           ${element}\n' +
    '    Double Click Element  ${element}\n\n' +
    'goBack\n' +
    '    Go Back\n\n' +
    'goBackAndWait\n' +
    '    Go Back\n\n' +
    'runScript\n' +
    '    [Arguments]         ${code}\n' +
    '    Execute Javascript  ${code}\n\n' +
    'runScriptAndWait\n' +
    '    [Arguments]         ${code}\n' +
    '    Execute Javascript  ${code}\n\n' +
    'setSpeed\n' +
    '    [Arguments]           ${value}\n' +
    '    Set Selenium Timeout  ${value}\n\n' +
    'setSpeedAndWait\n' +
    '    [Arguments]           ${value}\n' +
    '    Set Selenium Timeout  ${value}\n\n' +
    'verifyAlert\n' +
    '    [Arguments]              ${value}\n' +
    '    Alert Should Be Present  ${value}\n';
