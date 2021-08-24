import {selfHealingContextMenu} from "../../view/self-healing/self-healing-context-menu.js";
import {generateApproveChangeCommand, generateFilterSelfHealingProposalByTestCaseStatusCommand} from "../../services/self-healing-service/self-healing-tab-command-generators.js";


$(document).ready(function () {
    $("#log-section").append(selfHealingContextMenu.getContainer());
    $("#self-healing-approve-btn").click(function () {
        let approveChangeCommand = generateApproveChangeCommand();
        approveChangeCommand.execute();
    });
    document.addEventListener("click", function (e) {
        //unselect self healing row when not click on #selfHealingList
        let target = e.target;
        let selfHealingList = $("#selfHealingList")[0];
        if (!selfHealingList.contains(target)) {
            $(selfHealingList).find(".selected").each((index, element) => {
                $(element).removeClass("selected");
            });
        }
    });
    $("#select-self-healing-test-status select").change(function () {
        let userSelection = $(this).val();
        let filterTestCaseCommand = generateFilterSelfHealingProposalByTestCaseStatusCommand(userSelection)();
        filterTestCaseCommand.execute();
    });
});

