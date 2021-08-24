let loginSignup = `
<style>
.no-titlebar .ui-dialog-titlebar {
  display: none;
}
#dialgue.ui-dialog-content.ui-widget-content{
  padding: 0!important;
}
h2 {
  margin-left: 48px;
  margin-right: 48px;
}
.content-signin{
  font-family: Roboto;
  font-style: normal;
  text-align:center;
  margin-top: 15px
}
.io-toggler{
  cursor:pointer;
  display:inline-block;
  position:relative;
  font:15px sans-serif;
  background: #FFE9EA;
  color:#4F4F4F;
  border:4px solid transparent;
  border-radius: 32px;
  user-select:none;
  -webkit-user-select:none;
  -webkit-touch-callout:none;
  margin-bottom:10px;
}
.io-options{
  font-weight: bold;
  border-radius:32px;
  top:0;
  left:0;
  overflow:hidden;
}
.io-options span{
  position:relative;
  text-align:center;
  display:inline-block;
  padding: 3px 20px;
}
.io-options + .io-options{
  position:absolute;
  background:#E8505B;
  width:50%;
  height:100%;
  white-space:nowrap;
}
.io-options + .io-options span{
  color:#F2F2F2;
}
input[type=email],input[type=password],input[type=text]{
  padding-left: 10px;
  width: 60%;
  height: 30px;
  margin: 5px;
  border: 2px solid #999;
  border-radius: 5px;
  font:15px sans-serif;
}

#sign-up, #sign-in, #ignore-1, #ignore-2{
  width: 40%;
  height: 30px;
  font:15px sans-serif;
}

#sign-up, #sign-in {
  width: 50%;
  color: #f1f1f4;
  background: #c94c4c;
  border: none;
  border-radius: 8px;
  margin-bottom: 10px;
}

#ignore-1, #ignore-2 {
  width: 50%;
  color: #BDBDBD;
  background: white;
  border:none;
}

.button-login{
  padding: 5% 0% 5% 0%;
  margin-left: 12px;
}
#error-login1,#error-login2{
  color: #ff0000d6;
  font-style: italic;
}

.block-input label {
  display: inline-block;
  width: 80px;
  text-align: left;
  font:15px sans-serif;
  font-weight: bold;
}

.block-input i {
  margin-left: -25px;
  margin-top: 16px;
  margin-right: 12px;
  position: relative
}​
</style>
<div style="text-align: center; background: #E3EFF8;">
  <img src="images/bg1.png" style="width: 90%;">
</div>
<div class="content-signin">
  <div>
    <span class="io-toggler" data-io="0">
      <span class="io-options">
        <span>Sign up</span>
        <span>Sign in</span>
      </span>
    </span>
  </div>
  <div id="signin">
  <h2>Heaven is a place without all the repetitive tasks</h2>
  <div>
    <div class="block-input">
    <label>Email</label>
    <input id="email-signin" type="email" name="email" required>
    </div>
    <div class="block-input">
    <label>Password</label>
    <input id="pass-signin" type="password" placeholder="Minimun 8 characters" name="password" required>
    <i class="fa fa-eye-slash" id="toggle-pass1" toggle="#pass-signin"></i>
    </div>
    <div>
      <span id="error-login1"></span>
    </div>
    <div class="button-login">
      <button id="sign-in" type="button">Sign in</button>
      <button id="ignore-1" type="button"><u>Maybe later</u></button>
    </div>
  </div>
  </div>
  <div id="signup">
  <h2>
    Let's automate away all the hassles!
  </br>
    Join us on a quest for simplicity
  </h2>
  <div>
    <div class="block-input">
    <label>Full name</label>
    <input id="name" type="text" name="Fullname" required>
    </div>
    <div class="block-input">
    <label>Email</label>
    <input id="email" type="email" name="email" required>
    </div>
    <div class="block-input" id="block-pass">
    <label>Password</label>
    <input id="pass" type="password" name="password" placeholder="Minimun 8 characters" required>
    <i class="fa fa-eye-slash" id="toggle-pass" toggle="#pass"></i>
    </div>
    <div>
      <span id="error-login2"></span>
    </div>
    <div class="button-login">
      <button id="sign-up" type="button">Create account</button>
      <button id="ignore-2" type="button"><u>Maybe later</u></button>
    </div>
  </div>
  </div>
</div>  
`;

function togglerButton(data) {
    $(".io-toggler").each(function() {
        var io = $(this).data("io"),
            $opts = $(this).find(".io-options"),
            $clon = $opts.clone(),
            $span = $clon.find("span"),
            width = $opts.width() / 2;

        $(this).append($clon);

        function swap(x) {
            $clon.stop().animate({ left: x }, 150);
            $span.stop().animate({ left: -x }, 150);
            $(this).data("io", x === 0 ? 0 : 1);
            if (x === 0) {
                $("#signup").show();
                $("#signin").hide();
            } else {
                $("#signin").show();
                $("#signup").hide();
            }
        }

        $clon.draggable({
            axis: "x",
            containment: "parent",
            drag: function(evt, ui) {
                $span.css({ left: -ui.position.left });
            },
            stop: function(evt, ui) {
                swap(ui.position.left < width / 2 ? 0 : width);
            },
        });

        $opts.on("click", function() {
            swap($clon.position().left > 0 ? 0 : width);
        });

        if (data) {
            $opts.click();
        }

        // Read and set initial predefined data-io
        if (!!io) $opts.trigger("click");
        // on submit read $(".io-toggler").data("io") value
    });
}

function setUserLogin(rs, isLoggedIn) {
    if (isLoggedIn) {
        browser.storage.local.get("checkLoginData").then(function(result) {
            let checkLoginData = result.checkLoginData;

            if (rs.data.jwt) {
                checkLoginData.user = rs.email;
                checkLoginData.hasLoggedIn = true;

                const options = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${rs.data.jwt}`,
                        "Content-Type": "application/json",
                    },
                };
                fetch(getKatalonAPI().checkActived, options)
                    .then((rs) => rs.json())
                    .then((rs) => {
                        let check = false;
                        if (rs.data.status !== "NEW") {
                            checkLoginData.isActived = true;
                            check = true;
                        } else {
                            check = false;
                        }
                        browser.storage.local.set(result);
                        return check;
                    })
                    .then((check) => {
                        if (check) {
                            segmentTrackingService().then((r) => r.trackingLogin());
                            _gaq.push(['_trackEvent', 'kru_registration', 'kru_sign_in']);
                            $(dialogSignIn).dialog("close");
                        } else {
                            $("#sign-in").text("Sign in");
                            $("#error-login1")
                                .css("color", "#ff0000d6")
                                .html(
                                    '<span>This email is not verified yet. Please check your inbox, or go to <a target="_blank" href="https://my.katalon.com/profile">My Account</a> to finish the process.<span>'
                                );
                        }
                    });
            }
        });
    } else {
        let emailSignup = $("#email").val();
        let passSignup = $("#pass").val();

        if (emailSignup && passSignup) {
            $("#email-signin").val(emailSignup);
            $("#pass-signin").val(passSignup);
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("pass").value = "";
        }
        $("#error-login1")
            .css("color", "rgb(54, 179, 126)")
            .html(
                "Sign up successfully, please sign in to start using Katalon Recorder."
            );
        $("#sign-up").text("Sign up");
        togglerButton(true);
    }
}

function togglePassword(toggle) {
    $(toggle).toggleClass("fa-eye-slash fa-eye");
    var input = $($(toggle).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
}

function getKatalonAPI() {
    const endpoint = `https://www.katalon.com/wp-json/restful_api/v1/user`;
    const endpointAPI = "https://api.katalon.com/auth";
    const url = {
        signup: `${endpoint}/create-new-account`,
        signin: `${endpointAPI}/login`,
        checkActived: `${endpointAPI}/me`,
    };
    return url;
}

const segmentTrackingService = async function() {
    const segmentSer = await
    import ("../../panel/js/tracking/segment-tracking-service.js");
    return segmentSer;
};

const dialogSignIn = $('<div id="dialgue"></div>')
    .html(loginSignup)
    .dialog({
        dialogClass: "no-titlebar",
        autoOpen: false,
        resizable: false,
        height: 530,
        width: 450,
        modal: true,
        open: function() {
            togglerButton(false);
            $("#signup").show();
            $("#signin").hide();
        },
        close: function() {
            $(this).hide();
        },
        closeOnEscape: false
    });

function setLoginOrSignup() {
    $(dialogSignIn).dialog("open");

    $("#ignore-1").click(() => {
        $(dialogSignIn).dialog("close");
    });

    $('#pass').focusin(() => {
        $('#block-pass').append(`<div id="req-pass" class="tooltip">
        <span style="color: steelblue;margin-left: 27px;">Password Requirements</span>
        <ul style="margin-block-end: 0;margin-block-start: 0;">
          <li>1 upper and lowercase letter</li>
          <li>1 special character (e.g. @,#,$,...)</li>
          <li>At least 8 characters</li>
          <li>Do not allow space</li>
        </ul>
      </div>`).show();

        $('#req-pass').css({
            'position': 'absolute',
            'display': 'block',
            'border': '1px solid #000000',
            'background-color': 'white',
            'color': 'black',
            'padding': '5px',
            'border-radius': '10px',
            'z-index': 2,
            'text-align': 'left',
            'margin-left': '123px',
            'opacity': 1
        });
    });
    $('#pass').focusout(() => {
        $('#req-pass').remove();
    })

    $("#sign-in").click(() => {
        let email = $("#email-signin").val();
        let pass = $("#pass-signin").val();

        if (!email || !pass) {
            $("#error-login1").text("Please fill in all the fields.");
        } else {
            $("#sign-in").text("Processing.....");

            let options = {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                }),
            };

            fetch(getKatalonAPI().signin, options)
                .then((rp) => rp.json())
                .then(async(rs) => {
                    if (!rs.errors) {
                        rs.email = email;
                        await setUserLogin(rs, true);
                    } else {
                        $("#sign-in").text("Sign-in");
                        $("#error-login1")
                            .css("color", "#ff0000d6")
                            .text("Wrong username or password, please try again.");
                    }
                });
        }
    });

    $("#ignore-2").click(() => {
        $(dialogSignIn).dialog("close");
    });

    $("#sign-up").click(() => {
        let name = $("#name").val();
        let email = $("#email").val();
        let pass = $("#pass").val();

        if (name == "" || email == "" || pass == "") {
            $("#error-login2").text("Please fill in all the fields.");
        } else {
            // if (new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$').test(pass)) {
            $("#sign-up").text("Processing.....");
            const dataBody = new FormData();
            dataBody.append("user_login", name);
            dataBody.append("user_email", email);
            dataBody.append("user_pass", pass);
            dataBody.append("source_from", "Katalon Recorder");

            let options = {
                method: "POST",
                body: dataBody,
            };

            fetch(getKatalonAPI().signup, options)
                .then((rp) => rp.json())
                .then(async(rs) => {
                    if (!rs.error) {
                        segmentTrackingService().then((r) => r.trackingSignup());
                        _gaq.push(['_trackEvent', 'kru_registration', 'kru_sign_in']);
                        await setUserLogin(rs, false);
                    } else {
                        $("#sign-up").text("Sign up");
                        $("#error-login2").text(rs.message);
                    }
                });
            // } else {
            //     $("#sign-up").text("Sign up");
            //     $("#error-login2").text('Invalid password! Please try again!');
            // }
        }
    });

    $("#toggle-pass").on("click", function() {
        togglePassword(this);
    });
    $("#toggle-pass1").on("click", function() {
        togglePassword(this);
    });
}



function popupCreateMoreTestCase() {
    let popup = $("#createTestMoreCaseDialog");
    if (popup.length) {
        $(popup).show().effect("shake");
        return;
    }

    let dialogHTML = `
    <div style="text-align:center; font-size: 15px;"><strong>Is it time to automate more?</strong></div>
    </br>
    <span>
    One automation script can do plenty of things. If you need to automate more scenarios, create <b>a free account</b> (see <b><a target="_blank" href="https://docs.katalon.com/katalon-recorder/docs/faq-and-troubleshooting-instructions.html#why-should-i-sign-up-for-a-free-account"> Why should I sign up</a></b>).
    </span>
    </br>
    </br>
    <span>
    In the mean time, you can freely modify and execute the existing automation script until it does what you want it to do.
    </span>
    <style>
        .createTestCaseBtn{
            border-radius: 5px;
            padding: 5px;
            border: none;
            color: black
        }
        #createTestCase-later:hover{
            background-color: #d7dbdb;
        }
        #createTestCase-okay{
            background-color: #3366FF;
            color: white;
            border-radius: 5px;
        }
        #createTestCase-okay:hover{
            background-color: #1d42af;
        }
    </style>
    <div style="margin-top:10px; text-align: right">
        <button id="createTestCase-later" class="createTestCaseBtn" type="button" style="margin-right: 10px"><u>Maybe later</u></button>
        <button id="createTestCase-okay" class="createTestCaseBtn" type="button">Yes, I want more</button>
    </div>`;

    popup = $('<div id="createTestMoreCaseDialog"></div>').css({
        'position': 'absolute',
        'display': 'none',
        'bottom': '50px',
        'z-index': '1',
        'background-color': '#f1f1f1',
        'max-width': '300px',
        'box-shadow': '0px 8px 16px 0px rgba(0,0,0,0.2)',
        'padding': '10px',
        'margin-bottom': '-1%',
        'right': '0',
        'color': "black"

    }).html(dialogHTML);
    $("body").append(popup);

    $("#createTestCase-later").click(function() {
        $(popup).hide();
    });

    $("#createTestCase-okay").click(function() {
        setLoginOrSignup();
        $(popup).hide();
    });
    $(popup).show().effect("shake")

}



export async function checkLoginOrSignupUser() {
    const createTestCaseThreshold = 1;
    let result = await browser.storage.local.get("checkLoginData");
    if (!result.checkLoginData) {
        result = {
            checkLoginData: {
                recordTimes: 0,
                playTimes: 0,
                hasLoggedIn: false,
                user: "",
                isActived: false,
                testCreated: 0
            },
        };
    }
    let checkLoginData = result.checkLoginData;

    if (!checkLoginData.isActived && checkLoginData.testCreated >= createTestCaseThreshold) {
        popupCreateMoreTestCase()
        return false;
    }
    if (!checkLoginData.playTimes) {
        checkLoginData.playTimes = 0;
    }
    checkLoginData.playTimes++;
    browser.storage.local.set(result);
    return true;
}