var hasChromeDebugger = false;

browser.runtime.sendMessage({ 
    checkChromeDebugger: true
}).then(function(result) {
    hasChromeDebugger = result.status
});