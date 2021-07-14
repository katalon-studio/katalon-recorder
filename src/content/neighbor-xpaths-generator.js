window.neighborXpathsGenerator = window.neighborXpathsGenerator || {};

// Tags that we consider 'useless'
neighborXpathsGenerator.excludedTags = ["main", "noscript", 'script', "style", "header", "head", "footer", "meta",
    "body", "title", "ul", "iframe", "link", "svg", "path", "nav", "p", "option", "br"];

/*
    Methods
*/

/**
 * @param: DOM element
 * @param: boolean
 * @return: xpaths starting from a preceding and following neighbors( concatenated with xpath= (@param2))
**/

neighborXpathsGenerator.getXpathsByNeighbors = function (clickedElement, xpathPrefix) {

    // Get useful elements surrounding clicked element, with the amount
    // specified by neighborXpath.beforeEle and neighborXpath.afterEle
    var usefulNeighbors = neighborXpathsGenerator.getUsefulNeighbors(clickedElement, 2, 2);
    var newXpaths = [];

    // Generate new xpath for the neighbors above
    for (var i = 0; i < usefulNeighbors.length; i++) {

        var thisUsefulNeighbor = usefulNeighbors[i];
        var partialPathToGetTagOffset;
        var correctPrefix
        var correctOffsetByTagName;
        var newXPath;

        // Retrieve any element that:
        //              - Has text nodes that are not just blank spaces in disguise ( This removes bounding parents )
        //              - The over all string matches the neighbor's text ( This selects the correct element )
        var partialPathToGetTextOffset = "(.//*[normalize-space(text()) and normalize-space(.)=" + neighborXpathsGenerator.getImmediateText(thisUsefulNeighbor) + "])";
        var correctOffsetByText = neighborXpathsGenerator.getCorrectOffset(thisUsefulNeighbor, partialPathToGetTextOffset);
        var neighborXpath = partialPathToGetTextOffset + "[" + correctOffsetByText + "]";

        if (!neighborXpathsGenerator.isDescendant(thisUsefulNeighbor, clickedElement)) {
            // If the neighbor is actually the container, then 'preceding' or 'following' would be wrong
            // We have to find inside the container
            correctPrefix = neighborXpathsGenerator.getRelativePrefix(clickedElement, thisUsefulNeighbor);
            partialPathToGetTagOffset = neighborXpath + '/' + correctPrefix + '::' + clickedElement.tagName.toLowerCase();
            correctOffsetByTagName = neighborXpathsGenerator.getCorrectOffset(clickedElement, partialPathToGetTagOffset);
            newXPath = partialPathToGetTagOffset + "[" + correctOffsetByTagName + "]";
        } else {
            // Retrieve any element that:
            //              - 'precede' or 'follow' the neighbor
            //              -  Has the same tag name as the clicked element
            partialPathToGetTagOffset = neighborXpath + '/' + clickedElement.tagName.toLowerCase();
            correctOffsetByTagName = neighborXpathsGenerator.getCorrectOffset(clickedElement, partialPathToGetTagOffset);
            newXPath = partialPathToGetTagOffset + "[" + correctOffsetByTagName + "]";
        }
        if(xpathPrefix){
            newXpaths.push("xpath=" + newXPath);
        }else{
            newXpaths.push(newXPath);
        }

    }
    return newXpaths;
}

/**
 * @param: DOM element
 * @param: Boolean 
 * @return: xpath of label with @for that matches the clicked element's @id ( concatenated with xpath= (@param2))
**/
neighborXpathsGenerator.getXpathByLabelFor = function (clickedElement, xpathPrefix) {
    var clickedElementIDAttrName = clickedElement.getAttribute("id");
    var clickedElementIDAttrValue = (clickedElementIDAttrName && clickedElementIDAttrName !== "") ? clickedElementIDAttrName.attrValue : null;
    var newXpath = [];
    // If @id exists then the possibility for a label exists
    if (clickedElementIDAttrValue) {
        // Find an element with @for equals the ID above
        var labelForInputXPath = "//label[@for='" + clickedElementIDAttrValue + "']";
        var labelForInput = neighborXpathsGenerator.getElementByXPath(labelForInputXPath);
        // If the label exists
        if (labelForInput) {
            // Use the text of the anchor only, constrainted by 2 conditions ( see getXPathByNeighbor -> partialPathToGetTextOffset )
            var anchorXPath = "//label[normalize-space(text()) and normalize-space(.)=" + neighborXpathsGenerator.getImmediateText(labelForInput) + "]";
            // Retrieve the correct offset of label among elements with the same text
            var correctOffsetByText = neighborXpathsGenerator.getCorrectOffset(labelForInput, anchorXPath);
            // Retrieve all elements with @id equals to the value of @for of the anchor
            var newXPath = "//*[@id=string(" + anchorXPath + "[" + correctOffsetByText + "]" + "/@for)]";
            if(xpathPrefix){
                return newXPath;
            }else{
                return newXPath;
            }
        }
    }
}

/**
 * @param: DOM element
 * @param: (optional) number of elements preceding the clicked element to capture
 * @param: (optional) number of elements following the clicked element to capture 
 * @return: 2 useful elements surrounding @param1 
**/
neighborXpathsGenerator.getUsefulNeighbors = function (clickedElement, explicitPrecedeLevel, explicitFollowLevel) {
    var usefulElements = [];
    var allElements = document.getElementsByTagName("*");
    var precedeCounter = 0;
    var followCounter = 0;

    // If not explicitly stated, get only 1 level each 
    var precedeLimit = (explicitPrecedeLevel) ? explicitPrecedeLevel : 1;
    var followLimit = (explicitFollowLevel) ? explicitFollowLevel : 1;

    // allElements contain all DOM elements already sorted in order of their apperance in DOM tree
    for (var i = 0; i < allElements.length; i++) {
        var thisElement = allElements[i];
        if (thisElement === clickedElement) {
            // Go to the left and get an element <= remove break and add counter to get more
            for (var j = i - 1; j >= 0; j--) {
                if (allElements[j]) {
                    var prevElement = allElements[j];
                    if (neighborXpathsGenerator.usefulElement(prevElement) && precedeCounter < precedeLimit) {
                        usefulElements.push(prevElement);
                        precedeCounter++;
                    }
                } else break;
            }
            // Go to the right and also do the above
            for (var k = i + 1; k < allElements.length; k++) {
                if (allElements[k]) {
                    var nextElement = allElements[k];
                    if (neighborXpathsGenerator.usefulElement(nextElement) && followCounter < followLimit) {
                        usefulElements.push(nextElement);
                        followCounter++;
                    }
                } else break;
            }
        }
    }
    return usefulElements;
}



/**
 * @param: DOM element ( clicked element )
 * @param: DOM element ( the neighbor )
 * @return: string 
 * return either 'preceding' or 'following' depends on wether neighbor appears before or after clicked element  
**/
neighborXpathsGenerator.getRelativePrefix = function (clickedElement, neighbor) {
    var elementPath = neighborXpathsGenerator.getIndexPath(clickedElement);
    var neighborPath = neighborXpathsGenerator.getIndexPath(neighbor);
    for (var i = 0; i < Math.max(elementPath.length, neighborPath.length); i++) {
        if (elementPath[i] != neighborPath[i]) {
            return (elementPath[i] - neighborPath[i] < 0) ? 'preceding' : 'following';
        }
    }
}

/**
 * @param: DOM element ( clicked element ) 
 * @param: string ( xpath ) 
 * @return: The offset off @param1 among elements retrieved by @param2 
**/
neighborXpathsGenerator.getCorrectOffset = function (clickedElement, xpath) {

    var candidates = neighborXpathsGenerator.getElementsByXPath(xpath);
    var counter = 0;

    // Special case - if xpath contains 'preceding' then we count from right to left
    if (xpath.includes("preceding")) {
        for (var i = candidates.length - 1; i >= 0; i--) {
            var thisElement = candidates[i];
            if (thisElement === clickedElement) {
                return (counter + 1);
            } else {
                counter++;
            }
        }
    } // else the default (xpath contains 'following' or no relative info) is counting from left to right 
    else {
        for (var i = 0; i < candidates.length; i++) {
            var thisElement = candidates[i];
            if (thisElement === clickedElement) {
                return (counter + 1);
            } else {
                counter++;
            }
        }
    }
    return (counter + 1);
}

/*
    Utilities
*/

/**
 * @param: DOM element
 * @return: The text immediately within the element's tag ( not its children )
 * that can be used for xpath (e.g. single quotes, double quotes handled) 
**/
neighborXpathsGenerator.getImmediateText = function (element) {
    var textNodePresence = $(element).contents().filter(function () {
        return this.nodeType == Node.TEXT_NODE;
    }).text().trim();

    // Replace consecutive white spaces with a single white space
    var text = "";
    var addedSingleSpace = false;
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeType == Node.TEXT_NODE) {
            if ($(element.childNodes[i]).text().trim() == "") {
                if (addedSingleSpace == false) {
                    text += " ";
                    addedSingleSpace = true;
                }
            } else {
                text += $(element.childNodes[i]).text().trim();
            }
        }
    }

    // Trim away preceding and trailing white spaces ( if any );
    text = text.trim();

    if (textNodePresence) {
        return neighborXpathsGenerator.generateConcatForXPath(text);
    }
    return "";
}


/**
* @param: string
* @return: if the @param1 ontains single quotes or double quotes,
* the returned string will contain concat function with double quotes bounded by single quotes 
* and single quotes bounded by double quotes 
* Reference: https://examples.javacodegeeks.com/core-java/xml/xpath/xpath-concat-example/ 
**/
neighborXpathsGenerator.generateConcatForXPath = function (string) {
    var returnString = "";
    var searchString = string.trim();
    var quotePos = neighborXpathsGenerator.getQuotePos(searchString);

    if (quotePos == -1) {
        returnString = "'" + searchString + "'";
    } else {
        returnString = "concat(";
        while (quotePos != -1) {

            var subString = searchString.substring(0, quotePos);
            returnString += "'" + subString + "', ";
            // 
            if (searchString.substring(quotePos, quotePos + 1) == "'") {
                returnString += "\"'\", ";
            }
            else {
                returnString += "'\"', ";
            }
            searchString = searchString.substring(quotePos + 1, searchString.length);
            quotePos = neighborXpathsGenerator.getQuotePos(searchString);
        }
        returnString += "'" + searchString + "')";
    }

    return returnString;
}

/**
 *  @param: Xpath - string
 *  @return: the first element that matches the xpath on DOM 
**/
neighborXpathsGenerator.getElementByXPath = function (path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/**
 * @param: XPath - string
 * @return: Array of found DOM elements 
 **/
neighborXpathsGenerator.getElementsByXPath = function (path) {
    var snapShotItems = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var ret = [];
    for (var i = 0; i < snapShotItems.snapshotLength; i++) {
        ret.push(snapShotItems.snapshotItem(i));
    }
    return ret;
}

/**
 * @param: DOM element
 * @return: "true" if an element is useful, "false" otherwise
**/
neighborXpathsGenerator.usefulElement = function (element) {
    var elementXPathText = neighborXpathsGenerator.getImmediateText(element);
    // Since neighborXpath.getImmediateText() return a string wrapped by single/double quotes, we ignore them
    var boundedQuotesRemoved = elementXPathText.substring(1, elementXPathText.length - 1);

    return (
        element // it exist
        && (!neighborXpathsGenerator.excludedTags.includes(element.tagName.toLowerCase()))
        && (
            (
                // Have text
                neighborXpathsGenerator.getImmediateText(element) != ""
                // Have just enough text
                && neighborXpathsGenerator.getImmediateText(element).length > 1
                // If a text is not included as a neighbor, chances are it is longer than this threshold
                && neighborXpathsGenerator.getImmediateText(element).length <= 100
                // Text is not a number since numbers are fragile
                && (isNaN(parseInt(boundedQuotesRemoved)))
            )
        )
        // Not hidden in any kind
        && (element.getAttribute("type") !== 'hidden')
        && (element.getAttribute("style") !== 'display:none')
        // TODO: make 'aria-hidden' optional - it could be sometimes useless
        && (element.getAttribute("aria-hidden") !== "true")
        // is not there for no reason
        && (element.getAttribute("href") !== '#')
        && (element.getAttribute("class") !== 'hidden')

    );
}

/**
 * @param: DOM element
 * @param: Path so far
 * @return: Array of index representing the position of the current element
 * among all children of its parent
**/
neighborXpathsGenerator.getIndexPath = function (domNode, bits) {
    bits = bits ? bits : [];
    var c = 0;
    var p = domNode.parentNode;
    if (p) {
        // This is the important difference from getAbsoluteXPath
        var els = p.children;

        if (els.length > 1) {
            while (els[c] !== domNode) c++;
        }

        bits.push(c);
        return neighborXpathsGenerator.getIndexPath(p, bits);
    }
    return bits.reverse();
}

/**
 * @param: DOM element
 * @param: The path so far
 * @return: Absolute xpath from root to node 
**/
neighborXpathsGenerator.getAbsoluteXPath = function (domNode, bits) {
    bits = bits ? bits : [];
    var c = 0;
    var b = domNode.nodeName;
    var p = domNode.parentNode;

    if (p) {
        var els = p.getElementsByTagName(b);
        if (els.length > 1) {
            while (els[c] !== domNode) c++;
            b += "[" + (c + 1) + "]";
        }
        bits.push(b.toLowerCase());
        return neighborXpathsGenerator.getAbsoluteXPath(p, bits);
    }
    return bits.reverse().join("/");
}

/**
 * @param: info-dense DOM
 * @return: An array of sorted indexPaths of elements in @param1
**/
neighborXpathsGenerator.getIndexPathsFromMatrix = function (matrix) {
    var indexPaths = [];
    for (var i = 0; i < matrix.length; i++) {
        var thisElement = matrix[i];
        if (thisElement) {
            indexPaths.push({ element: thisElement, indexPath: neighborXpathsGenerator.getIndexPath(thisElement) });
        }
    }
    return indexPaths;
}

/**
 * @param: string
 * @return: A position of the first encountered double or single quotes ( if any )
**/
neighborXpathsGenerator.getQuotePos = function (searchString) {
    var ret1 = searchString.indexOf('\'');
    var ret2 = searchString.indexOf('"');
    return (ret1 == -1) ? ret2 : ret1;
}

neighborXpathsGenerator.isDescendant = function (parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}