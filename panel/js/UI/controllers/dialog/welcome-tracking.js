let htmlWhatsnews = `
    <div class="header">
        <div class="title">You're using KR 5.5.4</div>
    </div>
    <div class="content">
        <div class="message">
            Here is the summary of this release:
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
            
        </div>
    </div>
    <div class="footer">
        <button id="whats-news-release-note">Release note</button>
        <button id="whats-news-close">Close</button>
    </div>
`;

function displayWhatsNewDialog() {
  let newsDialog = $("<div></div>")
    .html(htmlWhatsnews)
    .dialog({
      title: `Everything is up to date`,
      resizable: true,
      autoOpen: true,
      dialogClass: 'whatsNewsDialog',
      height: "auto",
      width: "500",
      modal: true,
    });
  $("#whats-news-release-note").click(() => {
    window.open(
      "https://docs.katalon.com/katalon-recorder/docs/release-notes.html"
    );
  });
  $("#whats-news-close").click(() => {
    newsDialog.remove();
  })
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
