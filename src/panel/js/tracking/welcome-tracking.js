let htmlWhatsnews = `
<style>
    .whats-new-text {
        font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
        font-size: 13px;
    }
    h3 {
      text-align: center;
    }
</style>
<div class='whats-new-text'>
<h3>You're using Katalon Recorder 5.5.1.2</h3>
<p>In this update, we have: </p>
<ul>
    <li><b>Fixed</b> issue test case view is not scrolled to top when users switch to a new test case.</li>
    <li><b>Promoted</b> sample projects after first successful execution.</li>
</ul>
</div>
`;

function displayWhatsNewDialog() {
  let newsDialog = $("<div></div>")
    .html(htmlWhatsnews)
    .dialog({
      title: `Everything is up to date`,
      resizable: true,
      height: "auto",
      width: "400",
      modal: true,
      buttons: {
        "Release note": () => {
          window.open(
            "https://docs.katalon.com/katalon-recorder/docs/release-notes.html"
          );
        },
        Close: function () {
          $(this).remove();
        },
      },
    });
  $("#close").click(() => {
    $(newsDialog).dialog("close");
  });
}

$(() => {
  browser.storage.local.get("tracking").then(function (result) {
    if (result.tracking) {
      if (result.tracking.isUpdated) {
        displayWhatsNewDialog();
      }
    }
  });
});
