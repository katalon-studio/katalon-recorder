import { ReversibleCommandDecorator } from "../../models/command/reversible-command-decorator.js";
import { selfHealingCommandHistory as commandHistory } from "../records-grid-service/command-history.js";
import { Command } from "../../models/command/command.js";
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
import { UndoCommand } from "../../models/command/undo-command.js";
import { RedoCommand } from "../../models/command/redo-command.js";


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