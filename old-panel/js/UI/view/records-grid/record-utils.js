function getTdRealValueNode(node, index) {
    return node.getElementsByTagName("td")[index].getElementsByTagName("div")[0];
}

function getTdShowValueNode(node, index) {
    return node.getElementsByTagName("td")[index].getElementsByTagName("div")[1];
}

function getTargetDatalist(node) {
    return node.getElementsByTagName("td")[1].getElementsByTagName("datalist")[0];
}

function getCommandName(tr, for_show) {
    if (for_show) {
        return getTdShowValueNode(tr, 0).textContent;
    }
    return getTdRealValueNode(tr, 0).textContent;
}

function getCommandTarget(tr, for_show) {
    if (for_show) {
        return getTdShowValueNode(tr, 1).textContent;
    }
    return getTdRealValueNode(tr, 1).textContent;
}

function getCommandValue(tr, for_show) {
    if (for_show) {
        return getTdShowValueNode(tr, 2).textContent;
    }
    return getTdRealValueNode(tr, 2).textContent;
}

function getCommandTargets(tr) {
    if (tr === undefined) {
        return [];
    }
    return [...getTargetDatalist(tr).getElementsByTagName("option")].map(ele => ele.innerHTML);
}

export { getTdRealValueNode, getTdShowValueNode, getTargetDatalist, getCommandName, getCommandTarget, getCommandValue, getCommandTargets }