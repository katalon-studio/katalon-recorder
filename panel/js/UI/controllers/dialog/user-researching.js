let htmlDialog = `
<h2>Wow! You have been very active</h2>
<div>Hi there, we can't help but notice you have executed a lot. It's important for us to understand how and why you are using Katalon Recorder. If it's convenient, please consider having a short conversation with us.</div>
</br>
<div style="text-align:center"><button id="talktoUs" type="button" style="color: black">Talk to Us</button></div>
`;

$(() => {
    $('#connecting').click(() => {
      window.open('https://calendly.com/thomasto-katalon/kr-user-interview');
      _gaq.push(['_trackEvent', 'user-research', 'speak-with-us']);
    });

    //show dialog if 10 executed
    browser.storage.local.get('checkLoginData').then(function (result) {
        if (result.checkLoginData) {
            let checkLoginData = result.checkLoginData;
            if (checkLoginData.playTimes && checkLoginData.playTimes > 10) {
                browser.storage.local.get('checkPopup').then((result) => {
                    if (!result.checkPopup) {
                        result = {
                            checkPopup: {
                                isPopupUserResearch: false
                            }
                        }
                        browser.storage.local.set(result);
                    }
                    if (!result.checkPopup.isPopupUserResearch) {
                        popup.html(htmlDialog).css({
                            'min-width': '200px',
                            'margin-left': '70%'
                        }).show();
                        result.checkPopup.isPopupUserResearch = true;
                        browser.storage.local.set(result);
                    }
                });

            }
        }
    });
});