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
<h2 id="5-5-1-3">You're using KR 5.5.4</h2>
<p>Here is the summary of this release.</p>
<ul>
<li>Bug fixes<ul>
<li>Fixed an issue where <a href="https://forum.katalon.com/t/error-using-appendtocsv-with-katalon-recorder-v-5-5-3/57655/4">Goto</a>, <a href="https://forum.katalon.com/t/error-using-appendtocsv-with-katalon-recorder-v-5-5-3/57655/4">AppendToCSV and WriteToCSV</a> commands do not work as expected.</li>
<li>Fixed an issue where autosuggestion dropdowns do not disappear after selecting an option.</li>
<li>Fixed an issue that prevents users from singing up a Katalon account in-app.</li>
</ul>
</li>
<li>New features<ul>
<li>Roll out a completely brand new UI/UX for all new users, and for 30% of lucky existing users.</li>
<li>Users can now duplicate a test suite along with all of its test cases through an option in context menu.</li>
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
      height: "auto",
      width: "auto",
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

$(document).ready(function(){
  browser.storage.local.get("tracking").then(function (result) {
    if (result.tracking) {
      if (result.tracking.isUpdated) {
        displayWhatsNewDialog();
      }
    }
  });
});
