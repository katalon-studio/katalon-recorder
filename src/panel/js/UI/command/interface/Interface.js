class Interface {
    constructor(name, methods) {
        if (arguments.length !== 2) {
            throw new Error(`Interface constructor called with ${arguments.length} 
							arguments, but expected exactly 2.`)
        }
        this.name = name;
        this.methods = [];
        methods.forEach(method => {
            if (typeof method !== 'string') {
                throw new Error(`Interface constructor expects method names to be 
												 passed in as a string.`);
            }
            this.methods.push(method);
        });
    }
}

Interface.ensureImplement = function (object, interfaces) {
    if (arguments.length < 2) {
        throw new Error(`Function Interface.ensureImplements called with 
										${arguments.length} arguments, but expected at least 2.`);
    }
    //interface is reserved keyword in strict mode
    interfaces.forEach(inter => {
        if (inter.constructor !== Interface) {
            throw new Error(`Function Interface.ensureImplements expects arguments
												 two and above to be instances of Interface.`)
        }
        inter.methods.forEach(method => {
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error(`Function Interface.ensureImplements: object 
								does not implement the ${inter.name} 
								interface. Method ${method} was not found.`);
            }
        });
    });
}

export { Interface };