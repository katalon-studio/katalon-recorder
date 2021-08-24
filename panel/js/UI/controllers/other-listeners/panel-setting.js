import { genCommandDatalist } from "../../view/command-toolbar/generate-command-data-list.js";

$(document).ready(function() {
  $(".tablesorter").tablesorter();

  $("#options").click(function() {
    browser.runtime.openOptionsPage();
  });

  //init dropdown width
  $("#command-dropdown").css({
    'width': $("#command-command").outerWidth() + "px"
  });
  $("#target-dropdown").css({
    'width': $("#command-target").outerWidth() + "px"
  });
  //dropdown width change with input's width
  $(window).resize(function() {
    $("#command-dropdown").css({
      'width': $("#command-command").outerWidth() + "px"
    });
    $("#target-dropdown").css({
      'width': $("#command-target").outerWidth() + "px"
    });
  });
  //dropdown when click the down icon
  $(".fa-chevron-down").click(function(e) {
    e.stopPropagation();
    dropdown($("#" + $(this).attr("id") + "dropdown"));
  });

  $("#command-grid").colResizable({ liveDrag: true, minWidth: 75, resizeMode:'fix' });

  $("#command-dropdown,#command-command-list").html(genCommandDatalist());

  $(".record-bottom").click(function() {
    $(this).addClass("active");
    $('#records-grid .selectedRecord').removeClass('selectedRecord');
  });

  $("#slider").slider({
    min: 0,
    max: 3000,
    value: 0,
    step: 600
  }).slider("pips", {
    rest: "label", labels: ["Fast", "", "", "", "", "Slow"]
  });

});

var dropdown = function(node) {
  if (!node.hasClass("w3-show")) {
    node.addClass("w3-show");
    setTimeout(function() {
      $(document).on("click", clickWhenDropdownHandler);
    }, 200);
  } else {
    $(".w3-show").off("mouseleave");
    node.removeClass("w3-show");
    $(document).off("click", clickWhenDropdownHandler);
  }
};

var clickWhenDropdownHandler = function(e) {
  if (e.target.tagName === "TD" || e.target.tagName === "OPTION") {
    let parent = e.target.parentElement;
    while (parent.id !== "command-dropdown" && parent.id !== "target-dropdown") {
      parent = parent.parentElement;
    }
    $(parent).prev().prev().val(e.target.innerHTML).trigger("input");
    dropdown($(".w3-show"));
  }
};

