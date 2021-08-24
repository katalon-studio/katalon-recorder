import { setSelectedSuite } from "./selected-suite.js";
import { saveOldCase } from "./utils.js";
import { renderTestCaseToRecordGrid } from "../records-grid/render-test-case-to-record-grid.js";
import { findTestCaseById } from "../../services/data-service/test-case-service.js";

const getSelectedCase = () => {
    if (document.getElementById("testCase-grid").getElementsByClassName("selectedCase")) {
        return document.getElementById("testCase-grid").getElementsByClassName("selectedCase")[0];
    } else {
        return null;
    }
}

const setSelectedCase = (id) => {
    saveOldCase();
    const suite_id = document.getElementById(id).parentNode.id;
    setSelectedSuite(suite_id);
    $("#" + id).addClass('selectedCase');
    clean_panel();
    const testCaseContainer = document.getElementById(id);
    const testCaseID = testCaseContainer.id;
    const testCase = findTestCaseById(testCaseID);
    renderTestCaseToRecordGrid(testCase);
}

export { getSelectedCase, setSelectedCase }