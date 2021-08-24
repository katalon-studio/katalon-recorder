import {StateMachine} from "../../services/onboarding-service/state-machine.js";
import {addOnboardingSampleData} from "../../services/onboarding-service/onboarding-sample-data.js";
import {TourService} from "../../services/onboarding-service/tour-service.js";
import {stateMapping} from "../../services/onboarding-service/state-mapping.js";
import {initialStateMachineDefinition} from "../../services/onboarding-service/essential-product-tours-state-machine.js";

function isObjectEmpty(obj){
    return obj &&
        Object.keys(obj).length === 0 &&
        obj.constructor === Object
}

async function isUserFirstTimeUsing() {
    let isFinnish = false;
    let isUpdate = false;
    const finnishOnboarding = await browser.storage.local.get("finnishOnboarding");
    let tracking = await browser.storage.local.get("tracking");
    if (!isObjectEmpty(finnishOnboarding)) {
        isFinnish = true;
    }
    if (!isObjectEmpty(tracking)){
        isUpdate = tracking.isUpdated ?? false;
    }
    return !(isFinnish || isUpdate);

}

export function startEssentialProductTours(forExistingUser) {
    let machine = new StateMachine(initialStateMachineDefinition);
    let tourService = new TourService(machine, stateMapping, forExistingUser);
    machine.addSubscriber(tourService);
    machine.transit(machine.currentState, "dialog");
}

//need to wait for document to finish loading
//since sample data is only loaded when document has finish loading


//See KR-129 for more details why we remove onboarding tour
/*isUserFirstTimeUsing().then((result) => {
    if (result) {
        $((_) => {
            addOnboardingSampleData().then((value) =>
                startEssentialProductTours(false)
            );
        });
    }
});*/
