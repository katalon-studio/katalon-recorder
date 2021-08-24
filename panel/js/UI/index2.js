/* I do not why we need 2 index js files but
if these function get imported in index.js Github Actions workflow will not work */
import { getSelectedCase, setSelectedCase } from "./view/testCase-grid/selected-case.js";
import { getRecordsArray } from "./view/records-grid/get-records-array.js"
import { getSelectedRecord } from "./view/records-grid/selected-records.js";
import { getSelectedSuite, setSelectedSuite } from "./view/testCase-grid/selected-suite.js";
import { saveOldCase } from "./view/testCase-grid/utils.js";



window.getSelectedCase = getSelectedCase;
window.getRecordsArray = getRecordsArray;
window.getSelectedRecord = getSelectedRecord;
window.setSelectedSuite = setSelectedSuite;
window.setSelectedCase = setSelectedCase;
window.getSelectedSuite = getSelectedSuite;
window.saveOldCase = saveOldCase;