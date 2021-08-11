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
<html>

<head>
  
</head>

<body>
<h2 id="5-5-1-3">You're using KR 5.5.2.4</h2>
<p>Here is the summary of this release.</p>
<ul>
   <li>
      <strong>Bug fixes</strong>
      <ul>
         <li><b>Improved</b> test suite parsing mechanism to reduce the possibility of defunct test suites.</li>
         <li><b>Changed</b> test suite files' extension from HTML to KRECORDER to avoid IDE auto-formatting features.</li>
      </ul>
   </li>
</ul>
</body>
</html>
</div>
`;

function displayWhatsNewDialog() {
  let newsDialog = $("<div></div>")
    .html(htmlWhatsnews)
    .dialog({
      title: `Everything is up to date`,
      resizable: true,
      height: "350",
      width: "500",
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
