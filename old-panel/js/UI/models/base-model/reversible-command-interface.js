import { Interface } from "./base-interface.js";

const IReversibleCommand = new Interface("IReversibleCommand", ["undo", "redo"]);

export { IReversibleCommand };