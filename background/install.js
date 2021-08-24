// KAT-BEGIN show docs on install or upgrade from 1.0
browser.runtime.onInstalled.addListener(function (details) {

    if (details.reason === 'install') {
        browser.tabs.create({
            url: 'https://www.katalon.com/sign-up/?utm_source=browser%20store&utm_campaign=installed%20KR'
        });
        segment().then(service => service.trackingInstallApp());
        browser.storage.local.set( {UIStyle: "new"} );
    }
    else if (details.reason === 'update') {
        browser.storage.local.set({
            tracking: {
                isUpdated: true
            }
        });
        notificationUpdate("Katalon Recorder has been updated", "Find out about new bug fixes and enhancements!");
        browser.storage.local.get("UIStyle").then(result => {
            let UIStyle;
            if (!result.UIStyle){
                UIStyle = getUserUIStyle();
            } else {
                UIStyle = result.UIStyle;
            }
            import('../panel/js/UI/services/tracking-service/segment-tracking-service.js').then(module => {
                module.trackingSegment("kru_new_uiux", {is_using_new_uiux: UIStyle !== "old"});
            });
            browser.storage.local.set( {UIStyle} );
        });
    }

});

function getUserUIStyle(){
    const threshold = 0.2;
    return "new";
    return Math.random() > threshold ? "old" : "new";
}

browser.runtime.onMessage.addListener(function (message) {
    browser.storage.local.get('segment').then(function (result) {
        if (result.segment) {
            let segment = result.segment;
            browser.runtime.setUninstallURL(`${browser.runtime.getManifest().segment_url}/segment-kr/tracking?userId=${segment.userId || ''}&user=${encodeURI(segment.user) || ''}`);
        } else {
            browser.runtime.setUninstallURL(`${browser.runtime.getManifest().segment_url}/segment-kr/tracking`);
        }
    });
});

// KAT-END

async function segment() {
    const segmentSer =  await import('../panel/js/UI/services/tracking-service/segment-tracking-service.js');
    return segmentSer;
}


const notify = "Katalon-update";

function notificationUpdate(title, content) {
    browser.notifications.create(notify, {
        "type": "basic",
        "iconUrl": "/katalon/images/branding/branding_48.png",
        "title": title,
        "message": content
    });

    setTimeout(function() {
        browser.notifications.clear(notify);
    }, 5000);
}
