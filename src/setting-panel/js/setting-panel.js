import { KSPortSettingTab } from "./setting-tabs/KS-port-setting-tab.js";
import { SelfHealingSettingTab } from "./setting-tabs/self-healing-setting-tab.js";
import { generateMenuTree } from "./UI/menu-tree.js";
import { displayConfirmCloseDialog } from "./UI/confirm-close-dialog.js";
import { Interface } from "../../interface/Interface.js";
import { ISettingTab } from "./setting-tabs/ISettingTab.js";

const container = $("#content");
const selfHealingSettingTab = new SelfHealingSettingTab(container);
const portSettingTab = new KSPortSettingTab(container);

Interface.ensureImplement(portSettingTab, [ISettingTab]);
Interface.ensureImplement(selfHealingSettingTab, [ISettingTab]);

let isChange = false;

const setIsChange = (value) => {
  isChange = value;
}

function generateUI() {
  generateMenuTree();
  container.append(selfHealingSettingTab.getContent());
  container.append(portSettingTab.getContent());
}

async function saveData() {
  portSettingTab.saveData();
  await selfHealingSettingTab.saveData();
}

function attachButtonEvent() {
  $("#save-btn").click(function () {
    setIsChange(false);
    saveData().then(() => {
      alert("Save successfully");
    });
  });

  $("#close-btn").click(function () {
    if (!isChange) {
      window.close();
      return;
    }
    displayConfirmCloseDialog().then(async (result) => {
      switch (result) {
        case "yes":
          await saveData();
          window.close();
          break;
        case "no":
          window.close();
      }
    });
  });
}

async function initialize() {
  portSettingTab.initialize();
  await selfHealingSettingTab.initialize();
}

function displayFirstTab() {
  const menuTree = $("#menu-tree-view");
  const node = menuTree.tree('getNodeById', "KSPort");
  menuTree.tree('selectNode', node);
  portSettingTab.display();
}

$(document).ready(function () {
  generateUI();
  attachButtonEvent();
  initialize().then(displayFirstTab);
});

export { setIsChange }
export { selfHealingSettingTab, portSettingTab }