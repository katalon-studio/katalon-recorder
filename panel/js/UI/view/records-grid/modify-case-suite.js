import { getSelectedCase } from "../testcase-grid/selected-case.js";
import { getSelectedSuite } from "../testcase-grid/selected-suite.js";

const modifyCaseSuite = () => {
    getSelectedCase().classList.add("modified");
    getSelectedSuite().getElementsByTagName("strong")[0].classList.add("modified");
}

export { modifyCaseSuite }