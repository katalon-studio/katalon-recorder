import { Interface } from "../base-model/base-interface.js";
import { IComposite } from "../base-model/composite-interface.js";
import { IMenuObject } from "../base-model/menu-object-interface.js";


class Menu { //implement Composite, MenuObject
    constructor(id) {
        this.id = id;
        this.items = {};
        this.container = document.createElement("div");
        this.container.id = id;
        this.container.style.display = "none";
        this.container.classList.add("menu");
        this.element = document.createElement("ul");
        this.container.appendChild(this.element);
    }
    add(menuItemObject) {
        Interface.ensureImplement(menuItemObject, [IComposite, IMenuObject]);
        this.items[menuItemObject.id] = menuItemObject;
        this.element.appendChild(menuItemObject.getElement());
    }
    remove(id) {
        if (this.items[id]) {
            this.element.removeChild(this.items[id].getElement());
            delete this.items[id];
        }
    }
    getChild(id) {
        return this.items[id];
    }
    getElement() {
        return this.element;
    }
    getContainer() {
        return this.container;
    }

    show() {
        this.container.style.display = "block"
        this.element.style.display = 'block';
        for (let id in this.items) { // Pass the call down the composite.
            this.items[id].show();
        }
    }
}

export { Menu }