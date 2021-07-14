import {MenuItem} from "../../UI/context-menu/menu/MenuItem.js";
import {generateDeleteSelectedSelfHealingProposalCommand, generateSelectAllSelfHealingProposalCommand} from "../service/self-healing-tab-command-generators.js";
import {Menu} from "../../UI/context-menu/menu/Menu.js";



const selectAllRow = new MenuItem("self-healing-select-all", `Select All <span class="hotKey">Ctrl/Cmd+A</span>`, generateSelectAllSelfHealingProposalCommand);
const deleteSelfHealingRow = new MenuItem("self-healing-remove", `Remove Self Healing Item`, generateDeleteSelectedSelfHealingProposalCommand);
const selfHealingContextMenu = new Menu("self-healing-context-menu");
selfHealingContextMenu.add(selectAllRow);
selfHealingContextMenu.add(deleteSelfHealingRow);

export {selfHealingContextMenu};