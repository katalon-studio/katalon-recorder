import {trackingSegment} from "../../services/tracking-service/segment-tracking-service.js";

class RedoCommand { //implements ICommand
    constructor(commandHistory) {
        this.commandHistory = commandHistory;
        this.timeStamp = Date.now();
    }

    execute() {
        const lastCommand = this.commandHistory.popFromRedoStack();
        if (lastCommand) {
            this.commandHistory.pushToUndoStack(lastCommand);
            lastCommand.redo();
            trackingSegment("kru_redo");
        }
    }
}

export { RedoCommand }
