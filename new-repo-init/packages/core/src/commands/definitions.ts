/**
 * Command definitions - schema and metadata for all supported commands
 */

import type { CommandDefinition } from '../types';

export const commandDefinitions: Record<string, CommandDefinition> = {
  // ============================================================================
  // Browser Commands
  // ============================================================================

  open: {
    name: 'open',
    description: 'Opens a URL in the current browser window',
    target: {
      required: true,
      description: 'URL to open (can be relative to base URL)',
    },
  },

  click: {
    name: 'click',
    description: 'Clicks on a target element',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  doubleClick: {
    name: 'doubleClick',
    description: 'Double-clicks on a target element',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  rightClick: {
    name: 'rightClick',
    description: 'Right-clicks on a target element (context menu)',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  type: {
    name: 'type',
    description: 'Types text into an input field (replaces existing content)',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Text to type',
    },
  },

  sendKeys: {
    name: 'sendKeys',
    description: 'Sends keystrokes to an element (appends to existing content)',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Keys to send (supports ${KEY_NAME} syntax)',
    },
  },

  select: {
    name: 'select',
    description: 'Selects an option from a dropdown',
    target: {
      required: true,
      description: 'Element locator for <select>',
    },
    value: {
      required: true,
      description: 'Option locator (label=X, value=X, index=N)',
    },
  },

  check: {
    name: 'check',
    description: 'Checks a checkbox or radio button',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  uncheck: {
    name: 'uncheck',
    description: 'Unchecks a checkbox',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  mouseOver: {
    name: 'mouseOver',
    description: 'Hovers the mouse over an element',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  dragAndDrop: {
    name: 'dragAndDrop',
    description: 'Drags an element and drops it on another element',
    target: {
      required: true,
      description: 'Source element locator',
    },
    value: {
      required: true,
      description: 'Target element locator',
    },
  },

  // ============================================================================
  // Wait Commands
  // ============================================================================

  waitForElementPresent: {
    name: 'waitForElementPresent',
    description: 'Waits for an element to be present in the DOM',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: false,
      description: 'Timeout in milliseconds (default: 30000)',
    },
  },

  waitForElementVisible: {
    name: 'waitForElementVisible',
    description: 'Waits for an element to be visible',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: false,
      description: 'Timeout in milliseconds (default: 30000)',
    },
  },

  waitForElementNotPresent: {
    name: 'waitForElementNotPresent',
    description: 'Waits for an element to be removed from the DOM',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: false,
      description: 'Timeout in milliseconds (default: 30000)',
    },
  },

  waitForText: {
    name: 'waitForText',
    description: 'Waits for element text to match expected value',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Expected text',
    },
  },

  pause: {
    name: 'pause',
    description: 'Pauses execution for a specified time',
    target: {
      required: true,
      description: 'Time in milliseconds',
    },
  },

  // ============================================================================
  // Assertion Commands
  // ============================================================================

  assertText: {
    name: 'assertText',
    description: 'Asserts that element text equals expected value (fails test if not)',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Expected text',
    },
  },

  assertElementPresent: {
    name: 'assertElementPresent',
    description: 'Asserts that an element is present in the DOM',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  assertElementNotPresent: {
    name: 'assertElementNotPresent',
    description: 'Asserts that an element is not present in the DOM',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  assertTitle: {
    name: 'assertTitle',
    description: 'Asserts that the page title equals expected value',
    target: {
      required: true,
      description: 'Expected title',
    },
  },

  assertValue: {
    name: 'assertValue',
    description: 'Asserts that an input value equals expected value',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Expected value',
    },
  },

  assertChecked: {
    name: 'assertChecked',
    description: 'Asserts that a checkbox/radio is checked',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  assertNotChecked: {
    name: 'assertNotChecked',
    description: 'Asserts that a checkbox/radio is not checked',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  // ============================================================================
  // Verify Commands (soft assertions - don't stop test on failure)
  // ============================================================================

  verifyText: {
    name: 'verifyText',
    description: 'Verifies that element text equals expected value (logs failure but continues)',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Expected text',
    },
  },

  verifyElementPresent: {
    name: 'verifyElementPresent',
    description: 'Verifies that an element is present in the DOM',
    target: {
      required: true,
      description: 'Element locator',
    },
  },

  verifyTitle: {
    name: 'verifyTitle',
    description: 'Verifies that the page title equals expected value',
    target: {
      required: true,
      description: 'Expected title',
    },
  },

  verifyValue: {
    name: 'verifyValue',
    description: 'Verifies that an input value equals expected value',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Expected value',
    },
  },

  // ============================================================================
  // Store Commands
  // ============================================================================

  store: {
    name: 'store',
    description: 'Stores a value in a variable',
    target: {
      required: true,
      description: 'Value to store',
    },
    value: {
      required: true,
      description: 'Variable name',
    },
  },

  storeText: {
    name: 'storeText',
    description: 'Stores the text of an element in a variable',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Variable name',
    },
  },

  storeValue: {
    name: 'storeValue',
    description: 'Stores the value of an input in a variable',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: true,
      description: 'Variable name',
    },
  },

  storeAttribute: {
    name: 'storeAttribute',
    description: 'Stores an attribute value in a variable',
    target: {
      required: true,
      description: 'Element locator@attribute',
    },
    value: {
      required: true,
      description: 'Variable name',
    },
  },

  storeTitle: {
    name: 'storeTitle',
    description: 'Stores the page title in a variable',
    target: {
      required: true,
      description: 'Variable name',
    },
  },

  storeWindowHandle: {
    name: 'storeWindowHandle',
    description: 'Stores the current window handle in a variable',
    target: {
      required: true,
      description: 'Variable name',
    },
  },

  echo: {
    name: 'echo',
    description: 'Prints a message to the log',
    target: {
      required: true,
      description: 'Message to print (supports ${variable} syntax)',
    },
  },

  // ============================================================================
  // Control Flow Commands
  // ============================================================================

  if: {
    name: 'if',
    description: 'Starts a conditional block',
    target: {
      required: true,
      description: 'Condition expression',
    },
  },

  elseIf: {
    name: 'elseIf',
    description: 'Alternative condition in an if block',
    target: {
      required: true,
      description: 'Condition expression',
    },
  },

  else: {
    name: 'else',
    description: 'Default branch in an if block',
  },

  end: {
    name: 'end',
    description: 'Ends a control flow block (if, while, forEach, times)',
  },

  while: {
    name: 'while',
    description: 'Starts a while loop',
    target: {
      required: true,
      description: 'Condition expression',
    },
    value: {
      required: false,
      description: 'Maximum iterations (default: 1000)',
    },
  },

  times: {
    name: 'times',
    description: 'Repeats commands a specified number of times',
    target: {
      required: true,
      description: 'Number of iterations',
    },
  },

  forEach: {
    name: 'forEach',
    description: 'Iterates over an array',
    target: {
      required: true,
      description: 'Array variable name',
    },
    value: {
      required: true,
      description: 'Iterator variable name',
    },
  },

  do: {
    name: 'do',
    description: 'Starts a do-while loop',
  },

  repeatIf: {
    name: 'repeatIf',
    description: 'Ends a do-while loop with a condition',
    target: {
      required: true,
      description: 'Condition expression',
    },
    value: {
      required: false,
      description: 'Maximum iterations (default: 1000)',
    },
  },

  // ============================================================================
  // Window Commands
  // ============================================================================

  selectWindow: {
    name: 'selectWindow',
    description: 'Switches to a different window or tab',
    target: {
      required: true,
      description: 'Window handle or handle=${varName}',
    },
  },

  selectFrame: {
    name: 'selectFrame',
    description: 'Switches to a frame or iframe',
    target: {
      required: true,
      description: 'Frame locator (index=N, relative=parent/top, or element locator)',
    },
  },

  close: {
    name: 'close',
    description: 'Closes the current window',
  },

  // ============================================================================
  // Script Commands
  // ============================================================================

  runScript: {
    name: 'runScript',
    description: 'Executes JavaScript in the page context',
    target: {
      required: true,
      description: 'JavaScript code to execute',
    },
  },

  executeScript: {
    name: 'executeScript',
    description: 'Executes JavaScript and optionally stores the result',
    target: {
      required: true,
      description: 'JavaScript code to execute',
    },
    value: {
      required: false,
      description: 'Variable name to store result',
    },
  },

  executeAsyncScript: {
    name: 'executeAsyncScript',
    description: 'Executes async JavaScript (call callback() when done)',
    target: {
      required: true,
      description: 'JavaScript code to execute',
    },
    value: {
      required: false,
      description: 'Variable name to store result',
    },
  },

  // ============================================================================
  // Misc Commands
  // ============================================================================

  setSpeed: {
    name: 'setSpeed',
    description: 'Sets the delay between commands',
    target: {
      required: true,
      description: 'Delay in milliseconds',
    },
  },

  setWindowSize: {
    name: 'setWindowSize',
    description: 'Sets the browser window size',
    target: {
      required: true,
      description: 'Dimensions (WxH, e.g., 1920x1080)',
    },
  },

  screenshot: {
    name: 'screenshot',
    description: 'Takes a screenshot of the current page',
    target: {
      required: false,
      description: 'Filename (optional)',
    },
  },

  run: {
    name: 'run',
    description: 'Runs another test case',
    target: {
      required: true,
      description: 'Test case name',
    },
  },
} as const;

export type CommandName = keyof typeof commandDefinitions;
