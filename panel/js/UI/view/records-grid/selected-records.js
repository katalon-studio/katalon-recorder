const getSelectedRecords = () => {
  const selectedNode = document.getElementById("records-grid").getElementsByClassName("selectedRecord");
  if (selectedNode.length) {
    return selectedNode;
  } else {
    return "";
  }
}

function getSelectedRecord() {
  var selectedNode = document.getElementById("records-grid")
    .getElementsByClassName("selectedRecord");
  if (selectedNode.length) {
    return selectedNode[0].id;
  } else {
    return "";
  }
}

export { getSelectedRecords, getSelectedRecord }