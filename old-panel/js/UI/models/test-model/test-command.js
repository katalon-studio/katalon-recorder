/**
 * Class represents test command  that currently loaded when KR is running
 */
class TestCommand {
  /**
   * Create a TestCommand
   *
   * @param {string} name
   * @param {string} defaultTarget
   * @param {string[]} targets
   * @param {string} value
   */
  constructor(name = "", defaultTarget = "", targets = [], value = "") {
    this.name = name;
    this.defaultTarget = defaultTarget;
    this.targets = targets;
    this.value = value;
  }
}

export { TestCommand }