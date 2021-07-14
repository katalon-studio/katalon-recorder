import { Interface } from "./Interface.js";

const IReversibleCommand = new Interface("IReversibleCommand", ["undo", "redo"]);

export { IReversibleCommand };