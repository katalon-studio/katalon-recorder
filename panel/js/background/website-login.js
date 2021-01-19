var katEndpoint = getKatalonEndpoint();

var katalonUrls = {
  signUp: `${katEndpoint}/sign-up`,
  getUserInfo: `${katEndpoint}/wp-json/restful_api/v1/auth/me`
}

function getKatalonEndpoint() {
  var manifestData = chrome.runtime.getManifest();
  return manifestData.homepage_url;
}

function checkLoginAfterExecution() {
  chrome.storage.local.get('checkLoginData', function (result) {
    if (!result.checkLoginData) {
      result = {
        checkLoginData: {
          executionTimes: 0,
          hasLoggedIn: false
        }
      };
    }

    let data = result.checkLoginData;
    if (data.executionTimes >= 2 && !data.hasLoggedIn) {
      getLoggedInStatus().then(status => {
        if (!status.isLoggedIn) {
          let dialog = showLoginDialog();
          waitForLogInFinished(() => {
            $(dialog).dialog("close");
            data.hasLoggedIn = true;
            browser.storage.local.set(result);
          });
        }
      })     
    }

    data.executionTimes++;
    browser.storage.local.set(result);
  });
}

function showLoginDialog() {
  let html = `
    <p>Great work! It's time to upgrade your experience.</p>
    <p>Connect your free Katalon account to unlock all extended features.</p>`;
  let dialog = showDialogWithCustomButtons(html, {
    'Connect now': function () {
      window.open(katalonUrls.signUp + "?utm_source=kr");
    }
  });
  return dialog;
}

function waitForLogInFinished(userLoggedInHandler) {
  getLoggedInStatus().then(status => {
    if (status.isLoggedIn) {
      userLoggedInHandler();
    } else {
      setTimeout(() => waitForLogInFinished(userLoggedInHandler), 500);
    }
  })
}

function getLoggedInStatus() {
  return $.ajax({
    url: katalonUrls.getUserInfo,
    type: 'GET'
  }).then(data => {
    if (data.user_info) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
    return Promise.resolve({ isLoggedIn });
  })
}