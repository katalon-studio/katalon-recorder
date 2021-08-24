import { MenuItem } from "../../models/menu/menu-item.js";
import { generateDeleteSelectedSelfHealingProposalCommand, generateSelectAllSelfHealingProposalCommand } from "../../services/self-healing-service/self-healing-tab-command-generators.js";
import { Menu } from "../../models/menu/menu.js";



const selectAllRow = new MenuItem("self-healing-select-all", `Select All <span class="hotKey">Ctrl/Cmd+A</span>`, generateSelectAllSelfHealingProposalCommand);
const deleteSelfHealingRow = new MenuItem("self-healing-remove", `Remove Self Healing Item`, generateDeleteSelectedSelfHealingProposalCommand);
const selfHealingContextMenu = new Menu("self-healing-context-menu");
selfHealingContextMenu.add(selectAllRow);
selfHealingContextMenu.add(deleteSelfHealingRow);

export { selfHealingContextMenu };