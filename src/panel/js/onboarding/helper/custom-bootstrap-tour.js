Tour.onBeforeNext = function (tour) {};
Tour.onBeforePrev = function (tour) {};
Tour.prototype._showNextStep = function () {
  this.onBeforeNext(this);
};

Tour.prototype._showPrevStep = function () {
  this.onBeforePrev(this);
};

Tour.prototype.setFocus = function (prevElement, currentElement, nextElement) {
  if (!nextElement) {
    currentElement.next = -1;
    nextElement = {
      prev: 1,
    };
  }
  if (!prevElement) {
    currentElement.prev = -1;
    //the reason why prev.next = 1
    //after onBeforeNext is done
    //and the next step has undefined prev step
    //the steps list will be as following [{next:1}, current, next]
    //and the current step will be set back to 0
    //Because onBeforeNext is invoked before the actual next promise get invoke
    //and the next promise need currentStep has next property to point to the current
    prevElement = {
      next: 1,
    };
  }
  this._options.steps = [prevElement, currentElement, nextElement];
};

function addStepsAfterCurrentStep(steps) {
  if (!tour.ended()) {
    let currentStep = tour.getCurrentStep();
    addStepsToStartedTour(steps, currentStep + 1);
    return currentStep + 1;
  }
}

function addStepAfterCurrentStep(step) {
  if (!tour.ended()) {
    let currentStep = tour.getCurrentStep();
    addStepToStartedTour(step, currentStep + 1);
    return currentStep + 1;
  }
}

function addStepToStartedTour(step, index) {
  if (!tour.ended()) {
    tour._options.steps.splice(index, 0, step);
    tour.init();
  }
}

function addStepsToStartedTour(steps, index) {
  if (!tour.ended()) {
    tour._options.steps.splice(index, 0, ...steps);
    tour.init();
  }
}

const createNewTour = (tourOption) => {
  let defaultOption = {
    backdrop: true,
    storage: false,
    debug: false,
    delay: 0,
    template: `<div class='popover tour' style="color: black!important;">
      <div class='arrow'></div>
      <h3 class='popover-title'></h3>
      <div class='popover-content'></div>
      <nav class='popover-navigation'>
        <div class='btn-group'>
          <button class='btn btn-default' data-role='prev'>« Prev</button>
          <button class='btn btn-default' data-role='next'>Next »</button>
        </div>
        <button class='btn btn-default' id="onboarding-end-btn" data-role='end'>End tour</button>
      </nav>
    </div>`,
    //this will make the "end tour" button to disappear - See KR 84 for more detail
    //be careful: this property can be overridden
    onShown: (tour) => {
      $("#onboarding-end-btn").hide();
    }
  }
  tourOption = tourOption ?? defaultOption;
  let tour = new Tour(tourOption);

  tour.setOnBeforeNext = (fn) => {
    tour.onBeforeNext = fn;
  };
  tour.setOnBeforePrev = (fn) => {
    tour.onBeforePrev = fn;
  };
  return tour;
};

export { createNewTour };
