import { portSettingTab, selfHealingSettingTab } from "../setting-panel.js";

const treeDataStructure = [
  {
    id: "KSPort",
    name: "Katalon Studio Port",
  },
  {
    id: "selfHealing",
    name: "Self Healing"
  },
];

function generateMenuTree() {
  $("#menu-tree-view").tree({
    data: treeDataStructure,
  });
  $('#menu-tree-view').on(
    'tree.click',
    function (event) {
      switch (event.node.id) {
        case "KSPort":
          portSettingTab.display();
          break;
        case "selfHealing":
          selfHealingSettingTab.display();
          break;
      }
    }
  );
}


export { generateMenuTree }