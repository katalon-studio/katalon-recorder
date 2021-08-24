function enableButton(buttonId) {
  document.getElementById(buttonId).disabled = false;
}

function disableButton(buttonId) {
  document.getElementById(buttonId).disabled = true;
}

export { enableButton, disableButton }