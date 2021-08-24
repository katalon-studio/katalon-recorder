$(document).ready(function () {
  $("#testDataDropdown").click(function () {
    const image = $(this).find("img");
    const src = $(image).attr("src");
    if (src.includes("off")) {
      $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
      $("#data-files-list").css("display", "flex");
    } else {
      $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-off.svg");
      $("#data-files-list").css("display", "none");
    }
  });

  $("#testDataPlus").click(function () {
    $("#load-data-file-hidden").click();
  });

  $("#extensionDropdown").click(function () {
    const image = $(this).find("img");
    const src = $(image).attr("src");
    if (src.includes("off")) {
      $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
      $("#extensions-list").css("display", "flex");
    } else {
      $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-off.svg");
      $("#extensions-list").css("display", "none");
    }
  });

  $('#extensionScriptPlus').click(function () {
    $("#load-extension-hidden").click();
  });

  $("#github").click(function () {
    window.open('https://github.com/katalon-studio/katalon-recorder');
  })

});