const closeConfirm = (bool) => {
  if (bool) {
    $(window).on("beforeunload", function(e) {
      var confirmationMessage = "You have a modified suite!";
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage; // Gecko, WebKit, Chrome <34
    });
  } else {
    if (!$("#testCase-grid").find(".modified").length)
      $(window).off("beforeunload");
  }
}

export { closeConfirm }