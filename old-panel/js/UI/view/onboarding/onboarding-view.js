import shuffle from "../../services/onboarding-service/shuffle.js";

const searchedTrackingInput = `<input type="radio" name="tracking" value="searched">
<label for="searched">Through Google search for an automation solution.</label>
</br>`;

const alternativedTrackingInput = `<input type="radio" name="tracking" value="alternatived">
<label for="alternatived">Through searches for Selenium IDE alternatives.</label>
</br>`;

const referredTrackingInput = ` <input type="radio" name="tracking" value="referred">
<label for="referred">Referred by friends/colleagues.</label>
</br>`;

const normalUserOnBoardingInput = `<input type="radio" name="onBoarding" value="normalUser">
<label for="normalUser">Automate repetitive tasks.</label>
</br>`;

const testerOnBoardingInput = ` <input type="radio" name="onBoarding" value="tester">
<label for="tester">Perform automated testing.</label>
</br>`;

const otherOnBoardingInput = `<input type="radio" name="onBoarding" value="other">
<label for="other">Other use case.</label>
</br>`;

const getCommonStyledHtmlString = (htmlString) =>
    `
<style>
div {
  font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
  font-size: 13px;
}
</style>
` + htmlString;

/**
 * This dialog allows existing users to view the essential product tours
 * @returns A promise that resolves to the type of the product tours chosen by the users
 */
function displayWelcomeDialogForExistingUsers() {
    function displayDialog(resolve) {
        let onBoardingInputList = [
            normalUserOnBoardingInput,
            testerOnBoardingInput,
            otherOnBoardingInput,
        ];
        onBoardingInputList = shuffle(onBoardingInputList);
        const welcomeHTML = getCommonStyledHtmlString(
            `
            <form>
            <div style='text-align:center'>
                <h1 style>Have you grasped all the fundamentals?</h1>
            </div>
            <p>This product tours guide you through the indispensible features of Katalon Recorder.</p>
           
            <p>What are you already using Katalon Recorder for?</p>
            ${onBoardingInputList[0]}
            ${onBoardingInputList[1]}
            ${onBoardingInputList[2]}
            </div>
            <br/>
            </form>`
        );
        let dialog = $('<div id="onboarding-welcome-dialog"></div>')
            .html(welcomeHTML)
            .dialog({
                title: "Essential Features Walkthrough",
                resizable: false,
                height: "auto",
                width: 450,
                modal: true,
                buttons: {
                    "Let me explore on my own": {
                        text: "Let me explore on my own",
                        id: "explore",
                        click: (_) => {
                            resolve("explore");
                            $(dialog).dialog("close");
                        },
                    },
                    "Start Onoarding": {
                        text: "Show me the features",
                        id: "onBoarding",
                        click: (_) => {
                            let userChoiceInput = $(
                                "input:radio[name=onBoarding]:checked"
                            ).val();
                            console.log(userChoiceInput);
                            if (userChoiceInput) {
                                resolve(userChoiceInput);
                                $(dialog).dialog("close");
                                $(dialog).dialog('destroy').remove();
                            }
                        },
                    },
                },
                open: function () {
                    $("#onBoarding").focus();
                },
            });
        $("input:radio[name=onBoarding]").click((e) => {
            let targetValue = e.target.value;

            if (targetValue === "other") {
                $("#onBoarding").prop("disabled", true).addClass("ui-state-disabled");
            } else {
                $("#onBoarding")
                    .prop("disabled", false)
                    .removeClass("ui-state-disabled");
            }
        });
    }

    return new Promise((resolve, reject) => {
        displayDialog(resolve);
    });
}

/**
 * This dialog allows new users to view the essential product tours
 * @returns A promise that resolves to the type of the product tours chosen by the users
 */
function displayWelcomeDialog() {
    function displayDialog(resolve) {
        /*See KR 84 for more details
        let trackingInputList = [
          searchedTrackingInput,
          alternativedTrackingInput,
          referredTrackingInput,
        ];
        trackingInputList = shuffle(trackingInputList);*/
        let onBoardingInputList = [
            normalUserOnBoardingInput,
            testerOnBoardingInput,
            //otherOnBoardingInput,
        ];
        onBoardingInputList = shuffle(onBoardingInputList);

        const welcomeHTML = getCommonStyledHtmlString(`
            <form>
            <div style='text-align:center'>
                <h1>Welcome to Katalon Recorder</h1>
            </div>
            <p>We are excited to have you here!</p> 
            <p>Tell us what you are going to use KR for and we'll guide you through the essential features.</p> 
            <p>There will be useful info, so if these options are not exactly right then choose the one closest to your purpose.</p>
            ${onBoardingInputList[0]}
            ${onBoardingInputList[1]}
            </div>
            <br/>
            </form>`);
        let dialog = $('<div id="onboarding-welcome-dialog"></div>')
            .html(welcomeHTML)
            .dialog({
                title: "Essential Features Walkthrough",
                resizable: false,
                height: "auto",
                width: 450,
                modal: true,
                buttons: {
                    /*"Let me explore on my own": {
                      text: "Let me explore on my own",
                      id: "explore",
                      click: (_) => {
                        let userChoiceInput = $(
                          "input:radio[name=onBoarding]:checked"
                        ).val();
                        if (userChoiceInput === "other") {
                          resolve("other");
                        } else {
                          resolve("explore");
                        }
                        $(dialog).dialog("close");
                      },
                    },*/
                    "Start On Boarding": {
                        text: "Get started",
                        id: "onBoarding",
                        click: (_) => {
                            let userChoiceInput = $(
                                "input:radio[name=onBoarding]:checked"
                            ).val();
                            if (userChoiceInput) {
                                resolve(userChoiceInput);
                                $(dialog).dialog('destroy').remove();
                                $(dialog).dialog("close");
                            }
                        },
                    },
                },
                open: function () {
                    $("#onBoarding").focus();
                },
                close: function () {
                    $(this).remove();
                },
            });
        $("input:radio[name=onBoarding]").click((e) => {
            let targetValue = e.target.value;
            if (targetValue === "other") {
                $("#onBoarding").prop("disabled", true).addClass("ui-state-disabled");
            } else {
                $("#onBoarding")
                    .prop("disabled", false)
                    .removeClass("ui-state-disabled");
            }
        });
    }

    return new Promise((resolve, reject) => {
        displayDialog(resolve);
    });
}

const center = `
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: white
`;

function displayFinishDialog() {
    const finishHTML = getCommonStyledHtmlString(`<form>
    <div style="text-align: center;">
    <h1>You are ready to use KR</h1>
    <h3>Here are some resource to explore more</h3>
    <div style="margin=10px">
        <div style="width: 50%; float:right;">
            <a href="https://docs.katalon.com/x/cRtO?utm_source=chrome%20recorder%20pop-up" target="_blank">
                <div>
                    <img style="${center}" src="/katalon/images/SVG/user-manual-icon.svg" width="30" height="30"/>
                </div>
                <div style="text-align: center">
                    <h3>User Manual</h3>
                    <p>Guides to utilize Katalon Recorder for automation effectively.</p>
                </div>
            </a>
        </div>
        <div  style="width: 50%; float:left;">
            <a href="https://forum.katalon.com/?utm_source=chrome%20recorder%20pop-up" target="_blank">
                <div>
                    <img style="${center}" src="/katalon/images/SVG/community-icon.svg" width="30" height="30"/>
                </div>
                <div style="text-align: center">
                    <h3>Community</h3>
                    <p>Access Katalon fellow user tips and tricks sharing</p>
                </div>
            </a>
        </div>
    </div>
    </form>
    `);
    let finishDialog = $('<div id="onboarding-finish-dialog"></div>')
        .html(finishHTML)
        .dialog({
            title: "Congratulations!",
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Start using Katalon Recorder": {
                    text: "Start using Katalon Recorder",
                    id: "finish",
                    click: (_) => {
                        $(finishDialog).dialog("close");
                        $(finishDialog).dialog('destroy').remove();
                    },
                },
            },
            close: function () {
                $(this).remove();
            },
        });
}

export {
    displayWelcomeDialog,
    displayFinishDialog,
    displayWelcomeDialogForExistingUsers,
};
