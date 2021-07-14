function setUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function getLoggedInUserAPI() {
    return fetch(`${getKatalonEndpoint()}wp-json/restful_api/v1/auth/me`)
        .then(response => response.json())
        .then(data => {
            let user;
            if (data.user_info) {
                user = { email: data.user_info };
            } else {
                user = {};
            }
            return Promise.resolve(user);
        }).catch(error => {
            console.log(error);
            return Promise.resolve({});
        })
}

function getKatalonEndpoint() {
    let manifestData = browser.runtime.getManifest();
    return manifestData.homepage_url;
}

function getSegmentEndpoint() {
    let manifestData = browser.runtime.getManifest();
    return manifestData.segment_url;
}

function trackingSegmentAPI(data) {
    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    }
    return fetch(`${getSegmentEndpoint()}/segment-kr/tracking`, fetchData).then(data => data);
}

function trackingSegment(event, action) {
    browser.storage.local.get('segment')
        .then(async function(result) {
            if (!result.segment) {
                result = {
                    segment: {
                        userId: setUUID(),
                        user: ''
                    }
                }
                let user = await getLoggedInUserAPI();

                if (user.email) {
                    result.segment.user = user.email.email;
                }
                browser.storage.local.set(result);
            }

            let data = {
                userId: '',
                event: event,
            }
            let segment = result.segment;
            let properties = {};


            if (segment.userId) {
                data.userId = segment.userId;
            }

            if (segment.user) {
                properties.user = segment.user;
            } else {
                let user = await getLoggedInUserAPI();
                if (user.email) {
                    result.segment.user = user.email.email;
                    properties.user = user.email.email;
                }
                browser.storage.local.set(result);
            }

            if (action) {
                for (const key in action) {
                    if (Object.hasOwnProperty.call(action, key)) {
                        const element = action[key];
                        properties[key] = element;
                    }
                }
            }
            data.properties = properties;
            return trackingSegmentAPI(data);
        })
}

function trackingInstallApp() {
    let data = {
        userId: setUUID(),
        event: "kru_install_application",
        properties: {}
    }
    browser.storage.local.get('segment').then(async function(result) {
        if (!result.segment) {
            result = {
                segment: {
                    userId: data.userId,
                    user: ''
                }
            }
            let user = await getLoggedInUserAPI();
            if (Object.keys(user).length !== 0) {
                result.segment.user = user.email.email;
                data.properties.user = user.email.email;
            }
            await browser.storage.local.set(result);
            return trackingSegmentAPI(data);
        }
    });
}

function trackingUninstallApp() {
    return trackingSegment('kru_uninstall_application');
}

function trackingCloseApp() {
    return trackingSegment('kru_close_application');
}

function trackingOpenApp() {
    return trackingSegment('kru_open_application');
}

function trackingLogin() {
    return trackingSegment('kru_login');
}

function trackingSignup() {
    return trackingSegment('kru_signup');
}

function trackingRecord() {
    return trackingSegment('kru_record');
}

function trackingCreateTestCase(source, testCaseId) {
    let action = {
        source: source,
        test_case_id: testCaseId
    };
    return trackingSegment('kru_create_test_case', action);
}

function trackingCreateTestSuite(source, testSuiteId) {
    let action = {
        source: source,
        test_suite_id: testSuiteId
    };
    return trackingSegment('kru_create_test_suite', action);
}

function trackingTestCase(type, source, status, isSelfHealing) {
    setTimeout(() => {
        if (getSelectedCase()) {
            let title = $(getSelectedCase()).children('span').text();
            switch (type) {
                case 'create':
                    trackingCreateTestCase(source, title);
                    break;
                case 'open':
                    // Temporary disable openTestCase because it also gets fired repeatedly
                    // trackingOpenTestCase(title);
                    break;
                case 'execute':
                    trackingExecuteTestCase(title, status, isSelfHealing);
                    break;
                default:
                    break;
            }
        }
    }, 500);
}

function trackingTestSuite(source) {
    setTimeout(() => {
        if (getSelectedSuite()) {
            let title = $(getSelectedSuite()).find('strong.test-suite-title').text();
            trackingCreateTestSuite(source, title);
        }
    }, 500);
}

function trackingExecuteTestSuites(type, isSelfHealing) {
    let title = $(getSelectedSuite()).find('strong.test-suite-title').text();
    let numSuccessedTestCase = $('.test-case-title.success').length;
    let numFailedTestCase = $('.test-case-title.fail').length;


    switch (type) {
        case 'suite':
            trackingExecuteTestSuite(title, numSuccessedTestCase, numFailedTestCase, isSelfHealing)
            break;
        case 'all':
            trackingExecuteAll(numSuccessedTestCase, numFailedTestCase, isSelfHealing);
            break;
        default:
            break;
    }
}

function trackingOpenTestCase(testCaseId) {
    let action = {
        test_case_id: testCaseId
    }
    return trackingSegment('kru_open_test_case', action);
}

function trackingSaveTestCase(source, testCaseId) {
    let action = {
        source: source,
        test_case_id: testCaseId
    };
    return trackingSegment('kru_save_test_case', action);
}

function trackingSaveTestSuite(source, testSuiteId) {
    let action = {
        source: source,
        test_suite_id: testSuiteId
    };
    return trackingSegment('kru_save_test_suite', action);
}

function trackingAddTestStep(source) {
    let action = {
        source: source
    }
    return trackingSegment('kru_add_test_step', action);
}

function trackingDeleteTestStep(source) {
    let action = {
        source: source
    }
    return trackingSegment('kru_delete_test_step', action);
}

function trackingCopyTestStep(source) {
    let action = {
        source: source
    }
    return trackingSegment('kru_copy_test_step', action);
}

function trackingPasteTestStep(source) {
    let action = {
        source: source
    }
    return trackingSegment('kru_paste_test_step', action);
}

function trackingSelectTargetElement() {
    return trackingSegment('kru_select_target_element');
}

function trackingHightlightTargetElement() {
    return trackingSegment('kru_highlight_target_element');
}

function trackingExecuteTestCase(testCaseId, status, isSelfHealing) {
    let action = {
        test_case_id: testCaseId,
        status: status,
        is_self_healing_triggered: isSelfHealing
    }
    return trackingSegment('kru_execute_test_case', action);
}

function trackingExecuteTestSuite(testSuiteId, noSuccessedTestCase, noFailedTestCase, isSelfHealing, isConsole) {
    let action = {
        test_suite_id: testSuiteId,
        no_successed_test_case: noSuccessedTestCase,
        no_failed_test_case: noFailedTestCase,
        is_self_healing_triggered: isSelfHealing,
        is_console: isConsole
    }
    return trackingSegment('kru_execute_test_suite', action);
}

function trackingExecuteAll(noSuccessedTestCase, noFailedTestCase, isSelfHealing) {
    let action = {
        no_successed_test_case: noSuccessedTestCase,
        no_failed_test_case: noFailedTestCase,
        is_self_healing_triggered: isSelfHealing
    }
    return trackingSegment('kru_execute_all', action);
}

function trackingPause() {
    return trackingSegment('kru_pause');
}

function trackingOpenTestOpsReport() {
    return trackingSegment('kru_open_testops_report');
}

function trackingOpenExport() {
    return trackingSegment('kru_open_export');
}

function trackingExportTestCase(source) {
    let action = {
        source: source
    }
    return trackingSegment('kru_export_test_case', action);
}

function trackingOpenHelp() {
    return trackingSegment('kru_open_help');
}

function trackingOpenAdjustSpeed() {
    return trackingSegment('kru_open_adjust_speed');
}

function trackingOpenGithub() {
    return trackingSegment('kru_open_github');
}

function trackingOpenSetting() {
    return trackingSegment('kru_open_setting');
}

function trackingOpenExtendedFeatures() {
    return trackingSegment('kru_open_extended_features');
}

function trackingOpenDialyUsage() {
    return trackingSegment('kru_open_daily_usage');
}

export {
    trackingInstallApp,
    trackingUninstallApp,
    trackingCloseApp,
    trackingOpenApp,
    trackingLogin,
    trackingSignup,
    trackingRecord,
    trackingTestCase,
    trackingTestSuite,
    trackingCreateTestCase,
    trackingCreateTestSuite,
    trackingOpenTestCase,
    trackingSaveTestCase,
    trackingSaveTestSuite,
    trackingAddTestStep,
    trackingDeleteTestStep,
    trackingCopyTestStep,
    trackingPasteTestStep,
    trackingSelectTargetElement,
    trackingHightlightTargetElement,
    trackingExecuteTestCase,
    trackingExecuteTestSuite,
    trackingExecuteTestSuites,
    trackingExecuteAll,
    trackingPause,
    trackingOpenTestOpsReport,
    trackingOpenExport,
    trackingExportTestCase,
    trackingOpenHelp,
    trackingOpenAdjustSpeed,
    trackingOpenGithub,
    trackingOpenSetting,
    trackingOpenExtendedFeatures,
    trackingOpenDialyUsage,
    trackingSegment
}