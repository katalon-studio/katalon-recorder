import { setIsChange } from "../setting-panel.js";

class KSPortSettingTab { //Implements ISettingTab
  constructor(containerElement) {
    this.containerElement = containerElement;
  }

  getContent() {
    return `
        <div id="KS-port-content" style="display: none">
        <h1>Port Setting for Katalon Studio (Desktop application)</h1>
        <p>Allow users to change the default port used by <a target="_blank" href="https://www.katalon.com/">Katalon Studio</a> to communicate with the active Chrome browser (support for Firefox is coming soon). The desktop application preference must be configured accordingly as the screenshot below.</p>
        <form>
            <label for="port">Katalon Studio Server Port: </label>
            <input type="text" name="port" id="KS-port">
        </form>
        <p>(In Katalon Studio: Window > Katalon Studio Preferences > Utility Addon)</p>
        <img style="height: 300px" src="../../../katalon/images/port-setting.png"  alt="Katalon Studio setting tab"/>

        <h1>About this extension</h1>
        <p>This browser extension is developed by Katalon Studio team to support users of the obsolete Selenium IDE to record and playback the automation test cases on both Firefox 55+ and Chrome browsers.</p>
        <p>Selenium IDE script is supported and can be loaded into Katalon Automation Recorded and export to multiple languages and formats.</p>
        <p><a target="_blank" href="https://www.katalon.com/">Katalon Studio</a> and Katalon Recorder are completely free. For more information contact us at <a target="_blank" href="mailto:info@katalon.com">info@katalon.com</a>.</p>

        <h1><a href="https://docs.katalon.com/x/pwHR" target="_blank">Acknowledgments</a></h1>
        </div>`;
  }


  initialize() {
    getKatalonServerPort(function (port) {
      document.getElementById("KS-port").value = port;
    });
    $("#KS-port").on("input", function () {
      setIsChange(true);
    });
  }

  display() {
    for (let child of $(this.containerElement).children()) {
      $(child).hide();
    }
    $("#KS-port-content").show();
  }

  saveData() {
    setKatalonServerPort($('#KS-port').val());
  }


}


export { KSPortSettingTab }