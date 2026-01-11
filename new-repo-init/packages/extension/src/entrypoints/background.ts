/**
 * Background service worker
 *
 * Handles extension lifecycle, messaging, and coordination between
 * content scripts and the panel UI.
 */

export default defineBackground(() => {
  console.log('Katalon Recorder v7 initialized');

  // Track recording state
  let isRecording = false;
  let recordingTabId: number | null = null;

  // Handle browser action click
  browser.action.onClicked.addListener(async (tab) => {
    await openPanel();
  });

  // Handle keyboard shortcuts
  browser.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle-recording') {
      await toggleRecording();
    } else if (command === 'open-panel') {
      await openPanel();
    }
  });

  // Message handling
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender)
      .then(sendResponse)
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicates async response
  });

  // Context menu
  browser.contextMenus.create({
    id: 'katalon-verify-text',
    title: 'Katalon: Verify Text',
    contexts: ['selection'],
  });

  browser.contextMenus.create({
    id: 'katalon-store-text',
    title: 'Katalon: Store Text',
    contexts: ['selection'],
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return;

    if (info.menuItemId === 'katalon-verify-text') {
      browser.tabs.sendMessage(tab.id, {
        type: 'ADD_COMMAND',
        command: {
          command: 'verifyText',
          target: '', // Will be filled by content script
          value: info.selectionText,
        },
      });
    } else if (info.menuItemId === 'katalon-store-text') {
      browser.tabs.sendMessage(tab.id, {
        type: 'ADD_COMMAND',
        command: {
          command: 'storeText',
          target: '',
          value: 'storedText',
        },
      });
    }
  });

  // Helper functions
  async function openPanel() {
    // Check if panel is already open
    const windows = await browser.windows.getAll({ populate: true });
    const panelUrl = browser.runtime.getURL('/panel/index.html');

    for (const window of windows) {
      if (window.tabs?.some((tab) => tab.url?.startsWith(panelUrl))) {
        // Focus existing panel
        await browser.windows.update(window.id!, { focused: true });
        return;
      }
    }

    // Open new panel window
    await browser.windows.create({
      url: panelUrl,
      type: 'popup',
      width: 450,
      height: 700,
    });
  }

  async function toggleRecording() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording(tab.id);
    }
  }

  async function startRecording(tabId: number) {
    isRecording = true;
    recordingTabId = tabId;

    // Inject content script if needed
    await browser.scripting.executeScript({
      target: { tabId },
      files: ['content-scripts/content.js'],
    });

    // Start recording in content script
    await browser.tabs.sendMessage(tabId, { type: 'START_RECORDING' });

    // Update icon to indicate recording
    await browser.action.setBadgeText({ text: 'REC' });
    await browser.action.setBadgeBackgroundColor({ color: '#ef4444' });
  }

  async function stopRecording() {
    if (!recordingTabId) return;

    isRecording = false;

    // Stop recording in content script
    const response = await browser.tabs.sendMessage(recordingTabId, {
      type: 'STOP_RECORDING',
    });

    recordingTabId = null;

    // Clear badge
    await browser.action.setBadgeText({ text: '' });

    return response;
  }

  async function handleMessage(
    message: { type: string; [key: string]: unknown },
    _sender: browser.Runtime.MessageSender
  ) {
    switch (message.type) {
      case 'GET_RECORDING_STATE':
        return { isRecording, recordingTabId };

      case 'START_RECORDING':
        if (typeof message.tabId === 'number') {
          await startRecording(message.tabId);
        }
        return { success: true };

      case 'STOP_RECORDING':
        return await stopRecording();

      case 'COMMAND_RECORDED':
        // Forward to panel
        await broadcastToPanel({
          type: 'COMMAND_RECORDED',
          command: message.command,
        });
        return { success: true };

      default:
        console.warn('Unknown message type:', message.type);
        return { error: 'Unknown message type' };
    }
  }

  async function broadcastToPanel(message: unknown) {
    const panelUrl = browser.runtime.getURL('/panel/index.html');
    const windows = await browser.windows.getAll({ populate: true });

    for (const window of windows) {
      for (const tab of window.tabs || []) {
        if (tab.url?.startsWith(panelUrl) && tab.id) {
          await browser.tabs.sendMessage(tab.id, message);
        }
      }
    }
  }
});
