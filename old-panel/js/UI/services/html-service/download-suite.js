import { getSelectedCase, setSelectedCase } from "../../view/testcase-grid/selected-case.js";
import { marshall } from "../helper-service/parser.js";
import { setSelectedSuite } from "../../view/testcase-grid/selected-suite.js";
import { findTestSuiteById } from "../data-service/test-suite-service.js";
import { makeTextFile } from "../helper-service/make-text-file.js";
import { closeConfirm } from "../../view/testcase-grid/close-confirm.js";

/**
 * allow user to download the test suite as HTML file
 *
 * @param {HTMLElement} testSuiteContainerElement - an HTML element that contains attribute krdataid
 * @param callback - callback will be called when downloading has completed
 */
const downloadSuite = (testSuiteContainerElement, callback) => {
    if (testSuiteContainerElement) {
        const testSuiteID = testSuiteContainerElement.id;
        const testSuite = findTestSuiteById(testSuiteID);
        let output = marshall(testSuite);
        let old_case = getSelectedCase();

        if (old_case) {
            setSelectedCase(old_case.id);
        } else {
            setSelectedSuite(testSuiteContainerElement.id);
        }

        let fileName = testSuite.name + ".html";
        const link = makeTextFile(output);
        const downloading = browser.downloads.download({
            filename: fileName,
            url: link,
            saveAs: true,
            conflictAction: 'overwrite'
        });

        const result = function(id) {
            browser.downloads.onChanged.addListener(function downloadCompleted(downloadDelta) {
                if (downloadDelta.id === id && downloadDelta.state &&
                    downloadDelta.state.current === "complete") {
                    browser.downloads.search({
                        id: downloadDelta.id
                    }).then(function(download) {
                        download = download[0];
                        fileName = download.filename.split(/\\|\//).pop();
                        testSuite.name = fileName.substring(0, fileName.lastIndexOf("."));
                        $(testSuiteContainerElement).find(".modified").removeClass("modified");
                        closeConfirm(false);
                        testSuiteContainerElement.getElementsByTagName("STRONG")[0].textContent = testSuite.name;
                        if (callback) {
                            callback();
                        }
                        browser.downloads.onChanged.removeListener(downloadCompleted);
                    })
                } else if (downloadDelta.id === id && downloadDelta.error) {
                    browser.downloads.onChanged.removeListener(downloadCompleted);
                }
            })
        };

        const onError = function(error) {
            console.log(error);
        };

        downloading.then(result, onError);
    } else {
        alert("Choose a test suite to download!");
    }
}

export { downloadSuite }