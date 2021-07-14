let html = `
<div style="text-align:center; font-size: 20px;"><strong>Let us know your story!</strong></div>
<br/>
<div>Have a feature for KR you want to see implemented or a story you want to share? We are all ears.</div>
<br/>
<div style="text-align:center;"><button id="talktoUs" type="button" style="color: black">Talk to Us</button></div>
`;

let htmlDialog = `
<h2>Wow! You have been very active</h2>
<div>Hi there, we can't help but notice you have executed a lot. It's important for us to understand how and why you are using Katalon Recorder. If it's convenient, please consider having a short conversation with us.</div>
</br>
<div style="text-align:center"><button id="talktoUs" type="button" style="color: black">Talk to Us</button></div>
`;

$(() => {
    //set dropup dialog Talk to us
    let popup = $('<div id="popup-connect"></div>')
        .css({
            'display': 'none',
            'position': 'absolute',
            'bottom': '50px',
            'z-index': '1',
            'background-color': '#f1f1f1',
            'min-width': '150px',
            'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
            'padding': '20px',
            'margin-left': '78%',
            'margin-bottom': '-1%',
            'color' : 'black'
        });
    $('#connecting').append(popup);

    //add img for button connecting
    $('#connecttous').css({
        'background-color':'#ff0000',
        'border-color':'#ff0000'
    })
    var img = $('<img>');
    img.attr('src', '../katalon/images/SVG/talk-to-us-icon.svg');
    img.attr('width', '15px');
    img.attr('style', 'margin-top: 3px');
    $('#connecttous').find("i:first-child").remove();
    $('#connecttous').prepend(img);

    //toggle popup
    $('#connecttous').click(() => {
        popup.html(html);
        $('#popup-connect').toggle();
    });

    //Tracking ga and open link https://calendly.com/thomasto-katalon/kr-user-interview
    $("#popup-connect").on('click', '#talktoUs', function () {
        window.open('https://calendly.com/thomasto-katalon/kr-user-interview');
        _gaq.push(['_trackEvent', 'user-research', 'speak-with-us']);
        $('#popup-connect').fadeOut();
    });

    // $(document).on("contextmenu",()=>{
    //     $('#popup-connect').fadeOut();
    // })

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