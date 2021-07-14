KURecorder.addOnKeyUpHandler("create click", "alt `", function(target) {
  var currentURL = this.window.document.URL;
  this.processOnClickTarget(target, "left", currentURL);
});
