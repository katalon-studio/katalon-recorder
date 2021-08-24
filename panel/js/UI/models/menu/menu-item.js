import { Interface } from "../base-model/base-interface.js";
import { ICommand } from "../base-model/command-interface.js";

class MenuItem {// implements Composite Inter
    constructor(id, htmlString, commandGenerator) {

        this.id = id;
        this.element = document.createElement('li');
        this.element.style.display = 'none';
        this.element.id = this.id;
        this.anchor = document.createElement('a');
        this.anchor.href = '#'; // To make it clickable.
        this.element.appendChild(this.anchor);
        this.anchor.innerHTML = htmlString;

        this.element.addEventListener('click', function (e) { // Invoke the command on click.
            e.stopPropagation();
            let command = commandGenerator();
            Interface.ensureImplement(command, [ICommand]);
            command.execute();
        }, false);
    }

    add() { }
    remove() { }
    getChild() { }
    getElement() {
        return this.element;
    }
    show() {
        this.element.style.display = 'block';
    }
}

export { MenuItem }