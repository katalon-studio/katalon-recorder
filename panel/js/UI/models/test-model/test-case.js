import { generateUUID } from "../../services/helper-service/utils.js";

/**
 * Class represent test case that currently loaded when KR is running
 */
class TestCase {
    /**
     * Create a TestCase
     * TestCase's id will be an UUID string
     * @param {string} name - Test case name
     * @param {TestCommand[]} commands - List of commands belonging to test case
     */
    constructor(name = "", commands = []) {
        this.id = generateUUID();
        this.name = name;
        this.commands = commands;
    }

    /***
     *
     * @returns {number}
     */
    getTestCommandCount() {
        return this.commands.length;
    }

    insertCommandToIndex(index, testCommand) {
        this.commands.splice(index, 0, testCommand);
    }

    removeCommandAtIndex(index) {
        return this.commands.splice(index, 1)[0];
    }
}

export { TestCase }