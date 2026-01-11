# Katalon Recorder Next (v7)

> A modern, AI-powered browser extension for test automation

## Overview

Katalon Recorder Next is a complete rebuild of Katalon Recorder, designed for the modern web. It addresses the architectural limitations of the legacy codebase while adding powerful new capabilities.

### Why Rebuild?

| Challenge | Legacy (v6) | Next (v7) |
|-----------|-------------|-----------|
| Chrome Manifest | V2 (deprecated) | V3 (future-proof) |
| Language | JavaScript (91k LOC) | TypeScript (~21k LOC) |
| Build System | None | WXT Framework |
| `eval()` usage | Unsafe, MV3 blocked | Safe expression parser |
| AI Integration | Basic self-healing | BYOK (Anthropic, OpenAI, Google) |
| Agent Control | None | MCP Server |
| Architecture | Monolith | Modular packages |

### Goals

1. **MV3 Compatible** - Future-proof Chrome extension
2. **Type Safe** - Full TypeScript with strict mode
3. **AI Native** - BYOK integration for healing, generation, explanation
4. **Agent Ready** - MCP server for coding agent control
5. **Modern DX** - Hot reload, fast tests, clean architecture
6. **Backwards Compatible** - Import legacy test suites

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         KATALON RECORDER v7                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│    │  Extension  │────▶│   Native    │────▶│    MCP      │             │
│    │    (MV3)    │◀────│   Bridge    │◀────│   Server    │             │
│    └──────┬──────┘     └─────────────┘     └─────────────┘             │
│           │                                                              │
│           ▼                                                              │
│    ┌─────────────────────────────────────────────────────────┐         │
│    │                      @katalon/core                       │         │
│    ├─────────────┬─────────────┬─────────────┬───────────────┤         │
│    │  Recorder   │   Player    │   Healing   │   Storage     │         │
│    └─────────────┴─────────────┴─────────────┴───────────────┘         │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────┐         │
│    │                     @katalon/ai                          │         │
│    ├─────────────┬─────────────┬─────────────────────────────┤         │
│    │  Anthropic  │   OpenAI    │   Google Gemini             │         │
│    └─────────────┴─────────────┴─────────────────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Package Overview

| Package | Description | Dependencies |
|---------|-------------|--------------|
| `@katalon/core` | Business logic, commands, engines | None (isomorphic) |
| `@katalon/extension` | Browser extension (WXT) | `@katalon/core` |
| `@katalon/formatters` | Export to Playwright, Cypress, etc. | `@katalon/core` |
| `@katalon/mcp-server` | MCP protocol for agent control | `@katalon/core` |
| `@katalon/native-bridge` | Native helper app (Rust) | None |
| `@katalon/ai` | BYOK AI provider integrations | `@katalon/core` |

---

## Technology Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.4+ | Language |
| WXT | 0.19+ | Extension framework |
| Vue 3 | 3.4+ | UI components |
| Pinia | 2.1+ | State management |
| Tailwind CSS | 3.4+ | Styling |
| expr-eval | 2.0+ | Safe expression parsing |

### Development

| Technology | Version | Purpose |
|------------|---------|---------|
| pnpm | 9+ | Package manager |
| Vitest | 1.3+ | Unit testing |
| Playwright | 1.42+ | E2E testing |
| ESLint | 8.57+ | Linting |
| Prettier | 3+ | Formatting |

### Native Bridge (Optional)

| Technology | Version | Purpose |
|------------|---------|---------|
| Rust | 1.75+ | Native code |
| Tauri | 2.0+ | App framework |

---

## Project Structure

```
katalon-recorder-next/
├── packages/
│   ├── core/                          # @katalon/core
│   │   ├── src/
│   │   │   ├── commands/              # Command definitions & executors
│   │   │   │   ├── definitions.ts     # Command schema & metadata
│   │   │   │   ├── browser.ts         # click, type, select, navigate
│   │   │   │   ├── assertions.ts      # verify*, assert*, waitFor*
│   │   │   │   ├── control-flow.ts    # if, else, while, forEach, times
│   │   │   │   ├── store.ts           # store*, echo, execute
│   │   │   │   └── index.ts
│   │   │   ├── locators/              # Locator strategies
│   │   │   │   ├── builder.ts         # Generate locators from element
│   │   │   │   ├── resolver.ts        # Find element from locator
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── role.ts        # ARIA role-based
│   │   │   │   │   ├── test-id.ts     # data-testid
│   │   │   │   │   ├── text.ts        # Text content
│   │   │   │   │   ├── css.ts         # CSS selectors
│   │   │   │   │   └── xpath.ts       # XPath
│   │   │   │   └── index.ts
│   │   │   ├── recorder/              # Recording engine
│   │   │   │   ├── RecorderCore.ts    # Main recorder class
│   │   │   │   ├── EventCapture.ts    # DOM event handling
│   │   │   │   ├── CommandBuilder.ts  # Event -> Command
│   │   │   │   └── filters/           # Deduplication, cleanup
│   │   │   ├── player/                # Playback engine
│   │   │   │   ├── PlaybackEngine.ts  # Main player class
│   │   │   │   ├── CommandRunner.ts   # Execute single command
│   │   │   │   ├── ExpressionEval.ts  # Safe eval via expr-eval
│   │   │   │   └── ControlFlow.ts     # Loop/conditional handling
│   │   │   ├── healing/               # Self-healing
│   │   │   │   ├── HealingService.ts  # Orchestration
│   │   │   │   ├── LocatorMatcher.ts  # Fuzzy matching
│   │   │   │   └── strategies/        # Healing strategies
│   │   │   ├── storage/               # Test persistence
│   │   │   │   ├── TestStore.ts       # CRUD operations
│   │   │   │   ├── formats/           # .side, .kr, JSON
│   │   │   │   └── migration/         # Legacy format import
│   │   │   ├── types/                 # Shared TypeScript types
│   │   │   │   ├── commands.ts
│   │   │   │   ├── locators.ts
│   │   │   │   ├── tests.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts               # Public API
│   │   ├── tests/
│   │   │   ├── commands/
│   │   │   ├── locators/
│   │   │   ├── recorder/
│   │   │   └── player/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── extension/                     # @katalon/extension (WXT)
│   │   ├── entrypoints/
│   │   │   ├── background.ts          # Service worker
│   │   │   ├── content.ts             # Content script
│   │   │   ├── sandbox.html           # Sandboxed iframe for eval
│   │   │   ├── sandbox.ts
│   │   │   ├── panel/                 # Main panel UI
│   │   │   │   ├── index.html
│   │   │   │   ├── main.ts
│   │   │   │   ├── App.vue
│   │   │   │   ├── components/
│   │   │   │   │   ├── TestSuiteTree.vue
│   │   │   │   │   ├── CommandTable.vue
│   │   │   │   │   ├── CommandEditor.vue
│   │   │   │   │   ├── LocatorPicker.vue
│   │   │   │   │   ├── PlaybackControls.vue
│   │   │   │   │   └── ExportDialog.vue
│   │   │   │   ├── stores/
│   │   │   │   │   ├── test.ts
│   │   │   │   │   ├── recorder.ts
│   │   │   │   │   └── settings.ts
│   │   │   │   └── composables/
│   │   │   ├── popup/                 # Browser action popup
│   │   │   │   ├── index.html
│   │   │   │   ├── main.ts
│   │   │   │   └── Popup.vue
│   │   │   └── options/               # Settings page
│   │   │       ├── index.html
│   │   │       ├── main.ts
│   │   │       └── Options.vue
│   │   ├── lib/
│   │   │   ├── messaging.ts           # Type-safe messaging
│   │   │   └── storage.ts             # chrome.storage wrapper
│   │   ├── assets/
│   │   │   └── icons/
│   │   ├── public/
│   │   ├── wxt.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── formatters/                    # @katalon/formatters
│   │   ├── src/
│   │   │   ├── types.ts               # Formatter interface
│   │   │   ├── playwright.ts
│   │   │   ├── cypress.ts
│   │   │   ├── puppeteer.ts
│   │   │   ├── webdriverio.ts
│   │   │   ├── selenium/
│   │   │   │   ├── java-junit.ts
│   │   │   │   ├── java-testng.ts
│   │   │   │   ├── python-pytest.ts
│   │   │   │   ├── csharp-nunit.ts
│   │   │   │   └── ruby-rspec.ts
│   │   │   ├── katalon-studio.ts
│   │   │   ├── robot-framework.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mcp-server/                    # @katalon/mcp-server
│   │   ├── src/
│   │   │   ├── server.ts              # MCP protocol handler
│   │   │   ├── tools/
│   │   │   │   ├── recording.ts       # start/stop recording
│   │   │   │   ├── playback.ts        # run tests
│   │   │   │   ├── tests.ts           # CRUD test cases
│   │   │   │   ├── browser.ts         # browser control
│   │   │   │   └── export.ts          # export to formats
│   │   │   ├── resources/
│   │   │   │   └── tests.ts           # Test suite resources
│   │   │   └── bridge/
│   │   │       ├── websocket.ts       # WebSocket to extension
│   │   │       └── native-messaging.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── native-bridge/                 # @katalon/native-bridge
│   │   ├── src-tauri/
│   │   │   ├── src/
│   │   │   │   ├── main.rs
│   │   │   │   ├── keepalive.rs       # Service worker keepalive
│   │   │   │   ├── mcp.rs             # MCP WebSocket server
│   │   │   │   ├── file_io.rs         # File system operations
│   │   │   │   └── native_messaging.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tauri.conf.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── ai/                            # @katalon/ai
│       ├── src/
│       │   ├── types.ts               # AIProvider interface
│       │   ├── providers/
│       │   │   ├── anthropic.ts
│       │   │   ├── openai.ts
│       │   │   └── google.ts
│       │   ├── services/
│       │   │   ├── healing.ts         # AI-powered self-healing
│       │   │   ├── generation.ts      # Natural language -> test
│       │   │   ├── explanation.ts     # Test -> explanation
│       │   │   └── assertions.ts      # Suggest assertions
│       │   ├── prompts/
│       │   │   ├── healing.ts
│       │   │   ├── generation.ts
│       │   │   └── explanation.ts
│       │   └── index.ts
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   └── docs/                          # Documentation (VitePress)
│       ├── .vitepress/
│       ├── guide/
│       ├── api/
│       └── package.json
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # Test & lint
│   │   ├── release.yml                # Build & publish
│   │   └── docs.yml                   # Deploy docs
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── scripts/
│   ├── build.ts                       # Build all packages
│   └── migrate-legacy.ts              # Import from v6
│
├── .eslintrc.cjs
├── .prettierrc
├── pnpm-workspace.yaml
├── tsconfig.json
├── package.json
├── LICENSE                            # Apache 2.0
├── NOTICE                             # Attribution
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Chrome or Firefox (for testing)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/katalon-studio/katalon-recorder-next.git
cd katalon-recorder-next

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development (extension with HMR)
pnpm dev
```

### Development Commands

```bash
# Start extension development (Chrome)
pnpm dev

# Start extension development (Firefox)
pnpm dev:firefox

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Build for production
pnpm build

# Package extension for distribution
pnpm zip
pnpm zip:firefox
```

### Loading the Extension

**Chrome:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `packages/extension/.output/chrome-mv3`

**Firefox:**
1. Navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `packages/extension/.output/firefox-mv2/manifest.json`

---

## Development Guide

### Adding a New Command

1. Define the command schema in `packages/core/src/commands/definitions.ts`:

```typescript
export const commands = {
  // ...existing commands

  myNewCommand: {
    name: 'myNewCommand',
    description: 'Description of what this command does',
    target: {
      required: true,
      description: 'Element locator',
    },
    value: {
      required: false,
      description: 'Optional value',
    },
  },
} as const;
```

2. Implement the executor in the appropriate file:

```typescript
// packages/core/src/commands/browser.ts
export async function myNewCommand(
  ctx: CommandContext,
  target: string,
  value?: string
): Promise<CommandResult> {
  const element = await ctx.resolveLocator(target);
  if (!element) {
    return { status: 'failed', error: 'Element not found' };
  }

  // Implementation

  return { status: 'passed' };
}
```

3. Register in the command runner:

```typescript
// packages/core/src/commands/index.ts
export const commandExecutors = {
  // ...existing
  myNewCommand,
};
```

4. Add tests:

```typescript
// packages/core/tests/commands/browser.test.ts
describe('myNewCommand', () => {
  it('should do the thing', async () => {
    // Test implementation
  });
});
```

### Adding a New Formatter

1. Create the formatter file:

```typescript
// packages/formatters/src/my-framework.ts
import type { Formatter, TestCase } from './types';

export const myFrameworkFormatter: Formatter = {
  name: 'My Framework',
  extension: '.spec.ts',
  mimeType: 'text/typescript',

  format(testCase: TestCase): string {
    const lines: string[] = [];

    lines.push(`describe('${testCase.name}', () => {`);
    lines.push(`  it('should run test', async () => {`);

    for (const cmd of testCase.commands) {
      lines.push(`    ${formatCommand(cmd)}`);
    }

    lines.push(`  });`);
    lines.push(`});`);

    return lines.join('\n');
  },
};

function formatCommand(cmd: Command): string {
  // Map Katalon commands to framework syntax
}
```

2. Register in index:

```typescript
// packages/formatters/src/index.ts
export { myFrameworkFormatter } from './my-framework';
```

### Adding an AI Provider

1. Implement the provider interface:

```typescript
// packages/ai/src/providers/my-provider.ts
import type { AIProvider, HealingContext, LocatorSuggestion } from '../types';

export class MyProvider implements AIProvider {
  name = 'My Provider';

  constructor(private apiKey: string) {}

  async suggestLocators(ctx: HealingContext): Promise<LocatorSuggestion[]> {
    // Call your AI API
  }

  async generateTest(prompt: string, pageContext: PageContext): Promise<Command[]> {
    // Implementation
  }

  async explainTest(commands: Command[]): Promise<string> {
    // Implementation
  }
}
```

---

## Configuration

### wxt.config.ts

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],

  manifest: {
    name: 'Katalon Recorder',
    description: 'AI-powered test automation recorder',
    version: '7.0.0',

    permissions: [
      'activeTab',
      'tabs',
      'storage',
      'contextMenus',
      'downloads',
      'notifications',
    ],

    host_permissions: ['<all_urls>'],

    commands: {
      'toggle-recording': {
        suggested_key: {
          default: 'Alt+Shift+R',
        },
        description: 'Start/stop recording',
      },
    },
  },

  // Build for both Chrome MV3 and Firefox MV2
  browser: process.env.BROWSER || 'chrome',
  manifestVersion: process.env.BROWSER === 'firefox' ? 2 : 3,
});
```

### Package Scripts

```json
{
  "name": "katalon-recorder-next",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @katalon/extension dev",
    "dev:firefox": "BROWSER=firefox pnpm --filter @katalon/extension dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:watch": "pnpm -r test:watch",
    "test:e2e": "pnpm --filter @katalon/extension test:e2e",
    "lint": "eslint packages/*/src",
    "type-check": "pnpm -r type-check",
    "zip": "pnpm --filter @katalon/extension zip",
    "zip:firefox": "BROWSER=firefox pnpm --filter @katalon/extension zip"
  }
}
```

---

## Migration from v6

### Importing Legacy Test Suites

The extension includes a migration wizard for importing test suites from Katalon Recorder v6:

1. Export your test suites from v6 (HTML or JSON format)
2. In v7, go to **File → Import → Katalon Recorder v6**
3. Select your exported files
4. Review the migration report for any incompatibilities
5. Save the imported tests

### Programmatic Migration

```typescript
import { migrateLegacyTestSuite } from '@katalon/core/storage/migration';

const legacyJson = fs.readFileSync('my-tests.json', 'utf-8');
const migrated = migrateLegacyTestSuite(JSON.parse(legacyJson));

// Review warnings
for (const warning of migrated.warnings) {
  console.warn(`${warning.command}: ${warning.message}`);
}

// Use migrated test suite
const testSuite = migrated.result;
```

### Command Compatibility

| v6 Command | v7 Status | Notes |
|------------|-----------|-------|
| `click` | ✅ Compatible | |
| `type` | ✅ Compatible | |
| `select` | ✅ Compatible | |
| `verifyText` | ✅ Compatible | |
| `assertText` | ✅ Compatible | |
| `waitForElementPresent` | ✅ Compatible | |
| `store` | ✅ Compatible | |
| `storeEval` | ⚠️ Modified | Uses safe expression parser |
| `runScript` | ⚠️ Modified | Sandboxed execution |
| `executeScript` | ⚠️ Modified | Runs in page context only |
| `pause` | ✅ Compatible | |
| `if`/`else`/`while` | ✅ Compatible | |

---

## MCP Server

The MCP server enables AI coding agents to control Katalon Recorder.

### Starting the Server

```bash
# Via native bridge (recommended)
pnpm --filter @katalon/native-bridge start

# Or standalone (requires extension running)
pnpm --filter @katalon/mcp-server start
```

### Available Tools

| Tool | Description |
|------|-------------|
| `katalon_start_recording` | Begin recording user interactions |
| `katalon_stop_recording` | Stop recording and return commands |
| `katalon_run_test` | Execute a test case |
| `katalon_run_suite` | Execute a test suite |
| `katalon_get_tests` | List all test cases |
| `katalon_create_test` | Create a new test case |
| `katalon_export` | Export to Playwright/Cypress/etc |
| `katalon_navigate` | Navigate browser to URL |
| `katalon_screenshot` | Capture page screenshot |
| `katalon_get_elements` | Get elements matching selector |

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "katalon": {
      "command": "npx",
      "args": ["@anthropic-ai/claude-adapter", "ws://localhost:9223"]
    }
  }
}
```

---

## AI Integration (BYOK)

### Configuration

Set your API keys in the extension settings:

1. Go to **Settings → AI Providers**
2. Enter your API key for the desired provider
3. Select the default provider for each feature

### Supported Providers

| Provider | Healing | Generation | Explanation |
|----------|---------|------------|-------------|
| Anthropic Claude | ✅ | ✅ | ✅ |
| OpenAI GPT-4 | ✅ | ✅ | ✅ |
| Google Gemini | ✅ | ✅ | ✅ |

### Features

**AI-Powered Self-Healing:**
When a locator fails, the AI analyzes the page and suggests alternatives.

**Natural Language Test Generation:**
Describe what you want to test, and the AI generates the commands.

**Test Explanation:**
Select commands and ask the AI to explain what they do.

---

## Roadmap

### Phase 1: Foundation ✅
- [ ] Initialize monorepo with pnpm
- [ ] Set up WXT extension project
- [ ] Implement core types and interfaces
- [ ] Basic record/playback working
- [ ] Safe expression evaluation (expr-eval)

### Phase 2: Feature Parity
- [ ] All v6 commands implemented
- [ ] Self-healing migration
- [ ] Export formatters (Playwright, Cypress, Selenium)
- [ ] New Vue 3 panel UI
- [ ] Legacy test suite import

### Phase 3: Enhancements
- [ ] MCP server integration
- [ ] BYOK AI providers
- [ ] Playwright-style locators
- [ ] Native bridge for advanced features
- [ ] Visual regression testing

### Phase 4: Polish
- [ ] Documentation site
- [ ] Plugin system
- [ ] Cloud sync (optional)
- [ ] Chrome Web Store submission

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed

---

## License

Apache 2.0 - See [LICENSE](./LICENSE)

### Attribution

This project builds upon the work of:
- [Selenium IDE](https://www.selenium.dev/selenium-ide/) - Original test recorder
- [SideeX](https://github.com/nicekware/nicekware/sideex) - Chrome extension fork
- [Katalon Recorder](https://github.com/nicekware/katalon-recorder) - Previous version

See [NOTICE](./NOTICE) for full attribution.

---

## Links

- [Documentation](https://docs.katalon.com/katalon-recorder)
- [Chrome Web Store](https://chrome.google.com/webstore/detail/katalon-recorder)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/katalon-recorder)
- [Community Forum](https://forum.katalon.com/c/katalon-recorder)
- [GitHub Issues](https://github.com/katalon-studio/katalon-recorder-next/issues)
