import { cleanSelected, saveOldCase } from "./utils.js";

const getSelectedSuite = () => {
  if (document.getElementById("testCase-grid").getElementsByClassName("selectedSuite")) {
    return document.getElementById("testCase-grid").getElementsByClassName("selectedSuite")[0];
  } else {
    return null;
  }
}


const setSelectedSuite = (id) => {
  saveOldCase();
  cleanSelected();
  $("#" + id).addClass('selectedSuite');
  clean_panel();
}
export { getSelectedSuite, setSelectedSuite }