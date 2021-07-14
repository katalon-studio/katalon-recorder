const normalUserStateMapping = {
  record: {
    element: "#record",
    content:
      "<p>You can start creating automated scenarios immediately on any tab.</p> <strong>Tip: </strong>Refresh the tab first if you are unable to record.",
    placement: "bottom",

  },
  testSuite: {
    element: "#playSuite",
    content: "This is the play Suite button",
    placement: "bottom",
  },
  play: {
    element: "#playback",
    content:
      "<p>Execute the selected scenario on the currently active tab. </p>This allows you to seamlessly combine automated and manual steps in a workflow.",
    placement: "bottom",
  },
  "command-target": {
    element: ".command-row:has(#command-target)",
    content:
      "When your scenarios fail, try choosing another value from the target dropdown at the failed step.",
    placement: "bottom",
  },
  /*See KR-88 for why we need to remove these steps
  "adjust-speed": {
    element: "#speed",
    content:
      "Sometimes scenarios fail because they run too fast, try adjusting the execution speed.",
    placement: "left",
  },
  "adjust-speed-dropdown": {
    element: "#slider-container",
    content:
      "A slider is used to adjust the execution speed which, by default, is set to maximum.",
    placement: "left",
    //the slider need to be shown before the tour focus on
    onShow: (tour) => {
      $("#slider-container").show();
    },
    onHidden: (tour) => {
      $("#slider-container").hide();
    }
  },*/
  "sample-test-case": {
    element: "#suite0",
    content:
      "Finally, Katalon Recorder supports <a target='_blank' href='https://docs.katalon.com/katalon-recorder/docs/data-driven-execution.html'>data-driven execution</a>.  The “Book many healthcare appointments“ scenario demonstrates how it can be done.",
    placement: "bottom",
    onShown: (tour) => {
      $("#onboarding-end-btn").show();
    }
  },
  /*See KR-88 for why we need to remove these steps
  "data-driven-tab": {
    element: "#data-files",
    content:
      "You can add CSV or JSON files as data set to be used in data-driven execution.",
    placement: "bottom",
    onShow: (tour) => {
      $("#data-files").click();
    }
  },
  "add-CSV": {
    element: "#data-files-add-csv",
    content:
      "<p>You can add your CSV file here, and add JSON using the adjacent button.</p>",
    placement: "bottom",
  },
  "variables-tab": {
    element: "#variable-log",
    content: "You can see the values being used in data-driven execution.",
    placement: "bottom",
    onShown: (tour) => {
      $("#onboarding-end-btn").show();
    }
  },*/
};

const testerStateMapping = {
  /*See KR-88 for why we need to remove these steps
  "test-suite": {
    element: "#suite0 div.test-suite-title",
    content:
      "At the highest level of test artifacts, we have test suites. A test suite is a collection of test cases.",
    placement: "right",
  },
  "test-case": {
    element: "#case0",
    content: "A test case is a collection of test steps.",
    placement: "right",
  },*/
  "test-step": {
    element: "#records-1",
    content:
      "In KR, each test step is a command. A command acts on a target and optionally accepts an input.",
    placement: "bottom",
  },
  "reference-tab": {
    element: "#reference-log",
    content: "You can learn how to use a command by viewing the Reference tab.",
    placement: "bottom",
  },
  "choose-target": {
    element: "#selectElementButton",
    content:
      "Generate locators for an element and set them to the current command.",
    placement: "left",
  },
  "highlight-target": {
    element: "#showElementButton",
    content: "Highlight the element located by the target of the current command.",
    placement: "left",
  },
  "tester-record": {
    element: "#record",
    content:
      "Commands can be automatically recorded through your interactions with a web page.",
    placement: "bottom",
  },
  /*See KR-88 for why we need to remove these steps
  "build-manually": {
    element: "#command-toolbar-buttons",
    content:
      "Create test cases manually by adding, deleting, copying and pasting commands.",
    placement: "bottom",
  },
  "tester-play": {
    element: "#playback",
    content:
      "<p>Execute the selected test case on the currenly active tab. </p>This allows you to seamlessly combine manual and automated testing in a workflow.",
    placement: "bottom",
  },
  "play-suite": {
    element: "#playSuite",
    content: "Execute a specific test suite in the workspace.",
    placement: "bottom",
  },
  "play-all": {
    element: "#playSuites",
    content: "Execute all test suites in the workspace.",
    placement: "bottom",
  },
  pause: {
    element: "#pause",
    content: "Pause a test case or test suite execution.",
    placement: "bottom",
  },
  report: {
    element: "#ka-upload",
    content:
      "You can upload and view test executions with our free Katalon TestOps integration.",
    placement: "bottom",
  },
  export: {
    element: "#export",
    content:
      "You can export test cases to Katalon Studio, Selenium WebDriver, Protractor, Puppeteer, and other testing frameworks.",
    placement: "bottom",
  },*/
  breakpoint: {
    element: "#records-2",
    content:
      "Debug your tests by choosing Toggle Breakpoint from the context menu.",
    placement: "bottom",
  },
  "log-tab": {
    element: "#history-log",
    content: "Debug your tests by viewing the execution details.",
    placement: "bottom",
  },
  "screenshot-tab": {
    element: "#screenshot",
    content:
      "Debug your tests by looking at the screenshots.",
    placement: "bottom",
  },
  "tester-sample-test-case": {
    element: "#suite0",
    content:
        "Finally, Katalon Recorder also supports <a target='_blank' href='https://docs.katalon.com/katalon-recorder/docs/data-driven-execution.html'>data-driven testing</a>. The “Book many healthcare appointments“ test case demonstrates how it can be done.",
    placement: "bottom",
    onShown: (tour) => {
      $("#onboarding-end-btn").show();
    }
  },
  /*See KR-88 for why we need to remove these steps
  "tester-data-driven-tab": {
    element: "#data-files",
    content:
        "You can add CSV or JSON files as data set to be used in data-driven execution.",
    placement: "bottom",
    onShow: (tour) => {
      $("#data-files").click();
    }
  },
  "tester-add-CSV": {
    element: "#data-files-add-csv",
    content:
        "<p>You can add your CSV file here, and add JSON using the adjacent button.</p>",
    placement: "bottom",
  },
  "tester-variables-tab": {
    element: "#variable-log",
    content: "You can see the values being used in data-driven execution.",
    placement: "bottom",
    onShown: (tour) => {
      $("#onboarding-end-btn").show();
    }
  },*/
};

const stateMapping = {
  ...normalUserStateMapping,
  ...testerStateMapping,
};

export { stateMapping };
