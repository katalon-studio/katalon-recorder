import { Interface } from "../../models/base-model/base-interface.js";
import { ICommand } from "../../models/base-model/command-interface.js";
import { IReversibleCommand } from "../../models/base-model/reversible-command-interface.js";

class CommandHistory {
    constructor() {
        this.limit = 100;
        this.undoStack = [];
        this.redoStack = [];
    }

    _isCommandExistedInRedoStack(command) {
        const latestCommand = this.redoStack[0];
        if (!latestCommand) return false;
        return command.timeStamp <= latestCommand.timeStamp;
    }


    pushToUndoStack(command) {
        Interface.ensureImplement(command, [ICommand, IReversibleCommand]);
        //check if the command is new then reset redo stack
        if (!this._isCommandExistedInRedoStack(command)) {
            this.redoStack = [];
        }
        this.undoStack.push(command);
        if (this.undoStack.length > this.limit) {
            this.undoStack.shift();
        }
    }

    popFromUndoStack() {
        let lastCommand = this.undoStack.pop();
        if (lastCommand) {
            this.redoStack.push(lastCommand);
        }
        return lastCommand;
    }

    popFromRedoStack() {
        return this.redoStack.pop();
    }
}

const commandHistory = new CommandHistory();
const selfHealingCommandHistory = new CommandHistory();

export { commandHistory, selfHealingCommandHistory };