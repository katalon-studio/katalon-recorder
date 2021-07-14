var runMode = RUN_MODE_IDLE;

if (!window.console) {
    console = {
        log : function() {
        }
    };
}

// for Firefox
if (!detectChrome() && !detectIE() && !(typeof self === 'undefined')) {
    self.on('message', function(message) {
        if (message.kind == "postSuccess") {
            console.log("POST recorded element successful")
        } else if (message.kind == "postFail") {
            alert(message.text);
        }
    });
}

browser.runtime.onMessage.addListener(function(request, sender, callback) {
    if (!request.action) {
        return;
    }
    switch (request.action) {
    case START_ADDON:
        start(request.runMode, request.data, request.version);
        break;
    case STOP_ADDON:
        stop();
        break;
    }
});

browser.runtime.sendMessage({
    action : CHECK_ADDON_START_STATUS
}).then(function(response) {
  start(response.runMode, response.data, response.version);
});

function start(newRunMode, data, version) {
    console.log("in Start" + version);
    switch (newRunMode) {
    case RUN_MODE_OBJECT_SPY:
        startObjectSpy(data);
        break;
    case RUN_MODE_RECORDER:
        startRecorder(version);
        break;
    case RUN_MODE_IDLE: 
        stop();
        break;
    }
}

function startObjectSpy(data) {
    if (runMode !== RUN_MODE_IDLE) {
      stop();
    }
    console.log("Starting Object Spy");
    katalonReady(function() {
      startInspection(data);
      startGetRequestSchedule();
      runMode = RUN_MODE_OBJECT_SPY;
    });
  }

function startRecorder(version) {
    if (runMode !== RUN_MODE_IDLE) {
        stop();
    }
    
    console.log("Starting Recorder")
    $('document').ready(function() {
        startRecord(version);
        runMode = RUN_MODE_RECORDER;
    });
}

function stop() {
    if (runMode === RUN_MODE_RECORDER) {
        endRecord();
    } else if (runMode === RUN_MODE_OBJECT_SPY) {
        endInspection();
    }
    runMode = RUN_MODE_IDLE;
}

function katalonReady(callback) {
    if (document.readyState === "complete") {
      callback();
    } else {
      runOnce(callback);
    }
  }
  
  function runOnce(callback) {
    var run = false;
    document.addEventListener("DOMContentLoaded", function() {
      if (run) {
        return;
      }
      callback();
      run = true;
    });
    $("document").ready(function() {
      if (run) {
        return;
      }
      callback();
      run = true;
    });
  }
