var checkAutomated = navigator.webdriver;
browser.runtime.sendMessage({
  command: "checkForAutomated",
  isAutomated: checkAutomated,
});
