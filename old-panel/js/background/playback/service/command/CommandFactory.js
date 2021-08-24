import { Command } from "../../../../UI/models/command/command.js";
import { recordAction } from "../actions/record-actions.js";
import {
  executeCommandAction,
  pauseAction,
  playTestAllTestSuitesAction,
  playTestCaseAction,
  playTestSuiteAction,
  resumeAction,
  stopAction
} from "../actions/play/play-actions.js";
import { selectElementAction, showElementAction } from "../actions/element-actions.js";

class CommandFactory {
  constructor() {
  }

  createCommand(type, ...args) {
    switch (type) {
      case "record":
        return new Command(recordAction);
      case "playTestCase":
        return new Command(playTestCaseAction);
      case "playTestSuite":
        return new Command(playTestSuiteAction);
      case "playAll":
        return new Command(playTestAllTestSuitesAction);
      case "stop":
        return new Command(stopAction);
      case "resume":
        return new Command(resumeAction);
      case "pause":
        return new Command(pauseAction);
      case "showElement":
        return new Command(showElementAction);
      case "selectElement":
        return new Command(selectElementAction);
      case "executeTestStep":
        return new Command(executeCommandAction, args[0]);
      default:
        throw `${type} is not supported`;
    }
  }
}

const commandFactory = new CommandFactory();

export { commandFactory }