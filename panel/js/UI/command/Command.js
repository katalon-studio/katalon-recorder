class Command { //Implement ICommand
    constructor(action, ...params) {
        this.timeStamp = Date.now();
        this.action = action;
        this.params = params;
    }
    execute() {
        this.action(...this.params);
    }
}

export { Command };