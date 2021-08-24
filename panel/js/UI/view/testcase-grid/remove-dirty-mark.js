import { getSelectedCase } from "./selected-case.js";
import { trackingSaveTestCase } from "../../services/tracking-service/segment-tracking-service.js";

const removeDirtyMarks = (type) => {
    const s_case = getSelectedCase();
    $(s_case).parent().find("strong").removeClass("modified");
    $(s_case).removeClass("modified");
    _gaq.push(['_trackEvent', 'save-testCase', 'done']);
    let title = $(s_case).children('span').text();
    trackingSaveTestCase(type, title);
}

export { removeDirtyMarks }