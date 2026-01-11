/**
 * Content script - runs in the context of web pages
 *
 * Handles DOM event capture for recording and element interaction for playback.
 */

import { buildLocators } from '@katalon/core/locators';
import type { Command, Locator } from '@katalon/core/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  main(ctx) {
    let isRecording = false;
    const recordedCommands: Command[] = [];

    // Event handlers for recording
    const eventHandlers = {
      click: handleClick,
      dblclick: handleDoubleClick,
      change: handleChange,
      submit: handleSubmit,
      keydown: handleKeydown,
    };

    // Message listener
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      switch (message.type) {
        case 'START_RECORDING':
          startRecording();
          sendResponse({ success: true });
          break;

        case 'STOP_RECORDING':
          const commands = stopRecording();
          sendResponse({ success: true, commands });
          break;

        case 'EXECUTE_COMMAND':
          executeCommand(message.command)
            .then((result) => sendResponse(result))
            .catch((error) => sendResponse({ error: error.message }));
          return true; // Async response

        case 'HIGHLIGHT_ELEMENT':
          highlightElement(message.locator);
          sendResponse({ success: true });
          break;

        case 'GET_ELEMENT_LOCATORS':
          const locators = getElementLocators(message.selector);
          sendResponse({ locators });
          break;
      }
    });

    function startRecording() {
      if (isRecording) return;
      isRecording = true;
      recordedCommands.length = 0;

      // Attach event listeners
      for (const [event, handler] of Object.entries(eventHandlers)) {
        document.addEventListener(event, handler as EventListener, { capture: true });
      }

      console.log('Katalon Recorder: Recording started');
    }

    function stopRecording() {
      if (!isRecording) return recordedCommands;
      isRecording = false;

      // Remove event listeners
      for (const [event, handler] of Object.entries(eventHandlers)) {
        document.removeEventListener(event, handler as EventListener, { capture: true });
      }

      console.log('Katalon Recorder: Recording stopped', recordedCommands.length, 'commands');
      return [...recordedCommands];
    }

    function recordCommand(command: Omit<Command, 'id' | 'timestamp'>) {
      const fullCommand: Command = {
        ...command,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      recordedCommands.push(fullCommand);

      // Notify background script
      browser.runtime.sendMessage({
        type: 'COMMAND_RECORDED',
        command: fullCommand,
      });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as Element;
      if (!target || !isRecording) return;

      // Skip if it's a link with modifier (new tab, etc.)
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;

      const locators = buildLocators(target);

      recordCommand({
        command: 'click',
        target: formatLocator(locators[0]),
        value: '',
        locators,
      });
    }

    function handleDoubleClick(event: MouseEvent) {
      const target = event.target as Element;
      if (!target || !isRecording) return;

      const locators = buildLocators(target);

      recordCommand({
        command: 'doubleClick',
        target: formatLocator(locators[0]),
        value: '',
        locators,
      });
    }

    function handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!target || !isRecording) return;

      const locators = buildLocators(target);
      const tagName = target.tagName.toLowerCase();

      if (tagName === 'select') {
        const select = target as HTMLSelectElement;
        const selectedOption = select.options[select.selectedIndex];

        recordCommand({
          command: 'select',
          target: formatLocator(locators[0]),
          value: `label=${selectedOption.text}`,
          locators,
        });
      } else if (tagName === 'input') {
        const input = target as HTMLInputElement;

        if (input.type === 'checkbox' || input.type === 'radio') {
          recordCommand({
            command: input.checked ? 'check' : 'uncheck',
            target: formatLocator(locators[0]),
            value: '',
            locators,
          });
        } else {
          recordCommand({
            command: 'type',
            target: formatLocator(locators[0]),
            value: input.value,
            locators,
          });
        }
      } else if (tagName === 'textarea') {
        recordCommand({
          command: 'type',
          target: formatLocator(locators[0]),
          value: (target as HTMLTextAreaElement).value,
          locators,
        });
      }
    }

    function handleSubmit(event: Event) {
      const target = event.target as HTMLFormElement;
      if (!target || !isRecording) return;

      // Record submit if there's a submit button
      const submitButton = target.querySelector('[type="submit"]');
      if (submitButton) {
        const locators = buildLocators(submitButton);
        recordCommand({
          command: 'click',
          target: formatLocator(locators[0]),
          value: '',
          locators,
        });
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      const target = event.target as Element;
      if (!target || !isRecording) return;

      // Only capture special keys (Enter, Tab, Escape, etc.)
      const specialKeys = ['Enter', 'Tab', 'Escape', 'Backspace', 'Delete'];
      if (!specialKeys.includes(event.key)) return;

      const locators = buildLocators(target);

      recordCommand({
        command: 'sendKeys',
        target: formatLocator(locators[0]),
        value: `\${KEY_${event.key.toUpperCase()}}`,
        locators,
      });
    }

    function formatLocator(locator: Locator): string {
      switch (locator.strategy) {
        case 'css':
          return `css=${locator.value}`;
        case 'xpath':
          return `xpath=${locator.value}`;
        case 'id':
          return `id=${locator.value}`;
        case 'name':
          return `name=${locator.value}`;
        case 'linkText':
          return `linkText=${locator.value}`;
        default:
          return locator.value;
      }
    }

    async function executeCommand(command: Command) {
      // TODO: Implement command execution
      console.log('Executing command:', command);
      return { success: true };
    }

    function highlightElement(locatorString: string) {
      // TODO: Implement element highlighting
      console.log('Highlighting:', locatorString);
    }

    function getElementLocators(selector: string): Locator[] {
      const element = document.querySelector(selector);
      if (!element) return [];
      return buildLocators(element);
    }

    // Cleanup on context invalidation
    ctx.onInvalidated(() => {
      stopRecording();
    });
  },
});
