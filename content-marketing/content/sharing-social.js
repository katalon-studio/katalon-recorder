let sharingSocial = {
    isSharedFB: false,
    isSharedLinkedIn: false,
    isSharedTwitter: false,
    sharedTime: 0
};

function setSharingSocial(type) {
    browser.storage.local.get('sharingSocial').then(function (result) {
        if (!result.sharingSocial) {
            result = { sharingSocial: sharingSocial };
        }
        sharingSocial = result.sharingSocial;
        switch (type) {
            case "facebook":
                sharingSocial.isSharedFB = true;
                break;
            case "twitter":
                sharingSocial.isSharedTwitter = true;
                break;
            case "linkedin":
                sharingSocial.isSharedLinkedIn = true;
                break;
            default:
                break;
        }
        sharingSocial.sharedTime = new Date();
        browser.storage.local.set(result);
    });
}

const contentMap = [
    "Let's pursue a life free from the hassles of doing the same things over and over again"
]

$(() => {
    //check sharing on Facebook
    $('button[name="__CONFIRM__"]').on("click", function() {
        setSharingSocial("facebook");
    });

    //check sharing on LinkedIn
    $('button[data-control-name="select_share_post"]').on("click", function() {
        setTimeout(function() {
            $('.ql-editor').removeClass("ql-blank").children().prepend(`${contentMap[Math.floor(Math.random() * contentMap.length)]} - via <a href="https://www.katalon.com/katalon-recorder-ide/?utm_source=kr&utm_medium=tw-referral&utm_campaign=kr%20referral" target="_blank">Katalon Recorder</a><br/><strong class="ql-hashtag">#KatalonRecorder</strong> <strong class="ql-hashtag">#WebAutomation</strong>— The most popular web automation tool`);

            $('.share-actions__primary-action').on('click', () => {
                setTimeout(() => {
                    if ($('.inshare-success-state__success-msg').is(':visible')) {
                        setSharingSocial("linkedin");
                    }
                }, 1000);
            });
        }, 500);
    });

    //check sharing on Twitter
    $('div[data-testid="tweetButton"]').on("click", function() {
        setSharingSocial("twitter");
    });
});

