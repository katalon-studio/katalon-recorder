function findElement(xpathExp) {
    var xpaths = xpathExp.split('_\\|\\_');
    var doc = document;
    var node = null;
    for (i = 0; i < xpaths.length; ++i) {
        var nodes = doc.evaluate(xpaths[i], doc, null, XPathResult.ANY_TYPE, null);
        node = nodes.iterateNext();
        if (!node) {
            break;
        }
        if (i < xpaths.length - 1) {
            doc = node.contentDocument || node.contentWindow.document;
        }
    }
    return node;
}

function isElementVisible(element) {
    if (!element) {
        return false;
    }
    if (element.style && element.style.display == 'none') {
        return false;
    }
    if (element.style && element.style.visibility == 'hidden') {
        return false;
    }
    
    return true;
}

function findTestObject(request, response) {
    var element = findElement(request.xpath);
    
    if (isElementVisible(element)) {
        response({tabId: request.srcTabId, found: true});
    }
}

function flashTestObject(xpathExp) {
    var element = findElement(xpathExp);
    
    if (isElementVisible(element)) {
        element.scrollIntoView(false);
        setTimeout(function() {
            $(element)
                .css({
                    outline : ELEMENT_FLASHING_OUTLINE_STYLE
                })
                .animate({
                    outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_1
                }, 100)
                .animate({
                    outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_2
                }, 100)
                .animate({
                    outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_1
                }, 100)
                .animate({
                    outlineColor : ELEMENT_FLASHING_OUTLINE_COLOR_2
                }, 100, function() {
                    element.style.outline = '';
                });
        }, 500);
        
    }
}

function processMessage(request, sender, response) {
    switch (request.request) {
        case 'KATALON_FIND_OBJECT':
            findTestObject (request, response);
            break;
        case 'KATALON_FLASH_OBJECT':
            flashTestObject(request.xpath);
            break;
    }
}

function startGetRequestSchedule() {
    browser.runtime.sendMessage({
        method: XHTTP_POST_METHOD,
        action: 'GET_REQUEST',
        url: qAutomate_server_url
    }).then(function(){});
    
    browser.runtime.onMessage.addListener(
        function(request, sender, response) {
            processMessage(request, sender, response);
        }
    );
}