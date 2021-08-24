import { createNewTour } from "./custom-bootstrap-tour.js";
import { trackingSegment } from "../tracking-service/segment-tracking-service.js";
import {
  displayFinishDialog,
  displayWelcomeDialog,
  displayWelcomeDialogForExistingUsers,
} from "../../view/onboarding/onboarding-view.js";

class TourService {
  //Implement ISubscriber
  constructor(stateMachine, stateMapping, isForExistingUser) {
    this.stateMachine = stateMachine;
    this.stateMapping = stateMapping;
    this._tour = createNewTour();
    this._initTour();
    this.userChoice = "";
    this.exitPoint = "";
    this.isForExistingUser = isForExistingUser ? isForExistingUser : false;
  }

  update(data) {
    if (data === "dialog") {
      this._startTour();
    } else if (data === "end") {
      this._endTour();
    } else {
      let { prev, current, next } =
        this._mappingCurrentAndNextAndPreviousElements(data);
      this.setFocus(prev, current, next);
      this._tour.goTo(1);
    }
  }

  _endTour() {
    let action = {
      exit_point: this.exitPoint,
      is_new_user: this.isForExistingUser ? false : true
    };
    if (this.userChoice === "normalUser" || this.userChoice === "tester") {
      action["user_type"] = this.userChoice;
      displayFinishDialog();
    }
    trackingSegment("kru_onboarding", action);
    browser.storage.local.set({ finnishOnboarding: true });
  }

  _initTour() {
    this._tour.setOnBeforeNext((tour) => {
      this.stateMachine.transit(this.stateMachine.currentState, "next");
    });

    this._tour.setOnBeforePrev((tour) => {
      this.stateMachine.transit(this.stateMachine.currentState, "prev");
    });

    this._tour._options.onEnd = () => {
      this.exitPoint = this.stateMachine.currentState;
      this.stateMachine.transit(this.stateMachine.currentState, "end");
    };
    this._tour.init();
  }

  async _startTour() {
    this.userChoice = this.isForExistingUser
      ? await displayWelcomeDialogForExistingUsers()
      : await displayWelcomeDialog();

    switch (this.userChoice) {
      case "normalUser":
        this.stateMachine.transit(
          this.stateMachine.currentState,
          "chooseAsUser"
        );
        break;
      case "tester":
        this.stateMachine.transit(
          this.stateMachine.currentState,
          "chooseAsTester"
        );
        break;
      case "explore":
        this.exitPoint = "explore";
        this.stateMachine.transit(this.stateMachine.currentState, "end");
        break;
      case "other":
        this.exitPoint = "other use case";
        this.stateMachine.transit(this.stateMachine.currentState, "end");
        break;
    }
  }

  _mappingCurrentAndNextAndPreviousElements(state) {
    let nextState = this.stateMachine.peekNextState(state, "next");
    let prevState = this.stateMachine.peekNextState(state, "prev");

    let current = this.stateMapping[state];
    let next = this.stateMapping[nextState];
    let prev = this.stateMapping[prevState];
    return { prev, current, next };
  }

  endTour() {
    this._tour.end();
    this.stateMachine.transit(this.stateMachine.currentState, "end");
  }

  setFocus(prevElement, currentElement, nextElement) {
    this._tour.setFocus(prevElement, currentElement, nextElement);
  }
}

export { TourService };
