<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Command, TestCase } from '@katalon/core/types';

// State
const isRecording = ref(false);
const isPlaying = ref(false);
const currentTest = ref<TestCase | null>(null);
const commands = ref<Command[]>([]);
const selectedCommandIndex = ref<number | null>(null);

// Recording controls
async function toggleRecording() {
  if (isRecording.value) {
    await stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  await browser.runtime.sendMessage({
    type: 'START_RECORDING',
    tabId: tab.id,
  });

  isRecording.value = true;
}

async function stopRecording() {
  const response = await browser.runtime.sendMessage({
    type: 'STOP_RECORDING',
  });

  isRecording.value = false;

  if (response?.commands) {
    commands.value = [...commands.value, ...response.commands];
  }
}

// Playback controls
async function playAll() {
  if (commands.value.length === 0) return;
  isPlaying.value = true;

  for (let i = 0; i < commands.value.length; i++) {
    selectedCommandIndex.value = i;
    // TODO: Execute command
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  isPlaying.value = false;
  selectedCommandIndex.value = null;
}

async function playFromSelected() {
  if (selectedCommandIndex.value === null) return;
  // TODO: Implement play from selected
}

function stopPlayback() {
  isPlaying.value = false;
}

// Command editing
function selectCommand(index: number) {
  selectedCommandIndex.value = index;
}

function deleteCommand(index: number) {
  commands.value.splice(index, 1);
  if (selectedCommandIndex.value === index) {
    selectedCommandIndex.value = null;
  }
}

function addCommand() {
  const newCommand: Command = {
    id: crypto.randomUUID(),
    command: 'click',
    target: '',
    value: '',
    timestamp: Date.now(),
  };

  if (selectedCommandIndex.value !== null) {
    commands.value.splice(selectedCommandIndex.value + 1, 0, newCommand);
    selectedCommandIndex.value++;
  } else {
    commands.value.push(newCommand);
    selectedCommandIndex.value = commands.value.length - 1;
  }
}

// Listen for recorded commands
onMounted(() => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'COMMAND_RECORDED') {
      commands.value.push(message.command);
    }
  });
});
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-900">Katalon Recorder</h1>
        <span class="text-xs text-gray-500">v7.0.0</span>
      </div>
    </header>

    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      <!-- Record button -->
      <button
        @click="toggleRecording"
        :class="[
          'px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5',
          isRecording
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        <span
          :class="['w-2 h-2 rounded-full', isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400']"
        ></span>
        {{ isRecording ? 'Stop' : 'Record' }}
      </button>

      <div class="w-px h-6 bg-gray-300"></div>

      <!-- Playback buttons -->
      <button
        @click="playAll"
        :disabled="isPlaying || commands.length === 0"
        class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Play all"
      >
        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
          />
        </svg>
      </button>

      <button
        @click="stopPlayback"
        :disabled="!isPlaying"
        class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Stop"
      >
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.75 3A1.75 1.75 0 004 4.75v10.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0016 15.25V4.75A1.75 1.75 0 0014.25 3h-8.5z" />
        </svg>
      </button>

      <div class="flex-1"></div>

      <!-- Add command -->
      <button
        @click="addCommand"
        class="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
      >
        + Add
      </button>
    </div>

    <!-- Command list -->
    <div class="flex-1 overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left font-medium text-gray-600 w-8">#</th>
            <th class="px-3 py-2 text-left font-medium text-gray-600">Command</th>
            <th class="px-3 py-2 text-left font-medium text-gray-600">Target</th>
            <th class="px-3 py-2 text-left font-medium text-gray-600">Value</th>
            <th class="px-3 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cmd, index) in commands"
            :key="cmd.id"
            @click="selectCommand(index)"
            :class="[
              'border-b border-gray-100 cursor-pointer',
              selectedCommandIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50',
              isPlaying && selectedCommandIndex === index ? 'bg-yellow-50' : '',
            ]"
          >
            <td class="px-3 py-2 text-gray-400">{{ index + 1 }}</td>
            <td class="px-3 py-2 font-mono text-blue-600">{{ cmd.command }}</td>
            <td class="px-3 py-2 font-mono text-gray-700 truncate max-w-[200px]">
              {{ cmd.target }}
            </td>
            <td class="px-3 py-2 font-mono text-gray-500 truncate max-w-[150px]">
              {{ cmd.value }}
            </td>
            <td class="px-3 py-2">
              <button
                @click.stop="deleteCommand(index)"
                class="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="commands.length === 0">
            <td colspan="5" class="px-3 py-8 text-center text-gray-400">
              No commands recorded. Click "Record" to start.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Status bar -->
    <footer class="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
      <span v-if="isRecording" class="text-red-600">Recording...</span>
      <span v-else-if="isPlaying" class="text-yellow-600">Playing...</span>
      <span v-else>{{ commands.length }} commands</span>
    </footer>
  </div>
</template>
