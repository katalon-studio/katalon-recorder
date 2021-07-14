import { 
    trackingOpenApp,
    trackingTestCase,
    trackingTestSuite,
    trackingAddTestStep,
    trackingDeleteTestStep,
    trackingCopyTestStep,
    trackingPasteTestStep,
    trackingSelectTargetElement,
    trackingHightlightTargetElement,
    trackingPause,
    trackingOpenTestOpsReport,
    trackingOpenExport,
    trackingOpenHelp,
    trackingOpenAdjustSpeed,
    trackingOpenGithub,
    trackingOpenSetting,
    trackingOpenExtendedFeatures,
    trackingOpenDialyUsage
 } from "./segment-tracking-service.js";

let isUI = false;
$(() => {
    trackingOpenApp();

    $('#grid-add-btn').on('click', function () {
        trackingAddTestStep('UI');
        isUI = true;
    });

    $('#grid-delete-btn').on('click', function () {
        trackingDeleteTestStep('UI');
        isUI = true;
    });

    $('#grid-copy-btn').on('click', function () {
        trackingCopyTestStep('UI');
        isUI = true;
    });

    $('#grid-paste-btn').on('click', function () {
        trackingPasteTestStep('UI');
        isUI = true;
    });

    $('#grid-add').click(() => {
        if (!isUI) {
            trackingAddTestStep('context');
        }
        isUI = false;
    });

    $('#grid-delete').click(() => {
        if (!isUI) {
            trackingDeleteTestStep('context');
        }
        isUI = false;
    })

    $('#grid-copy').click(() => {
        if (!isUI) {
            trackingCopyTestStep('context');
        }
        isUI = false;
    });

    $('#grid-paste').click(() => {
        if (!isUI) {
            trackingPasteTestStep('context');
        }
        isUI = false;
    });

    $('#selectElementButton').click(() => {
        if (!isUI) {
            trackingSelectTargetElement();
        }
        isUI = false;
    });

    $('#showElementButton').click(() => {
        trackingHightlightTargetElement();
    });

    $('#pause').click(() => {
        trackingPause();
    });

    $('#add-testCase').click(function () {
        trackingTestCase('create', 'UI');
    });
    $('#add-testSuite').click(function () {
        trackingTestSuite('UI');
    })

    $("#export").click(function () {
        trackingOpenExport();
    });

    $('#help.sub_btn').click(() => {
        trackingOpenHelp();
    });

    $('#speed').click(() => {
        trackingOpenAdjustSpeed();
    });

    $('#settings').click(() => {
        trackingOpenSetting();
    });

    $('#github').click(() => {
        trackingOpenGithub();
    });

    $('#extended-features').click(() => {
        trackingOpenExtendedFeatures();
    });

    $('#dailyUsage').click(() => {
        trackingOpenDialyUsage();
    })
})

$(document).on('click mousedown', 'p,span', function (event) {
    setTimeout(() => {
        if ($(event.target).is('.selectedCase') || $(event.target).parent().is('.selectedCase')) {
            trackingTestCase('open');
        }
    }, 500)
});

$(document).on('click', '#ka-upload,#ka-upload-log', function () {
    trackingOpenTestOpsReport();
})

const port = browser.runtime.connect();