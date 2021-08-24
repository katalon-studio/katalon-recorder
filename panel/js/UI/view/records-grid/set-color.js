function setColor(index, state) {
  if (typeof (index) == "string") {
    $("#" + index).addClass(state);
    // KAT-BEGIN increase failure result to 1 once
    if (state == "fail") {
      document.getElementById("result-failures").textContent = $('.test-case-title.' + state).length;
    } else {
      document.getElementById("result-runs").textContent = $('.test-case-title.' + state).length - $('.test-case-title.success.fail').length;
    }
    // KAT-END
  } else {
    var node = document.getElementById("records-" + index);
    node.className = state;
    setRecordScrollTop(node);
  }
}

function setRecordScrollTop(record) {
  if ($(".smallSection").scrollTop() > record.offsetTop - 65)
    $(".smallSection").animate({
      scrollTop: record.offsetTop - 65
    }, 10);
  else if ($(".smallSection").height() + $(".smallSection").scrollTop() - 55 < record.offsetTop)
    $(".smallSection").animate({
      scrollTop: record.offsetTop - ($(".smallSection").height() - 55)
    }, 10);
}

export { setColor }