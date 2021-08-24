const testSuitContainerOpen = () => {
  const image = $("#testSuiteDropdown").find("img");
  $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
  $("#result-container").css("display", "flex");
  $("#testCase-grid").css("display", "block");
}

const testSuiteContainerClose = () => {
  const image = $("#testSuiteDropdown").find("img");
  $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-off.svg");
  $("#result-container").css("display", "none");
  $("#testCase-grid").css("display", "none");
}

export { testSuitContainerOpen, testSuiteContainerClose }