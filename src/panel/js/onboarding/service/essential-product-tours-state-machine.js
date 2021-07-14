const testerState = {
    /*See KR-88 for why we need to remove these steps
    "test-suite": {
        name: "test-suite",
        transitions: {
            next: {
                target: "test-case",
            },
            end: {
                target: "end",
            },
        },
    },
    "test-case": {
        name: "test-case",
        transitions: {
            next: {
                target: "test-step",
            },
            prev: {
                target: "test-suite",
            },
            end: {
                target: "end",
            },
        },
    },*/
    "test-step": {
        name: "test-step",
        transitions: {
            next: {
                target: "reference-tab",
            },
            prev: {
                target: "test-case",
            },
            end: {
                target: "end",
            },
        },
    },
    "reference-tab": {
        name: "reference-tab",
        transitions: {
            next: {
                target: "choose-target",
            },
            prev: {
                target: "test-step",
            },
            end: {
                target: "end",
            },
        },
    },
    "choose-target": {
        name: "choose-target",
        transitions: {
            next: {
                target: "highlight-target",
            },
            prev: {
                target: "reference-tab",
            },
            end: {
                target: "end",
            },
        },
    },
    "highlight-target": {
        name: "highlight-target",
        transitions: {
            next: {
                target: "tester-record",
            },
            prev: {
                target: "choose-target",
            },
            end: {
                target: "end",
            },
        },
    },
    "tester-record": {
        name: "tester-record",
        transitions: {
            next: {
                target: "breakpoint",
            },
            prev: {
                target: "highlight-target",
            },
            end: {
                target: "end",
            },
        },
    },
    /*
    See KR-88 for why we need to remove these steps
    "build-manually": {
        name: "build-manually",
        transitions: {
            next: {
                target: "tester-play",
            },
            prev: {
                target: "tester-record",
            },
            end: {
                target: "end",
            },
        },
    },

    "tester-play": {
        name: "tester-play",
        transitions: {
            next: {
                target: "play-suite",
            },
            prev: {
                target: "build-manually",
            },
            end: {
                target: "end",
            },
        },
    },
    "play-suite": {
        name: "play-suite",
        transitions: {
            next: {
                target: "play-all",
            },
            prev: {
                target: "tester-play",
            },
            end: {
                target: "end",
            },
        },
    },

    "play-all": {
        name: "play-all",
        transitions: {
            next: {
                target: "pause",
            },
            prev: {
                target: "play-suite",
            },
            end: {
                target: "end",
            },
        },
    },

    pause: {
        name: "pause",
        transitions: {
            next: {
                target: "report",
            },
            prev: {
                target: "play-all",
            },
            end: {
                target: "end",
            },
        },
    },
    report: {
        name: "report",
        transitions: {
            next: {
                target: "export",
            },
            prev: {
                target: "pause",
            },
            end: {
                target: "end",
            },
        },
    },
    export: {
        name: "export",
        transitions: {
            next: {
                target: "breakpoint",
            },
            prev: {
                target: "report",
            },
            end: {
                target: "end",
            },
        },
    },*/

    breakpoint: {
        name: "breakpoint",
        transitions: {
            next: {
                target: "log-tab",
            },
            prev: {
                target: "tester-record",
            },
            end: {
                target: "end",
            },
        },
    },
    "log-tab": {
        name: "log-tab",
        transitions: {
            next: {
                target: "screenshot-tab",
            },
            prev: {
                target: "breakpoint",
            },
            end: {
                target: "end",
            },
        },
    },
    "screenshot-tab": {
        name: "screenshot-tab",
        transitions: {
            next: {
                target: "tester-sample-test-case",
            },
            prev: {
                target: "log-tab",
            },
            end: {
                target: "end",
            },
        },
    },
    "tester-sample-test-case": {
        name: "tester-sample-test-case",
        transitions: {
            prev: {
                target: "screenshot-tab",
            },
            end: {
                target: "end",
            },
        },
    },
    /*See KR-88 for why we need to remove these steps
    "tester-data-driven-tab": {
      name: "tester-data-driven-tab",
      transitions: {
        next: {
          target: "tester-add-CSV",
        },
        prev: {
          target: "tester-sample-test-case",
        },
        end: {
          target: "end",
        },
      },
    },
    "tester-add-CSV": {
      name: "tester-variables-tab",
      transitions: {
        next: {
          target: "tester-variables-tab",
        },
        prev: {
          target: "tester-data-driven-tab",
        },
        end: {
          target: "end",
        },
      },
    },
    "tester-variables-tab": {
      name: "tester-variables-tab",
      transitions: {
        prev: {
          target: "tester-add-CSV",
        },
        end: {
          target: "end",
        },
      },
    },*/
};

const normalUserState = {
    record: {
        name: "record",
        transitions: {
            next: {
                target: "play",
            },
            end: {
                target: "end",
            },
        },
    },
    play: {
        name: "play",
        transitions: {
            next: {
                target: "command-target",
            },
            prev: {
                target: "record",
            },
            end: {
                target: "end",
            },
        },
    },
    "command-target": {
        name: "command-target",
        transitions: {
            next: {
                target: "sample-test-case",
            },
            prev: {
                target: "play",
            },
            end: {
                target: "end",
            },
        },
    },
    /*See KR-88 for why we need to remove these steps
    "adjust-speed": {
        name: "adjust-speed",
        transitions: {
            next: {
                target: "adjust-speed-dropdown",
            },
            prev: {
                target: "command-target",
            },
            end: {
                target: "end",
            },
        },
    },
    "adjust-speed-dropdown": {
        name: "adjust-speed-dropdown",
        transitions: {
            next: {
                target: "sample-test-case",
            },
            prev: {
                target: "adjust-speed",
            },
            end: {
                target: "end",
            },
        },
    },*/
    "sample-test-case": {
        name: "sample-test-case",
        transitions: {
            prev: {
                target: "command-target",
            },
            end: {
                target: "end",
            },
        },
    },
    /*See KR-88 for why we need to remove these steps
    "data-driven-tab": {
      name: "data-driven-tab",
      transitions: {
        next: {
          target: "add-CSV",
        },
        prev: {
          target: "sample-test-case",
        },
        end: {
          target: "end",
        },
      },
    },
    "add-CSV": {
      name: "add-CSV",
      transitions: {
        next: {
          target: "variables-tab",
        },
        prev: {
          target: "data-driven-tab",
        },
        end: {
          target: "end",
        },
      },
    },
    "variables-tab": {
      name: "variables-tab",
      transitions: {
        prev: {
          target: "add-CSV",
        },
        end: {
          target: "end",
        },
      },
    },*/
};

export const initialStateMachineDefinition = {
    initialState: "start",
    start: {
        name: "start",
        transitions: {
            dialog: {
                target: "dialog",
            },
        },
    },
    dialog: {
        name: "dialog",
        transitions: {
            chooseAsUser: {
                target: "record",
            },
            chooseAsTester: {
                target: "test-step",
            },
            end: {
                target: "end",
            },
        },
    },
    end: {
        name: "end",
    },
    ...normalUserState,
    ...testerState,
};
