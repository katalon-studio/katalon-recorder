import { Interface } from "../base-model/base-interface.js";
import { ICommand } from "../base-model/command-interface.js";


/**
 * @class
 * @classdesc a Decorator for command that allows Undo and Redo feature
 */
class ReversibleCommandDecorator { //Implement ICommand, IReversibleCommand
    /**
     * @param command - command implement ICommand
     * @param {CommandHistory} commandHistory - object of CommandHistory class
     * @param {function} extractStateFunction - function to get old state before executing command
     * @param {function} restoreStateFunction - function to restore old state before executing
     */
    constructor(command, commandHistory, extractStateFunction, restoreStateFunction) {
        Interface.ensureImplement(command, [ICommand])
        this.command = command;
        this.commandHistory = commandHistory;
        this.undoState = [];
        this.redoState = [];
        this.timeStamp = Date.now();
        this.extractStateFunction = extractStateFunction;
        this.restoreStateFunction = restoreStateFunction;
    }
    execute() {
        this.undoState = this.extractStateFunction();
        this.command.execute();
        this.commandHistory.pushToUndoStack(this);
    }

    undo() {
        this.redoState = this.extractStateFunction();
        this.restoreStateFunction(this.undoState);
    }

    redo() {
        this.undoState = this.extractStateFunction();
        this.restoreStateFunction(this.redoState);
    }

}

export { ReversibleCommandDecorator };