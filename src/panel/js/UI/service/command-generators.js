import { commandHistory } from "./command-history.js";
import { UndoCommand } from "../command/UndoCommand.js";
import { RedoCommand } from "../command/RedoCommand.js";
import { ReversibleCommandDecorator } from "../command/ReversibleCommandDecorator.js";
import { Command } from "../command/Command.js";
import {
  addAction,
  changeCommandTargetAction,
  copyAction,
  deleteAllAction,
  deleteSelectedAction,
  pasteAction,
  playCommandAction,
  playFromHereAction,
  selectAllAction,
  setBreakpointAction
} from "./actions.js";
import {
  extractInformationFromRecordGrid,
  extractRecordGridWhenEditCommandToolBar,
  restoreRecords
} from "./state-actions.js"


const generateAddCommand = () => new ReversibleCommandDecorator(new Command(addAction), commandHistory, extractInformationFromRecordGrid, restoreRecords);
const generateDeleteAllCommand = () => new ReversibleCommandDecorator(new Command(deleteAllAction), commandHistory, extractInformationFromRecordGrid, restoreRecords);
const generateCopyCommand = () => new Command(copyAction);
const generatePasteCommand = () => new ReversibleCommandDecorator(new Command(pasteAction), commandHistory, extractInformationFromRecordGrid, restoreRecords);
const generateSetBreakpointCommand = () => new ReversibleCommandDecorator(new Command(setBreakpointAction), commandHistory, extractInformationFromRecordGrid, restoreRecords);
const generateDeleteSelectedCommand = () => new ReversibleCommandDecorator(new Command(deleteSelectedAction), commandHistory, extractInformationFromRecordGrid, restoreRecords);
const generateUndoCommand = () => new UndoCommand(commandHistory);
const generateRedoCommand = () => new RedoCommand(commandHistory);


const generatePlayFromHereCommand = (index) => {
  return () => new Command(playFromHereAction, index);
}
const generatePlaySpecificRecordCommand = (index) => {
  return () => new Command(playCommandAction, index);
}

const generateSelectAllCommand = () => new Command(selectAllAction);

const generateEditCommandToolbarCommand = (commandToolbarID) => {
  return new ReversibleCommandDecorator(
    new Command(_ => {
    }),
    commandHistory,
    () => {
      return extractRecordGridWhenEditCommandToolBar(commandToolbarID);
    },
    restoreRecords
  );
}

const generateEditTargetToolbarCommand = (oldValue) => {
  return new ReversibleCommandDecorator(
    new Command(changeCommandTargetAction, oldValue),
    commandHistory,
    () => {
      return extractRecordGridWhenEditCommandToolBar("command-target");
    },
    restoreRecords
  );
}

const generateDropdownCommandToolbarCommand = () => {
  return new ReversibleCommandDecorator(
    new Command(() => {
    }),
    commandHistory,
    extractInformationFromRecordGrid,
    restoreRecords
  );
}

const generateDragAndDropCommand = () => {
  return new ReversibleCommandDecorator(
    new Command(_ => {
    }),
    commandHistory,
    extractInformationFromRecordGrid,
    restoreRecords);
}


export {
  generateAddCommand,
  generateDeleteAllCommand,
  generateCopyCommand,
  generatePasteCommand,
  generateSetBreakpointCommand,
  generateDeleteSelectedCommand,
  generatePlayFromHereCommand,
  generatePlaySpecificRecordCommand,
  generateUndoCommand,
  generateRedoCommand,
  generateSelectAllCommand,
  generateEditCommandToolbarCommand,
  generateDropdownCommandToolbarCommand,
  generateDragAndDropCommand,
  generateEditTargetToolbarCommand
}