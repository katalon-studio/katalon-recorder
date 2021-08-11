import {trackingSegment} from "../../tracking/segment-tracking-service.js";

class UndoCommand { //implements ICommand
    constructor(commandHistory) {
        this.commandHistory = commandHistory;
        this.timeStamp = Date.now();
    }

    execute() {
        const lastCommand = this.commandHistory.popFromUndoStack();
        if (lastCommand) {
            lastCommand.undo();
            trackingSegment("kru_undo");
        }

    }
}

export { UndoCommand };