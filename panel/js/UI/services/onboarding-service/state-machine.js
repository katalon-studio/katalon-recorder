//implemented based on https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript
import { Interface } from "../../../../../interface/Interface.js";
import { ISubscriber } from "../../../../../interface/ISubscriber.js";

class Publisher {
  //implements IPublisher
  constructor() {
    this.subscribers = [];
  }

  addSubscriber(subscriber) {
    Interface.ensureImplement(subscriber, [ISubscriber]);
    this.subscribers.push(subscriber);
  }

  removeSubscriber(subscriber) {
    Interface.ensureImplement(subscriber, [ISubscriber]);
    const index = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(index, 1);
  }

  notify(data) {
    this.subscribers.forEach((sub) => {
      sub.update(data);
    });
  }
}

class StateMachine extends Publisher {
  constructor(definition) {
    super();
    this.definition = definition;
    this.currentState = definition.initialState;
  }

  transit(currentState, event) {
    const currentStateDefinition = this.definition[currentState];
    const transition = currentStateDefinition.transitions[event];
    if (!transition) {
      return;
    }
    this.currentState = transition.target;
    this.notify(this.currentState);
    return this.currentState;
  }
  peekNextState(currentState, event) {
    const currentStateDefinition = this.definition[currentState];
    const transition = currentStateDefinition.transitions[event];
    if (!transition) {
      return;
    }
    return transition.target;
  }
}

export { StateMachine };
