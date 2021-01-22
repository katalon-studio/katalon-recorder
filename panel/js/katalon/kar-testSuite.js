// read test suite from an HTML string
function readSuiteFromString(test_suite) {
    // append on test grid
    var id = "suite" + sideex_testSuite.count;
    sideex_testSuite.count++;
    var suiteName = parseSuiteName(test_suite);
    addTestSuite(suiteName, id);
    // name is used for download
    sideex_testSuite[id] = {
        file_name: suiteName + '.html',
        title: suiteName
    };

    test_case = test_suite.match(/<table[\s\S]*?<\/table>/gi);
    if (test_case) {
        for (var i = 0; i < test_case.length; ++i) {
            readCase(test_case[i]);
        }
    }
}

// parse test suite name from an HTML string
function parseSuiteName(test_suite) {
    var pattern = /<title>(.*)<\/title>/gi;
    var suiteName = pattern.exec(test_suite)[1];
    return suiteName;
}

// get content of a test suite as an HTML string
function getContentOfTestSuite(s_suite) {
    var cases = s_suite.getElementsByTagName("p"),
    output = "",
    old_case = getSelectedCase();
    for (var i = 0; i < cases.length; ++i) {
        setSelectedCase(cases[i].id);
        saveNewTarget();
        output = output +
            '<table cellpadding="1" cellspacing="1" border="1">\n<thead>\n<tr><td rowspan="1" colspan="3">' +
            sideex_testCase[cases[i].id].title +
            '</td></tr>\n</thead>\n' +
            panelToFile(document.getElementById("records-grid").innerHTML) +
            '</table>\n';
    }
    output = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' +
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:' +
        'lang="en" lang="en">\n<head>\n\t<meta content="text/html; charset=UTF-8" http-equiv="content-type" />\n\t<title>' +
        sideex_testSuite[s_suite.id].title +
        '</title>\n</head>\n<body>\n' +
        output +
        '</body>\n</html>';

    if (old_case) {
        setSelectedCase(old_case.id);
    } else {
        setSelectedSuite(s_suite.id);
    }

    return output;
}

// save all test suite to an array
function storeAllTestSuites() {
    var suites = document.getElementById("testCase-grid").getElementsByClassName("message");
    var length = suites.length;
    var data = [];
    for (var i=0; i<length; i++) {
        if (suites[i].id.includes("suite")) {
            var suite = suites[i];
            var content = getContentOfTestSuite(suite);
            data.push(content);
        }
    }
    return data;
}

// save test suite to storage
function saveData() {
    try {
        var s_suite = getSelectedSuite();
        var s_case = getSelectedCase();
        var data = {
            data: storeAllTestSuites()
        };
        browser.storage.local.set(data);
        if (s_suite) {
            setSelectedSuite(s_suite.id);
        }
        if (s_case) {
            setSelectedCase(s_case.id);
        }
    } catch (e) {
        console.log(e);
    }
    backupData();
}

// load test suite saved in storage upon starting
$(function() {
    chrome.storage.local.get(null, function(result) {
        try {
            if (result.data) {
                if (!result.backup) {
                    var data = {
                        backup: result.data
                    };
                    browser.storage.local.set(data);
                }
                for (var i = 0; i < result.data.length; i++) {
                    readSuiteFromString(result.data[i]);
                }
            }
            if (result.language) {
                $("#select-script-language-id").val(result.language);
            }
        } catch (e) {
            console.error(e);
        }
    });
});

// save test suite before exiting
$(window).on('beforeunload', function(e) {
    saveData();
});