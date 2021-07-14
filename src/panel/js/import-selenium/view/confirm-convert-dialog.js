function displayWarningIncompatibleCommands(incompatibleCommands) {
  function generateCommandList(){
    return incompatibleCommands.reduce((html,command) => html+`<li>${command}</li>`, "");
  }
  function displayDialog(resolve) {
    const HTML =
      `
        <div style='text-align:center'>
          <h1>Incompatible commands</h1>
        </div>
        <p>There are some incompatible commands in your Selenium IDE project</p>
        <ul style="margin: 0;">${generateCommandList()}</ul>
        <p>They will be deleted to make the tests functional. Please see this 
        <a href="https://docs.katalon.com/katalon-recorder/docs/import-from-selenium-ide.html" target="_blank">docs</a> to see the command compatibility between Selenium IDE and Katalon Recorder.</p>
      `
    ;
    let dialog = $('<div id="selenium-confirm-dialog"></div>')
      .html(HTML)
      .dialog({
        title: "Warning!",
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Got it!": function () {
            resolve("true");
            $(this).dialog("close");
          },
        },
        close: function () {
          $(this).remove();
        }
      });
  }

  return new Promise((resolve, reject) => {
    displayDialog(resolve);
  });
}

export { displayWarningIncompatibleCommands }