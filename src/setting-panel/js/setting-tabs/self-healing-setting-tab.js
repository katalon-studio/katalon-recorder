import { setIsChange } from "../setting-panel.js";

function makeTableSortable(tbodyID) {
  $(`#${tbodyID}`).sortable({
    axis: "y",
    items: "tr",
    scroll: true,
    revert: 200,
    scrollSensitivity: 20,
    helper: function (e, tr) {
      let $originals = tr.children();
      let $helper = tr.clone();
      $helper.children().each(function (index) {
        $(this).width($originals.eq(index).width());
      });
      return $helper;
    },
    update: function (event, ui) {
      //select element after drop it;
      let element = ui.item;
      let selectedElement = getSelectedElement(tbodyID);
      $(selectedElement).removeClass("selected");
      $(element).addClass("selected");
      setIsChange(true);
    }
  });
}

function getSelectedElement(listID) {
  return $(`#${listID} .selected`)[0];
}

function clickElementInListHandler(listID, element) {
  let selectedElement = getSelectedElement(listID);
  $(selectedElement).removeClass("selected");
  $(element).addClass("selected");
}

function renderEnable(dataSetting) {
  let enable = dataSetting.enable;
  $("#enable-self-healing").prop("checked", enable);
}

function renderLocatorList(dataSetting) {
  let locator = dataSetting.locator;
  locator.forEach(locator => {
    let tr = $(`<tr class='ui-sortable-handle'><td>${locator}</td></tr>`);
    tr.click(function () {
      clickElementInListHandler("locatorList", this);
    });
    $("#locatorList").append(tr);
  });
}

function renderExcludeCommandList(dataSetting) {
  let excludeCommands = dataSetting.excludeCommands;
  excludeCommands.forEach(command => {
    let tr = $(`<tr class='ui-sortable-handle'><td>${command}</td></tr>`);
    tr.click(function () {
      clickElementInListHandler("excludeCommandList", this);
    });
    $("#excludeCommandList").append(tr)
  });
}

async function renderDataSetting() {
  let settingData = (await browser.storage.local.get("setting")).setting;
  let selfHealingSetting = settingData["self-healing"];
  renderEnable(selfHealingSetting);
  renderLocatorList(selfHealingSetting);
  renderExcludeCommandList(selfHealingSetting);
}

function attachButtonEvent() {
  $("#enable-self-healing").click(function () {
    setIsChange(true);
  });

  $("#locator-move-up-btn").click(function () {
    let selectedElement = getSelectedElement("locatorList");
    if (selectedElement) {
      let prevSibling = selectedElement.previousElementSibling;
      if (prevSibling) {
        $(selectedElement).insertBefore(prevSibling);
      }
    }
    setIsChange(true);
  });
  $("#locator-move-down-btn").click(function () {
    let selectedElement = getSelectedElement("locatorList");
    if (selectedElement) {
      let nextSibling = selectedElement.nextElementSibling;
      if (nextSibling) {
        $(selectedElement).insertAfter(nextSibling);
      }
    }
    setIsChange(true);
  });
  $("#remove-exclude-btn").click(function () {
    let selectedElement = getSelectedElement("excludeCommandList");
    if (selectedElement) {
      $(selectedElement).remove();
    }
    setIsChange(true);
  });
  $("#add-exclude-btn").click(function () {
    $("#excludeCommandList").prepend($(`
        <tr id="temp-row">
            <td>
                <input id="new-exclude-command" style='width: 100%' type='text'/>
            </td>
        </tr>`));
    $("#new-exclude-command").on('keyup', function (e) {
      //handle enter key
      if (e.key === 'Enter' || e.keyCode === 13) {
        if ($(e.target).val() === "") {
          return;
        }
        let tr = $(`
                    <tr class="ui-sortable-handle">
                        <td>
                            ${$(e.target).val()}
                        </td>
                    </tr>
                `);
        tr.click(function () {
          clickElementInListHandler("excludeCommandList", this);
        });
        $("#excludeCommandList").prepend(tr);
        $("#temp-row").remove();
        setIsChange(true);
      }
    });
  });
}

function getElementList(listID) {
  let resultList = [];
  $(`#${listID}`).children().each((i, element) => {
    resultList.push(element.innerText)
  });
  return resultList;
}

class SelfHealingSettingTab { //Implements ISettingTab
  constructor(containerElement) {
    this.containerElement = containerElement;
  }

  async initialize() {
    makeTableSortable("locatorList");
    makeTableSortable("excludeCommandList");
    attachButtonEvent();
    await renderDataSetting();
  }

  getContent() {
    return `
        <div id="self-healing-content" style="display: none">
        <h1>Self Healing</h1>
        <div>
            <input type="checkbox" id="enable-self-healing" name="enable-self-healing">
            <label for="enable-self-healing">Enable self-healing execution</label>
        </div>
        <br>
        <h3>Select and prioritize element locator methods</h3>
        <div>
            <button id="locator-move-up-btn" class="ui-button">Move up</button>
            <button id="locator-move-down-btn" class="ui-button">Move down</button>
        </div>
        <div id="locatorContainer">
            <table id="locatorTable" class="tablesorter">
                <tbody id="locatorList" class="ui-sortable">
                    
                </tbody>
            </table>
        </div>
        <br>
        <h3>Exclude commands from self healing</h3>
        <div>
            <button id="add-exclude-btn" class="ui-button">Add</button>
            <button id="remove-exclude-btn" class="ui-button">Remove</button>
        </div>
        <div id="excludeCommandContainer">
            <table id="excludeCommandTable" class="tablesorter">
                <tbody id="excludeCommandList" class="ui-sortable">
                
                </tbody>
            </table>
        </div>
    </div>`;
  }

  async saveData() {
    let enable = $("#enable-self-healing").prop("checked");
    let locator = getElementList("locatorList");
    let excludeCommands = getElementList("excludeCommandList");
    let self_healing = {
      enable,
      locator,
      excludeCommands,
    }
    let settingData = await browser.storage.local.get("setting");
    settingData = settingData.setting ?? {};
    Object.assign(settingData["self-healing"], self_healing);
    browser.storage.local.set({ setting: settingData });
  }

  display() {
    for (let child of $(this.containerElement).children()) {
      $(child).hide();
    }
    $("#self-healing-content").show();
  }
}

export { SelfHealingSettingTab }