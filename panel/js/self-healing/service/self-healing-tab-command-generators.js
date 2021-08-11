import { ReversibleCommandDecorator } from "../../UI/command/ReversibleCommandDecorator.js";
import { selfHealingCommandHistory as commandHistory } from "../../UI/service/command-history.js";
import {Command} from "../../UI/command/Command.js";
import {
  approveSelfHealingProposalAction,
  deleteSelectSelfHealingProposalsAction,
  filterSelfHealingProposalByTestCaseStatusAction,
  selectAllSelfHealingProposalAction
} from "./self-healing-tab-command-actions.js";
import {
  captureSelfHealingListState,
  captureSelfHealingWhenApproveChange,
  restoreSelfHealingListState,
  restoreSelfHealingWhenApproveChange
} from "./self-healing-tab-state-actions.js";
import { UndoCommand } from "../../UI/command/UndoCommand.js";
import { RedoCommand } from "../../UI/command/RedoCommand.js";


const generateDeleteSelectedSelfHealingProposalCommand = () => new ReversibleCommandDecorator(
  new Command(deleteSelectSelfHealingProposalsAction),
  commandHistory,
  captureSelfHealingListState,
  restoreSelfHealingListState
);

const generateSelectAllSelfHealingProposalCommand = () => new Command(selectAllSelfHealingProposalAction);
const generateApproveChangeCommand = () => new ReversibleCommandDecorator(
  new Command(approveSelfHealingProposalAction),
  commandHistory,
  captureSelfHealingWhenApproveChange,
  restoreSelfHealingWhenApproveChange
);

const generateUndoCommand = () => new UndoCommand(commandHistory);
const generateRedoCommand = () => new RedoCommand(commandHistory);

const generateFilterSelfHealingProposalByTestCaseStatusCommand = (testCaseStatus) => {
  return () => new Command(filterSelfHealingProposalByTestCaseStatusAction, testCaseStatus);
}


export {
  generateDeleteSelectedSelfHealingProposalCommand,
  generateUndoCommand,
  generateRedoCommand,
  generateSelectAllSelfHealingProposalCommand,
  generateApproveChangeCommand,
  generateFilterSelfHealingProposalByTestCaseStatusCommand
}
