var katEndpoint = getKatalonEndpoint();

var katalonUrls = {
  signUp: katEndpoint + "sign-up",
  getUserInfo: katEndpoint + "wp-json/restful_api/v1/auth/me"
}

const MODE = {
  RECORD: "record",
  PLAY: "play"
}

function getKatalonEndpoint() {
  var manifestData = browser.runtime.getManifest();
  return manifestData.homepage_url;
}

function checkLoginAndRecord() {
  checkLogin("record", function () {
    doRecord()
  });
}

function checkLoginAndPlay(callback) {
  checkLogin("play", callback)
}

async function getCheckLoginData() {
  let data = await browser.storage.local.get('checkLoginData');
  if (!data.checkLoginData) {
    data = {
      checkLoginData: {
        recordTimes: 0,
        playTimes: 0,
        hasLoggedIn: false,
        user: ""
      }
    };
  }
  return data;
}

function checkLogin(mode, callback) {
  getCheckLoginData().then(function (result) {
    if (!result.checkLoginData) {
      result = {
        checkLoginData: {
          recordTimes: 0,
          playTimes: 0,
          hasLoggedIn: false,
          user: ""
        }
      };
    }

    let checkLoginData = result.checkLoginData;

    if (mode === MODE.RECORD) {
      if (!checkLoginData.recordTimes) {
        checkLoginData.recordTimes = 0;
      }
      checkLoginData.recordTimes++;
    }

    if (mode === MODE.PLAY) {
      if (!checkLoginData.playTimes) {
        checkLoginData.playTimes = 0;
      }
      checkLoginData.playTimes++;
    }

    browser.storage.local.set(result);

    if ((checkLoginData.recordTimes >= 2 || checkLoginData.playTimes >= 2) && !checkLoginData.hasLoggedIn) {
      getLoggedInUser().then(user => {
        if (!user.email) {
          showLoginDialog((loggedInUser) => {
            isRecording = false;
            checkLoginData.hasLoggedIn = true;
            checkLoginData.user = loggedInUser.email;
            browser.storage.local.set(result);
          });
        } else {
          checkLoginData.hasLoggedIn = true;
          checkLoginData.user = user.email;
          browser.storage.local.set(result);
          callback();
        }
      })
    } else {
      callback();
    }
  });
}

function showLoginDialog(userLoggedInHandler) {
  let html = `
    <p>Great work! It's time to upgrade your experience.</br>Connect your free Katalon account to unlock all extended features.</p>
    <button id="kat-connect">Connect now</button>
    <p>If you already log in with your Katalon account, please <a id="refresh-login">click here</a> to continue your work.</p>
    <p>Not convinced yet? Take a look at the <a id="kr-doc" target="_blank" href="https://docs.katalon.com/katalon-recorder/docs/overview.html">bird's eye view</a> of the product to see what's in it for you!</p>
    <p id="warn-connect">Please connect your Katalon account to continue.</p>
  `;
  let dialog = showDialogWithCustomButtons(html, false);

  $('#kat-connect').click(() => {
    window.open(katalonUrls.signUp + "?utm_source=kr");
  });

  $('#refresh-login').click(() => {
    getLoggedInUser()
      .then(user => {
        if (user.email) {
          userLoggedInHandler(user);
          _gaq.push(['_trackEvent', "refresh-login", 'successful-login']);
          segmentService().then(r => r.trackingLogin());
          $(dialog).dialog('close');
        } else {
          let errorMessage = $('#warn-connect'); // this is hidden by default
          errorMessage.show();
        }
      });
  });

  return dialog;
}

function getLoggedInUser() {
  return $.ajax({
    url: katalonUrls.getUserInfo,
    type: 'GET'
  }).then(data => {
    let user;
    if (data.user_info) {
      user = { email: data.user_info };
    } else {
      user = {};
    }
    return Promise.resolve(user);
  }).catch(error => {
    console.log(error);
    return Promise.resolve({});
  })
}