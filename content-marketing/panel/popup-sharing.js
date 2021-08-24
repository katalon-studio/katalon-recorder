import { getAllTestCaseCount } from "../../panel/js/UI/services/data-service/test-case-service.js";

let succeedReferral;

function popupDailyUsageDialog() {
    let html = `
<style>
.myDialog .ui-dialog-titlebar { display: none; }
.bg{
    text-align: center;
    padding: 7% 0 0 0;
}
.label-bg{
    font-size: 24px;
    font-family: 'Roboto';
    color: #212C8C;
    margin: 2% 0 5%
}
.bd{
    text-align: left;
    border: 1px solid #829FE8;
    box-sizing: border-box;
    border-radius: 16px; 
}
.content-table{
    padding: 2% 0 2% 20%;
}
.content-title{
    margin-top: 3%;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
}
.content-style{
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    margin: 5% 0;
}
.fa {
  padding: 5px;
  font-size: 30px;
  width: auto;
  height: 30px;
  text-align: center;
  text-decoration: none;
}
.fa:hover {
  opacity: 0.7;
}
.fa-facebook {
  background:url(images/fb-btn.png);
}
.fa-twitter {
    background:url(images/twitter-btn.png);
}
.fa-linkedin {
    background:url(images/linkedin-btn.png);
}
.content-result {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    color: #4959ED;
}
.border-rs{
    width: 227px;
    height: 0px;
    border: 1px solid #E0E0E0;
    margin: 5% 0;
}
.note {
    margin-top: 5px;
    text-align: center;
}
.encouraging-text {
    margin-bottom: 10px;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: #212C8C;
}
.content-btn{
    margin-left: 6px;
    width: 32px;
    height: 14px;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: #FFFFFF;
}
#sharingLinkedIn{
    cursor: pointer;
    width: 70px;
    height: 24px;
    background: #212B8D;
    border-radius: 4px;
    border: none;
}
.content-img{
    width: 14px;
    height: 15px;
    float: left;
}
#sharingTwitter{
    cursor: pointer;
    width: 70px;
    height: 24px;
    background: #518CFF;
    border-radius: 4px;
    margin-left: 10px;
    border: none;
}
#sharingFb{
    cursor: pointer;
    width: 70px;
    height: 24px;
    background:  #4959ED;
    border-radius: 4px;
    margin-left: 10px;
    border: none;
}
.close-text{
    text-align: center;
    margin: 5%;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    text-decoration-line: underline;
    color: #4959ED;
    cursor: pointer;
}
</style>
<div id="capture-img">
<div class="bg">
<img src="images/bg2.png" width="50%">
<div class="label-bg"><strong>Heaven is a place without all the repetitive tasks</strong></div>
</div>
<div class="bd">
<div class="content-table">
<div class="content-title">Today, you have</div>
<div class="content-style"></div>
<div>
<span class="content-style">Automated</span> 
<span class="content-result" style="margin-left: 40px; margin-right:15px">{{numTest}}</span> 
<span> manual processes</span>
</div>
<div class="border-rs"></div>
<div>
<span class="content-style">Executed</span>
<span class="content-result" style="margin-left: 49px; margin-right:15px">{{numExc}}</span> 
<span> automation scripts<span>
</div>
</div>
<div style="margin: 3% 15%;text-align:center">You're automating your way back to a simple life</div>
</div>
</div>
<div id="btn-sharing" style="text-align:center; margin: 5% 0;">
<div class="encouraging-text">Let people know that heaven is within reach!</div>
<button id="sharingLinkedIn">
<img src="images/lki-btn.png" class="content-img"/>
<span class="content-btn">Share</span>
</button>
<button id="sharingTwitter">
<img src="images/twt-btn.png" class="content-img"/>
<span class="content-btn">Share</span>
</button>
<button id="sharingFb">
<img src="images/fb-btn.png" class="content-img"/>
<span class="content-btn">Share</span>
</button>
</div>
<div class="note">
<div><small>Data will be refreshed the next day</small></div>
</div>
<div class="close-text" id="close-usage">Continue your work</div>
  `;
    browser.storage.local.get('usageDay').then(function (result) {
        html = html.replace("{{numExc}}", result.usageDay ? (result.usageDay.numExc ? result.usageDay.numExc : 0) : 0);
        html = html.replace("{{numTestSuites}}", result.usageDay ? (result.usageDay.numTestSuites ? result.usageDay.numTestSuites : 0) : 0);
        html = html.replace("{{numTest}}", result.usageDay ? (result.usageDay.numTest ? result.usageDay.numTest : 0) : 0);

        const usageDialog = $('<div id="usage"></div>')
            .html(html)
            .dialog({
                dialogClass: 'myDialog',
                resizable: true,
                modal: true,
                width: '450',
                height: '620',
                close: function() {
                    $(this).remove();
                }
            });

        $('#close-usage').on('click', function() {
            clearInterval(succeedReferral);
            $(usageDialog).dialog('close');
        })
    })
}

function setBeginningAndEndTime(startedAt) {
    let start = new Date(startedAt);
    start.setHours(0, 0, 0, 0);

    let end = new Date(startedAt);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

function checkSucceedReferral() {
    browser.storage.local.get('sharingSocial').then(function (result) {
        if (result.sharingSocial) {
            switch (true) {
                case result.sharingSocial.isSharedFB:
                    _gaq.push(['_trackEvent', 'referral-v1', 'share-completion', 'facebook']);
                    browser.storage.local.remove('sharingSocial');
                    if ($('#usage').is(':visible')) {
                        $('#usage').dialog('close');
                        clearInterval(succeedReferral);
                    }
                    break;
                case result.sharingSocial.isSharedLinkedIn:
                    _gaq.push(['_trackEvent', 'referral-v1', 'share-completion', 'linkedin']);
                    browser.storage.local.remove('sharingSocial');
                    if ($('#usage').is(':visible')) {
                        $('#usage').dialog('close');
                        clearInterval(succeedReferral);
                    }
                    break;
                case result.sharingSocial.isSharedTwitter:
                    _gaq.push(['_trackEvent', 'referral-v1', 'share-completion', 'twitter']);
                    browser.storage.local.remove('sharingSocial');
                    if ($('#usage').is(':visible')) {
                        $('#usage').dialog('close');
                        clearInterval(succeedReferral);
                    }
                    break;
                default:
                    break;
            }

        }
    })
}

function setUsageSummary(type) {
    browser.storage.local.get('usageDay').then(function (result) {
        if (!result.usageDay) {
            result = {
                usageDay: {
                    numTest: 0,
                    numExc: 0,
                    numTestSuites: 0
                }
            };
        }
        let usageDay = result.usageDay;

        switch (type) {
            case "playCase":
                usageDay.numExc++;
                break;
            case "playSuite":
                let cases = getSelectedSuite().getElementsByTagName("p");
                usageDay.numExc += cases.length;
                break;
            case "playSuites":
                usageDay.numExc += getAllTestCaseCount();
                break;
            case "newTestcase":
                usageDay.numTest++;
                break;
            case "newTestsuite":
                usageDay.numTestSuites++;
                break;
            case "newInitRecord":
                if (!getSelectedSuite() || !getSelectedCase()) {
                    usageDay.numTest++;
                    usageDay.numTestSuites++;
                }
                break;
            default:
                break;
        }
        browser.storage.local.set(result);
    });
}

function popupShareUsDialog(){
    let dialogHTML = `
    <div style="text-align:center; font-size: 15px;"><strong>Make your work seen!</strong></div>
    </br>
    <span>
    You have been using KR for a while today, take a look at the daily usage and share it with the world.
    </span>
    <style>
        .shareUsBtn{
            border-radius: 5px;
            padding: 5px;
            border: none;
            color: black;
        }
        #shareUS-later:hover{
            background-color: #d7dbdb;
        }
        #shareUS-accept{
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
        }
        #shareUS-accept:hover{
            background-color: #1d42af;
        }
    </style>
    <div style="text-align:center; margin-top:10px">
        <button id="shareUS-later" class="shareUsBtn" type="button" style="margin-right: 10px">Maybe Later</button>
        <button id="shareUS-accept" class="shareUsBtn" type="button">Yep, why not?</button>
    </div>`;

    let popup = $('<div id="shareUsDialog"></div>').css({
        'position': 'absolute',
        'display': 'none',
        'bottom': '50px',
        'z-index': '1',
        'background-color': '#f1f1f1',
        'max-width': '200px',
        'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
        'padding': '20px',
        'margin-bottom': '-1%',
        'right': '0',
        'color': 'black'
    }).html(dialogHTML);
    $("body").append(popup);

    $("#shareUS-later").click(function (){
        $("#shareUsDialog").hide();
    });

    $("#shareUS-accept").click(function (){
        popupDailyUsageDialog();
        $("#shareUsDialog").hide();
    });
    $(popup).show();
}

function setNewDay(result) {
    let startup = result.startup;

    let yesterday = setBeginningAndEndTime(startup.startedAt);
    let today = new Date();
    if (yesterday.end.getTime() < today.getTime()) {
        startup.startedAt = Date();
        startup.isCheckedPopup = false;
        browser.storage.local.set(result);
        browser.storage.local.remove('usageDay');
    }

    let checkedTime = (today.getTime() - new Date(startup.startedAt).getTime()) / 1000;
    //check time to popup dialog in day
    if (checkedTime >= 1800 && !startup.isCheckedPopup) {
        startup.isCheckedPopup = true;
        browser.storage.local.set(result);
        popupShareUsDialog();
    }
}

$(() => {
    browser.storage.local.get('startup').then(function (result) {
        if (!result.startup) {
            result = {
                startup: {
                    startedAt: Date(),
                    isCheckedPopup: false
                }
            };
            browser.storage.local.set(result);
        } else {
            setNewDay(result);
        }
    });

    $('#dailyUsage').click(() => {
        popupDailyUsageDialog();
        succeedReferral = setInterval(() => {
            checkSucceedReferral();
        }, 500);
        _gaq.push(['_trackEvent', 'referral-v1', 'view-usage-summary']);
        $('#myDropdown').fadeOut();
    })

    $("#essentialProductTours").click(() => {
        Promise.all([
            import ("../../panel/js/UI/services/onboarding-service/onboarding-sample-data.js"),
            import ("../../panel/js/UI/controllers/onboarding/onboarding-listener.js"),
        ]).then((obj) => {
            const { addOnboardingSampleData } = obj[0];
            const { startEssentialProductTours } = obj[1];
            addOnboardingSampleData().then(() => {
                startEssentialProductTours(true);
                $("#myDropdown").fadeOut();
            });
        });
    });

    $('#add-testCase').click(function() {
        setUsageSummary("newTestcase");
    });
    $('#add-testSuite').click(function() {
        setUsageSummary("newTestsuite");
    })

    $('#playback').click(function() {
        setUsageSummary("playCase");
    })

    $('#playSuite').click(function() {
        setUsageSummary("playSuite");
    })

    $('#playSuites').click(function() {
        setUsageSummary("playSuites");
    })

    $('#record').click(function() {
        setUsageSummary("newInitRecord");
    })
})

let sharingFb = {
    uri: 'https://www.facebook.com/sharer/sharer.php',
    href: 'https://www.katalon.com/katalon-recorder-ide/?utm_source=kr&utm_medium=fb-referral&utm_campaign=kr%20referral',
    hashtag: '#KatalonRecorder'
};

let sharingLinkedIn = {
    uri: 'https://www.linkedin.com/sharing/share-offsite/',
    url: 'https://www.katalon.com/katalon-recorder-ide/?utm_source=kr&utm_medium=li-referral&utm_campaign=kr%20referral/',
}

let sharingTwitter = {
    uri: 'http://twitter.com/share',
    text: '',
    url: 'https://www.katalon.com/katalon-recorder-ide/?utm_source=kr&utm_medium=tw-referral&utm_campaign=kr%20referral',
    hashtags: 'KatalonRecorder,WebAutomation',
}

const contentMap = [
    "Let's pursue a life free from the hassles of doing the same things over and over again."
]

let urlEndpoint = 'https://backend.katalon.com/api/upload-kr';

function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

function convertHTMLtoPNG() {
    let imageConvert = $('#capture-img');

    return html2canvas(imageConvert[0]).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png', 1.0);

        const formData = new FormData();
        formData.append('file', dataURItoBlob(imgData), 'sharing-img.png');
        return fetch(`${urlEndpoint}`, {
            method: 'POST',
            body: formData
        }).then(
            response => response.json()
        ).then(
            success => success
        ).catch(
            error => error
        );
    });
}

//sharing to Facebook
$(document).on('click', '#sharingFb', function() {
            convertHTMLtoPNG().then(rs => {
                        let url = sharingFb.uri;
                        url += `?u=${encodeURIComponent(`${urlEndpoint}/${rs.key}`)}`;
        url += `&hashtag=${encodeURIComponent(sharingFb.hashtag)} — The most popular web automation tool.`;
        url += `&quote=${contentMap[Math.floor(Math.random() * contentMap.length)]}` + escape(`\n\n Find out more at `) +  `${encodeURIComponent(sharingFb.href)}` + escape(`\n\n`);
        window.open(url);
        _gaq.push(['_trackEvent', 'referral-v1', 'share-intention', 'facebook']);
    });
});

//sharing to Twitter
$(document).on('click', '#sharingTwitter', function() {
            convertHTMLtoPNG().then(rs => {
                        let url = sharingTwitter.uri;
                        url += `?url=${encodeURIComponent(`${urlEndpoint}/${rs.key}`)}`;
        url += `&hashtags=${encodeURIComponent(sharingTwitter.hashtags)} — The most popular web automation tool.`;
        url += `&text=${contentMap[Math.floor(Math.random() * contentMap.length)]}` + escape(`\n\n Find out more at `) + `${encodeURIComponent(sharingTwitter.url)}` + escape(`\n\n`);
        const sharing = window.open(url);
        _gaq.push(['_trackEvent', 'referral-v1', 'share-intention', 'twitter']);
    });
});

//sharing to LinkedIn
$(document).on('click', '#sharingLinkedIn', function () {
    convertHTMLtoPNG().then(rs => {
        let url = sharingLinkedIn.uri;
        url += `?url=${encodeURIComponent(`${urlEndpoint}/${rs.key}`)}`;
        window.open(url);
        _gaq.push(['_trackEvent', 'referral-v1', 'share-intention', 'linkedin']);
    });
});


