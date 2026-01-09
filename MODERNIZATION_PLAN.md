# Katalon Recorder Modernization Plan

## Executive Summary

This document outlines a comprehensive modernization strategy for Katalon Recorder, a browser extension with ~41,600 lines of JavaScript code. The plan addresses three critical areas:

1. **Chrome Extension Manifest V3 Migration** (Critical - Required for continued Chrome Web Store presence)
2. **TypeScript/Build System Modernization** (High - Improves maintainability and developer experience)
3. **AI Integration with BYOK** (Strategic - Adds significant value through intelligent automation)

---

## Competitive Analysis: Lessons from Other Recorders

A comprehensive analysis of leading test recorders reveals key features and approaches that Katalon Recorder should adopt to remain competitive.

### Comparison Matrix

| Feature | Katalon Recorder | Chrome DevTools Recorder | Playwright Codegen | Cypress Studio |
|---------|-----------------|-------------------------|-------------------|----------------|
| **Locator Strategy** | XPath-first | Mixed | Role/TestID-first | data-* attributes |
| **Export Formats** | 6+ formats | JSON + Extensions | 4 languages | Cypress only |
| **AI Features** | None | None | None | Coming soon |
| **Self-Healing** | Heuristic | None | Auto-wait | Smart locators |
| **Assertion Generation** | Manual | Manual | Manual | Right-click |
| **JSON Interchange** | HTML-based | ✅ Standard | ✅ Native | ❌ |
| **Extensibility** | Limited | Plugin API | Transforms | Limited |
| **CI/CD Ready** | Via export | @puppeteer/replay | Native | Native |

### Key Takeaways by Tool

#### 1. Chrome DevTools Recorder
**Source**: [Chrome DevTools Recorder Reference](https://developer.chrome.com/docs/devtools/recorder/reference)

**What to Adopt:**
- **JSON User Flow Format**: A standardized, portable JSON format for recordings that can be:
  - Imported/exported easily
  - Transformed by third-party tools
  - Version controlled
  - Shared between team members

```json
// Chrome DevTools User Flow JSON Schema
{
  "title": "Login Test",
  "selectorAttribute": "data-testid",
  "steps": [
    { "type": "navigate", "url": "https://example.com" },
    { "type": "click", "selectors": [["#login-btn"]], "offsetX": 1, "offsetY": 1 },
    { "type": "change", "selectors": [["#email"]], "value": "test@example.com" }
  ]
}
```

- **Extension API for Export**: Allow third parties to add custom export formats via a plugin system
- **Performance Metrics**: Integrate Lighthouse-style performance measurement during replay
- **Replay with Modifications**: Edit steps inline before replay

**Recommendation**: Implement a JSON interchange format compatible with Chrome DevTools User Flow schema. This enables interoperability with the broader ecosystem including [Puppeteer Replay](https://github.com/puppeteer/replay).

---

#### 2. Playwright Codegen
**Source**: [Playwright Best Practices](https://playwright.dev/docs/best-practices)

**What to Adopt:**

**A. Modern Locator Hierarchy** (Critical)

Playwright's locator strategy prioritizes resilience over specificity:

| Priority | Locator Type | Example | Why |
|----------|-------------|---------|-----|
| 1 | Role | `getByRole('button', { name: 'Submit' })` | Accessibility-based, survives UI changes |
| 2 | Test ID | `getByTestId('submit-btn')` | Explicit, stable, developer-controlled |
| 3 | Text | `getByText('Submit')` | User-visible, semantic |
| 4 | Label | `getByLabel('Email')` | Form accessibility |
| 5 | Placeholder | `getByPlaceholder('Enter email')` | Input hints |
| **Avoid** | XPath/CSS | `//div[@class='btn']` | Brittle, tied to DOM structure |

**Current Katalon Issue**: XPath is often generated first, leading to fragile tests.

**Proposed Change**:
```typescript
// New locator priority configuration
const LOCATOR_PRIORITY = [
  'data-testid',      // Explicit test IDs
  'data-test',        // Alternative test attribute
  'aria-label',       // Accessibility
  'role',             // ARIA roles
  'name',             // Form element names
  'id',               // Only if stable (not auto-generated)
  'css',              // Simple, stable selectors
  'xpath'             // Last resort
];
```

**B. Auto-Waiting Built-In**

Playwright automatically waits for elements to be:
- Visible
- Stable (not animating)
- Enabled
- Receiving events

**Recommendation**: Enhance playback engine with similar actionability checks before each command.

**C. Strict Mode**

Playwright fails if a selector matches multiple elements, preventing silent bugs.

**Recommendation**: Add optional strict mode that warns when selectors are ambiguous.

---

#### 3. Cypress Studio
**Source**: [Cypress Studio Documentation](https://docs.cypress.io/app/guides/cypress-studio)

**What to Adopt:**

**A. Right-Click Assertion Menu**

Cypress Studio allows right-clicking any element to add assertions:
- `should('be.visible')`
- `should('contain', 'text')`
- `should('have.value', 'expected')`

**Current Gap**: Katalon Recorder requires manual assertion command entry.

**Proposed UI Enhancement**:
```
Right-click menu on recorded element:
├── Assert text equals...
├── Assert text contains...
├── Assert is visible
├── Assert is enabled
├── Assert has value...
├── Assert has attribute...
└── Assert element count...
```

**B. Inline Test Editing**

Ability to add commands to existing tests without re-recording.

**C. Smart Selector Detection**

Cypress Studio prioritizes `data-cy`, `data-test`, `data-testid` attributes when present.

**Recommendation**: Detect and prefer custom test attributes over auto-generated locators.

---

#### 4. AI-Powered Tools (Emerging Competitors)
**Sources**: [testRigor](https://testrigor.com/), [Testim.io](https://www.testim.io/), [SmartBear Reflect](https://support.smartbear.com/reflect/docs/en/recording/test-with-ai)

These tools represent the future direction of test automation:

| Tool | AI Feature | Implementation |
|------|------------|----------------|
| **testRigor** | Natural language tests | "Click on 'Login' button" → test code |
| **Testim.io** | Smart locators | ML-based element identification |
| **Relicx** | Auto-assertions | AI suggests verification points |
| **Reflect** | AI Prompts | Natural language → actions/assertions |
| **KaneAI** | NL assertions | "verify the price is under $100" |

**Key AI Features to Implement (via BYOK)**:

1. **Natural Language Test Steps**
   ```
   User types: "Login with invalid credentials and verify error message"
   AI generates: open, type, type, click, assertText commands
   ```

2. **Smart Assertion Suggestions**
   ```
   After recording a form submission:
   AI suggests: "Assert success message is visible"
              "Assert form fields are cleared"
              "Assert URL changed to /dashboard"
   ```

3. **Failure Explanation**
   ```
   Test fails: "Element not found: #submit-btn"
   AI explains: "The button ID changed from #submit-btn to #submitButton
                in the latest deployment. Update the locator or use
                getByRole('button', {name: 'Submit'}) for resilience."
   ```

---

### Recommended Feature Additions

Based on competitive analysis, prioritize these features:

#### High Priority (Competitive Parity)
| Feature | Inspired By | Effort | Impact |
|---------|-------------|--------|--------|
| Role-based locators | Playwright | Medium | High |
| JSON interchange format | Chrome DevTools | Medium | High |
| Right-click assertions | Cypress Studio | Low | High |
| Test ID attribute priority | All modern tools | Low | Medium |
| Auto-wait improvements | Playwright | Medium | High |

#### Medium Priority (Differentiation)
| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| AI assertion suggestions | BYOK-powered smart assertions | High | High |
| Natural language generation | "Test login flow" → commands | High | High |
| Export plugin API | Third-party export formats | Medium | Medium |
| Performance metrics | Lighthouse integration | Medium | Medium |

#### Lower Priority (Nice to Have)
| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| Visual regression | Screenshot comparison | High | Medium |
| Network mocking | Intercept/stub API calls | High | Medium |
| Multi-tab support | Test across browser tabs | Medium | Low |

---

### Proposed JSON Format (Chrome DevTools Compatible)

To enable ecosystem interoperability, adopt a JSON format compatible with Chrome DevTools:

```typescript
// src/shared/types/user-flow.ts
interface KatalonUserFlow {
  title: string;
  version: '1.0';
  generator: 'katalon-recorder';
  selectorAttribute?: string;  // Custom test ID attribute
  steps: KatalonStep[];
  metadata?: {
    baseUrl?: string;
    browser?: string;
    recordedAt?: string;
  };
}

interface KatalonStep {
  type: 'navigate' | 'click' | 'change' | 'keyDown' | 'keyUp' |
        'scroll' | 'waitForElement' | 'assert' | 'custom';
  selectors?: string[][];  // Multiple selector strategies
  url?: string;            // For navigate
  value?: string;          // For change/assert
  key?: string;            // For keyDown/keyUp
  command?: string;        // For custom Katalon commands
  timeout?: number;
  assertType?: 'text' | 'visible' | 'enabled' | 'value' | 'attribute';
}
```

**Benefits**:
- Import recordings from Chrome DevTools
- Export to Chrome DevTools format
- Use Puppeteer Replay ecosystem tools
- Share recordings across teams

---

### Implementation Priorities

```
Phase 1: Foundation
├── Implement role-based locator generation
├── Add data-testid priority in locator builder
├── Create JSON import/export format
└── Add right-click assertion menu

Phase 2: AI Integration (BYOK)
├── Implement AI provider abstraction
├── Add assertion suggestion feature
├── Add natural language test generation
└── Add failure analysis

Phase 3: Ecosystem
├── Create export plugin API
├── Add Chrome DevTools format compatibility
├── Build Puppeteer Replay integration
└── Add performance metrics collection
```

---

## Part 1: Manifest V3 Migration (Critical Priority)

### Background
Chrome is deprecating Manifest V2. Extensions must migrate to V3 to remain in the Chrome Web Store.

### Current State (Manifest V2)
```json
{
  "manifest_version": 2,
  "background": {
    "scripts": ["background.js", ...]  // Persistent background page
  },
  "browser_action": {...},
  "content_security_policy": "script-src 'self' 'unsafe-eval' ..."
}
```

### Target State (Manifest V3)
```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"  // Non-persistent service worker
  },
  "action": {...},  // Replaces browser_action
  "host_permissions": ["<all_urls>"],
  "permissions": ["tabs", "storage", ...],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Migration Steps

#### Phase 1.1: Background Script to Service Worker
**Impact: HIGH** - The background scripts currently use persistent DOM and window APIs.

| Current Pattern | Required Change |
|-----------------|-----------------|
| Persistent background page | Non-persistent service worker |
| DOM access (`document`, `window`) | No DOM access in service workers |
| Global state in memory | Use `chrome.storage` for state persistence |
| `XMLHttpRequest` | `fetch()` API |
| `setTimeout`/`setInterval` | `chrome.alarms` API |

**Files Requiring Changes:**
- `/background/background.js`
- `/background/install.js`
- `/background/kar.js`
- `/katalon/background.js`
- `/playback/index.js`

**Action Items:**
1. Create single service worker entry point (`src/background/service-worker.ts`)
2. Move all state to `chrome.storage.session` or `chrome.storage.local`
3. Replace `XMLHttpRequest` with `fetch()`
4. Replace timers with `chrome.alarms`
5. Remove all DOM references from background scripts

#### Phase 1.2: Action API Migration
Replace `browser_action` with `action`:

```javascript
// OLD (V2)
chrome.browserAction.setIcon({...});
chrome.browserAction.onClicked.addListener(...);

// NEW (V3)
chrome.action.setIcon({...});
chrome.action.onClicked.addListener(...);
```

#### Phase 1.3: Content Security Policy
**Critical Issue:** Current CSP uses `'unsafe-eval'` which is NOT allowed in MV3.

```javascript
// Current (BLOCKED in MV3)
"content_security_policy": "script-src 'self' 'unsafe-eval' ..."
```

**Impact:** Code that uses `eval()`, `new Function()`, or dynamic script execution must be refactored.

**Files to Audit:**
- Search for `eval(`, `new Function(`, `setTimeout(string)`
- `/panel/js/katalon/` formatters may use dynamic code generation

**Solutions:**
1. Pre-compile all dynamic code patterns
2. Use `chrome.scripting.executeScript()` with `func` parameter instead of string code
3. Move code generation to sandboxed iframes if absolutely necessary

#### Phase 1.4: Host Permissions Separation
```json
// V3 requires explicit separation
{
  "permissions": ["tabs", "storage", "contextMenus", ...],
  "host_permissions": ["<all_urls>"]
}
```

#### Phase 1.5: Web Accessible Resources
```json
// V3 requires explicit matches
{
  "web_accessible_resources": [{
    "resources": ["page/prompt.js", "page/runScript.js"],
    "matches": ["<all_urls>"]
  }]
}
```

#### Phase 1.6: Scripting API Migration
Replace `chrome.tabs.executeScript` with `chrome.scripting.executeScript`:

```javascript
// OLD (V2)
chrome.tabs.executeScript(tabId, {file: "content.js"});

// NEW (V3)
chrome.scripting.executeScript({
  target: {tabId: tabId},
  files: ["content.js"]
});
```

---

## Part 2: TypeScript & Build System Modernization

### Current State Assessment

**Codebase Statistics:**
| Directory | Lines of Code | Recommendation |
|-----------|---------------|----------------|
| `/content/` | 34,127 | REWRITE |
| `/panel/js/` | 50,552 | REFACTOR |
| `/katalon/` | 5,276 | REFACTOR |
| `/playback/` | 1,241 | REWRITE |
| **Total** | **~91,196** | |

**Technical Debt Indicators:**
- 104+ TODO/FIXME comments
- 2,919 `var` declarations (ES5 style)
- No package.json (no dependency management)
- No build system, bundler, or minification
- No TypeScript or type checking
- No linter (ESLint) or formatter (Prettier)
- 14 test files only (minimal coverage)

**Critical Issues Found:**
1. **Security**: `eval()` usage in `/playback/service/variable-sevice.js`
2. **Security**: `innerHTML` XSS vulnerabilities in parser
3. **Maintainability**: `atoms.js` is 11,837 LOC of compiled/minified code
4. **Duplication**: Duplicate implementations across `/content/` and `/katalon/`
5. **Dependencies**: jQuery 3.2.1 (multiple copies), outdated libraries

---

### Module-by-Module Rewrite Assessment

#### `/content/` Directory (34,127 LOC) → **REWRITE**

| Module | Current State | Recommendation | Modern Alternative |
|--------|---------------|----------------|-------------------|
| `atoms.js` (11,837 LOC) | Compiled Selenium WebDriver atoms, unmaintainable | **REMOVE** | Use Playwright locator patterns directly |
| `sideex.js` (546 LOC) | Legacy Selenium IDE compatibility | **REWRITE** | New RecorderCore.ts with modern event listeners |
| `sideex-command.js` (2,847 LOC) | Command implementations | **EXTRACT & REWRITE** | Modular CommandExecutor.ts |
| `contextmenu.js` | Right-click menu handler | **REFACTOR** | Keep logic, convert to TypeScript |
| `sideex-log.js` | Logging utilities | **REFACTOR** | Modern logging service with levels |

**Rationale:** The `atoms.js` file alone is 35% of this directory and is unmaintainable compiled code from Selenium WebDriver. Modern browsers provide native APIs that eliminate the need for these atoms. The Selenium IDE architecture from which this was forked is outdated.

#### `/panel/js/` Directory (50,552 LOC) → **REFACTOR**

| Module | Current State | Recommendation | Notes |
|--------|---------------|----------------|-------|
| `UI/` (majority) | Vanilla JS UI components | **REFACTOR** | Convert to Vue/React components incrementally |
| `UI/models/` | Test data models | **PRESERVE** | Good separation, convert to TypeScript interfaces |
| `UI/services/` | Business logic services | **PRESERVE** | Well-structured, add types |
| `self-healing/` | AI healing implementation | **PRESERVE & ENHANCE** | Core value-add, add TypeScript |
| `background/` | Extension background logic | **REFACTOR** | Convert to WXT service worker |
| `katalon-extension/` | Katalon-specific features | **REFACTOR** | Merge with main codebase |

**Rationale:** The panel code is better structured with clear separation of concerns. The self-healing implementation is a key differentiator and should be preserved. UI components can be incrementally converted to a modern framework.

**Key Files to Preserve:**
- `UI/models/test-model/test-data.js` - Core test data structure
- `self-healing/service/*` - Self-healing business logic
- `UI/services/html-service/*` - HTML parsing utilities
- `UI/command/*` - Command pattern implementation (good design)

#### `/katalon/` Directory (5,276 LOC) → **REFACTOR**

| Module | Current State | Recommendation | Notes |
|--------|---------------|----------------|-------|
| `kar-framework/` | Test framework code | **REFACTOR** | Convert to TypeScript |
| `kar-handler/` | Handler implementations | **REFACTOR** | Consolidate with panel handlers |
| `utilities/` | Shared utilities | **EXTRACT** | Move to shared `/lib/utils/` |

**Rationale:** Moderate-sized with clear purpose. Primarily needs TypeScript conversion and consolidation with duplicate implementations in other directories.

#### `/playback/` Directory (1,241 LOC) → **REWRITE**

| Module | Current State | Recommendation | Notes |
|--------|---------------|----------------|-------|
| `service/variable-service.js` | Uses `eval()` | **REWRITE CRITICAL** | Use `expr-eval` or `mathjs` |
| `service/playback-service.js` | Test execution engine | **REWRITE** | Modern async/await PlaybackEngine |
| `Playback.js` | Entry point | **REFACTOR** | Update to use new engine |

**Rationale:** The `eval()` usage is a security vulnerability and MV3 blocker. This must be rewritten with a safe expression parser. The playback logic should use modern async/await patterns instead of callbacks.

**Security Fix - Replace `eval()`:**
```typescript
// BEFORE (Security vulnerability)
function evaluateExpression(expr, variables) {
  return eval(expr);  // DANGER: arbitrary code execution
}

// AFTER (Safe expression evaluation)
import { Parser } from 'expr-eval';
const parser = new Parser();

function evaluateExpression(expr: string, variables: Record<string, any>): any {
  const parsed = parser.parse(expr);
  return parsed.evaluate(variables);
}
```

#### Files to DELETE (Legacy/Dead Code)

| File/Pattern | Reason |
|-------------|--------|
| `content/atoms.js` | Unmaintainable compiled code, modern alternatives exist |
| `panel/js/UI/view/closure-library/` | Google Closure dependency, replace with modern solution |
| `libs/jquery-3.2.1.min.js` (multiple copies) | Update to single modern version or replace |
| `*.bak`, `*.old` files | Backup files in version control |
| Inline CSS in JS | Extract to proper CSS files |

---

### Migration Path Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                     KATALON RECORDER MIGRATION                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Phase 1: Foundation (WXT Setup)                                    │
│  ├── Initialize WXT project                                         │
│  ├── Set up TypeScript + ESLint + Prettier                         │
│  └── Configure manifest auto-generation                             │
│                                                                      │
│  Phase 2: Critical Rewrites (~13,000 LOC)                          │
│  ├── REWRITE: /content/atoms.js → Modern locators                  │
│  ├── REWRITE: /playback/ → Safe expression parser                  │
│  └── REWRITE: Recording engine → RecorderCore.ts                   │
│                                                                      │
│  Phase 3: Gradual Migration (~56,000 LOC)                          │
│  ├── REFACTOR: /panel/js/UI/ → Vue/React components               │
│  ├── PRESERVE: /panel/js/self-healing/ → Add types                 │
│  └── REFACTOR: /katalon/ → Consolidate & type                      │
│                                                                      │
│  Phase 4: New Features                                              │
│  ├── MCP Server Integration                                         │
│  ├── AI BYOK Enhancement                                            │
│  └── Modern export formats (Playwright, etc.)                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Recommended Framework: WXT

**Source**: [wxt.dev](https://wxt.dev/) | [GitHub](https://github.com/wxt-dev/wxt)

WXT is the leading open-source browser extension framework for 2025, offering the best path for Katalon Recorder's modernization.

#### Why WXT?

| Feature | Benefit for Katalon |
|---------|---------------------|
| **MV2 & MV3 from same codebase** | Critical for Firefox compatibility during transition |
| **TypeScript by default** | Gradual migration, type safety |
| **Framework agnostic** | Can keep vanilla JS or migrate to Vue/React incrementally |
| **Auto-generated manifest** | Reduces MV3 migration complexity |
| **Unified browser API** | Handles Chrome/Firefox differences automatically |
| **File-based entrypoints** | Cleaner architecture |
| **Lightning fast HMR** | Better developer experience |
| **Built-in publishing** | Automates store submissions |

#### WXT vs. Alternatives

| Framework | Status | Best For |
|-----------|--------|----------|
| **WXT** | ✅ Active, leading | Katalon (recommended) |
| Plasmo | ⚠️ Maintenance mode | React-only projects |
| CRXJS | ✅ Active | Minimal abstraction |
| Custom Webpack | ❌ | Maximum control (not recommended) |

### Proposed Architecture with WXT

```
katalon-recorder/
├── entrypoints/                    # WXT entrypoints (auto-discovered)
│   ├── background.ts               # Service worker
│   ├── content.ts                  # Main content script
│   ├── panel/                      # Extension panel
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── App.vue                 # Or React/Svelte/vanilla
│   ├── options/                    # Settings page
│   │   ├── index.html
│   │   └── main.ts
│   └── popup.ts                    # Browser action popup
├── components/                     # Shared UI components
├── lib/                           # Core business logic
│   ├── recorder/                  # Recording engine (extracted)
│   │   ├── RecorderCore.ts
│   │   ├── LocatorBuilder.ts
│   │   └── EventCapture.ts
│   ├── playback/                  # Playback engine (rewritten)
│   │   ├── PlaybackEngine.ts
│   │   ├── CommandExecutor.ts
│   │   └── ExpressionParser.ts    # Safe eval replacement
│   ├── self-healing/              # Self-healing logic
│   │   ├── HealingService.ts
│   │   └── LocatorMatcher.ts
│   ├── formatters/                # Export formatters
│   │   ├── PlaywrightFormatter.ts
│   │   ├── PuppeteerFormatter.ts
│   │   └── index.ts
│   ├── ai/                        # AI integration (BYOK)
│   │   ├── providers/
│   │   └── services/
│   └── mcp/                       # MCP server integration
│       ├── tools/
│       └── bridge/
├── utils/                         # Shared utilities
├── types/                         # TypeScript definitions
├── public/                        # Static assets
├── tests/                         # Test suite (Vitest)
├── wxt.config.ts                  # WXT configuration
├── package.json
└── tsconfig.json
```

### WXT Configuration

```typescript
// wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],  // Or @wxt-dev/module-react

  manifest: {
    name: 'Katalon Recorder',
    description: 'Selenium IDE alternative for test automation',
    permissions: [
      'tabs',
      'activeTab',
      'storage',
      'contextMenus',
      'downloads',
      'notifications'
    ],
    host_permissions: ['<all_urls>'],
  },

  // Build for multiple browsers
  browser: process.env.BROWSER || 'chrome',

  // MV3 for Chrome, MV2 for Firefox (automatic)
  manifestVersion: 3,
});
```

### WXT Entrypoint Examples

```typescript
// entrypoints/background.ts
export default defineBackground(() => {
  console.log('Katalon Recorder background initialized');

  // Service worker logic
  browser.action.onClicked.addListener(async (tab) => {
    await openKatalonPanel();
  });

  // MCP WebSocket server initialization
  initMCPServer();
});

// entrypoints/content.ts
export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  main(ctx) {
    // Recorder injection
    const recorder = new RecorderCore(ctx);

    // Listen for recording commands from background
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'START_RECORDING') {
        recorder.start();
      }
    });
  },
});
```

### Package.json with WXT

```json
{
  "name": "katalon-recorder",
  "version": "6.0.0",
  "type": "module",
  "scripts": {
    "dev": "wxt",
    "dev:firefox": "wxt -b firefox",
    "build": "wxt build",
    "build:firefox": "wxt build -b firefox",
    "zip": "wxt zip",
    "zip:firefox": "wxt zip -b firefox",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "expr-eval": "^2.0.2",
    "@anthropic-ai/sdk": "^0.24.0",
    "openai": "^4.28.0"
  },
  "devDependencies": {
    "wxt": "^0.19.0",
    "@wxt-dev/module-vue": "^1.0.0",
    "typescript": "^5.4.0",
    "vue": "^3.4.0",
    "vitest": "^1.3.0",
    "@playwright/test": "^1.42.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

### TypeScript Migration Strategy

#### Phase 2.1: Setup Infrastructure (Now Using WXT)
1. Initialize WXT project with TypeScript
2. Configure automatic manifest generation
3. Set up Vitest for unit testing
4. Configure Playwright for E2E testing

#### Phase 2.2: Define Core Types
```typescript
// src/shared/types/test-types.ts
export interface TestCommand {
  id: string;
  command: string;
  target: string;
  value: string;
  timestamp?: number;
}

export interface TestCase {
  id: string;
  name: string;
  commands: TestCommand[];
  baseUrl?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  testCases: TestCase[];
}

export interface Locator {
  type: 'xpath' | 'css' | 'id' | 'name' | 'linkText' | 'role' | 'testId';
  value: string;
  confidence?: number;  // For AI-generated locators
}

export interface SelfHealingProposal {
  originalLocator: Locator;
  proposedLocators: Locator[];
  command: TestCommand;
  aiSuggestion?: string;
}
```

#### Phase 2.3: Gradual Migration
1. Start with shared utilities and types
2. Migrate models and services
3. Migrate UI components
4. Migrate background/content scripts last

---

## Part 3: AI Integration with BYOK (Bring Your Own Key)

### Vision
Transform Katalon Recorder from a simple record-playback tool into an **AI-powered test automation assistant** that can:
- Generate intelligent test steps from natural language
- Provide smart element locator suggestions
- Auto-heal broken tests with AI reasoning
- Generate test assertions automatically
- Explain test failures and suggest fixes

### BYOK Architecture

#### Why BYOK?
1. **Privacy**: User data stays with their chosen provider
2. **Cost Control**: Users manage their own API costs
3. **Flexibility**: Support multiple AI providers
4. **No Backend Required**: Direct browser-to-API communication
5. **Enterprise Friendly**: Organizations can use their corporate API keys

#### Supported Providers
| Provider | Model | Use Cases |
|----------|-------|-----------|
| **Anthropic Claude** | claude-3.5-sonnet | Complex reasoning, code generation |
| **OpenAI** | gpt-4o, gpt-4o-mini | General purpose, fast responses |
| **Google** | gemini-1.5-pro | Multimodal (screenshot analysis) |
| **Local/Custom** | Ollama, LM Studio | Privacy-focused, offline capable |

### AI Features Implementation

#### Feature 3.1: AI-Powered Self-Healing (Enhancement)

**Current Self-Healing:**
- Heuristic-based locator matching
- Pattern-based alternative suggestions
- No semantic understanding

**AI-Enhanced Self-Healing:**
```typescript
// src/ai/services/ai-self-healing.ts
export class AISelfHealingService {
  async suggestLocatorFix(
    failedLocator: Locator,
    pageContext: PageContext,
    previousCommands: TestCommand[]
  ): Promise<SelfHealingProposal> {
    const prompt = `
      A test automation locator has failed. Help me find a better locator.

      Failed locator: ${failedLocator.type}="${failedLocator.value}"

      Page context:
      - URL: ${pageContext.url}
      - Relevant DOM snippet: ${pageContext.domSnippet}
      - Previous successful command: ${previousCommands[previousCommands.length - 1]?.target}

      Suggest alternative locators ranked by reliability.
      Return JSON: { locators: [{type, value, reason}], explanation: string }
    `;

    const response = await this.aiProvider.complete(prompt);
    return this.parseLocatorSuggestions(response);
  }
}
```

#### Feature 3.2: Natural Language Test Generation

**User Input:** "Test login with invalid password shows error"

**AI-Generated Test:**
```typescript
// Generated commands
[
  { command: "open", target: "/login", value: "" },
  { command: "type", target: "id=username", value: "testuser" },
  { command: "type", target: "id=password", value: "wrongpassword" },
  { command: "click", target: "id=login-button", value: "" },
  { command: "assertText", target: "css=.error-message", value: "Invalid credentials" }
]
```

**Implementation:**
```typescript
// src/ai/services/test-generator.ts
export class AITestGenerator {
  async generateTest(
    naturalLanguageDescription: string,
    pageContext?: PageContext
  ): Promise<TestCase> {
    const systemPrompt = `
      You are a test automation expert. Generate Selenium-compatible test commands.
      Available commands: ${AVAILABLE_COMMANDS.join(', ')}

      Output format: JSON array of {command, target, value}
    `;

    const response = await this.aiProvider.complete({
      system: systemPrompt,
      user: naturalLanguageDescription,
      context: pageContext
    });

    return this.parseTestCase(response);
  }
}
```

#### Feature 3.3: Intelligent Assertion Suggestions

When recording, AI can suggest appropriate assertions:

```typescript
// src/ai/services/assertion-suggester.ts
export class AIAssertionSuggester {
  async suggestAssertions(
    recordedCommands: TestCommand[],
    pageSnapshot: PageSnapshot
  ): Promise<TestCommand[]> {
    // Analyze the recorded flow and suggest verification points
    const prompt = `
      Given these recorded test steps and the current page state,
      suggest appropriate assertions to verify the test succeeded.

      Recorded steps: ${JSON.stringify(recordedCommands)}
      Page title: ${pageSnapshot.title}
      Visible text: ${pageSnapshot.visibleText}
      Form values: ${JSON.stringify(pageSnapshot.formValues)}

      Suggest assertions in format: [{command, target, value, reason}]
    `;

    return this.aiProvider.complete(prompt);
  }
}
```

#### Feature 3.4: Test Failure Analysis

When a test fails, AI provides intelligent analysis:

```typescript
// src/ai/services/failure-analyzer.ts
export class AIFailureAnalyzer {
  async analyzeFailure(
    failedCommand: TestCommand,
    error: Error,
    executionContext: ExecutionContext
  ): Promise<FailureAnalysis> {
    const prompt = `
      A test command failed. Analyze the failure and suggest fixes.

      Command: ${failedCommand.command} on ${failedCommand.target}
      Error: ${error.message}
      Previous steps: ${executionContext.previousCommands}
      Current URL: ${executionContext.currentUrl}

      Provide:
      1. Root cause analysis
      2. Suggested fixes
      3. Prevention recommendations
    `;

    return this.aiProvider.complete(prompt);
  }
}
```

### BYOK Settings UI

```typescript
// src/ai/models/ai-settings.ts
export interface AISettings {
  enabled: boolean;
  provider: 'anthropic' | 'openai' | 'google' | 'custom';
  apiKey: string;  // Stored encrypted in chrome.storage.local
  model: string;
  endpoint?: string;  // For custom providers
  maxTokens: number;
  temperature: number;
  features: {
    selfHealing: boolean;
    testGeneration: boolean;
    assertionSuggestion: boolean;
    failureAnalysis: boolean;
  };
}
```

**Settings Panel UI:**
```html
<!-- AI Configuration Tab -->
<div id="ai-settings-tab">
  <h3>AI Configuration (BYOK)</h3>

  <div class="setting-group">
    <label>
      <input type="checkbox" id="ai-enabled"> Enable AI Features
    </label>
  </div>

  <div class="setting-group">
    <label for="ai-provider">AI Provider</label>
    <select id="ai-provider">
      <option value="anthropic">Anthropic Claude</option>
      <option value="openai">OpenAI</option>
      <option value="google">Google Gemini</option>
      <option value="custom">Custom (OpenAI-compatible)</option>
    </select>
  </div>

  <div class="setting-group">
    <label for="ai-api-key">API Key</label>
    <input type="password" id="ai-api-key" placeholder="sk-...">
    <small>Your API key is stored locally and never sent to Katalon servers</small>
  </div>

  <div class="setting-group">
    <label for="ai-model">Model</label>
    <select id="ai-model">
      <!-- Populated dynamically based on provider -->
    </select>
  </div>

  <h4>AI Features</h4>
  <label><input type="checkbox" id="ai-self-healing"> AI-Powered Self-Healing</label>
  <label><input type="checkbox" id="ai-test-gen"> Natural Language Test Generation</label>
  <label><input type="checkbox" id="ai-assertions"> Smart Assertion Suggestions</label>
  <label><input type="checkbox" id="ai-failure-analysis"> Failure Analysis</label>
</div>
```

### AI Provider Abstraction

```typescript
// src/ai/providers/ai-provider.ts
export interface AIProvider {
  name: string;
  complete(prompt: AIPrompt): Promise<AIResponse>;
  stream(prompt: AIPrompt): AsyncGenerator<string>;
  validateApiKey(): Promise<boolean>;
}

// src/ai/providers/anthropic-provider.ts
export class AnthropicProvider implements AIProvider {
  name = 'Anthropic Claude';

  constructor(private apiKey: string, private model: string = 'claude-3-5-sonnet-20241022') {}

  async complete(prompt: AIPrompt): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: prompt.maxTokens || 1024,
        messages: [{ role: 'user', content: prompt.content }],
        system: prompt.system
      })
    });

    return response.json();
  }
}

// src/ai/providers/openai-provider.ts
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  constructor(private apiKey: string, private model: string = 'gpt-4o') {}

  async complete(prompt: AIPrompt): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.content }
        ],
        max_tokens: prompt.maxTokens || 1024
      })
    });

    return response.json();
  }
}
```

### Security Considerations

1. **API Key Storage**: Use `chrome.storage.local` with encryption wrapper
2. **Key Validation**: Validate keys before storing (test API call)
3. **No Server Relay**: Direct browser-to-provider communication
4. **Minimal Data Transmission**: Only send necessary context to AI
5. **User Consent**: Clear opt-in for AI features with data usage explanation

```typescript
// src/ai/utils/secure-storage.ts
export class SecureKeyStorage {
  private static readonly ENCRYPTION_KEY = 'kr-ai-key';

  static async storeApiKey(provider: string, apiKey: string): Promise<void> {
    // Simple obfuscation (not true encryption, but adds a layer)
    const encoded = btoa(apiKey);
    await chrome.storage.local.set({
      [`ai_key_${provider}`]: encoded
    });
  }

  static async getApiKey(provider: string): Promise<string | null> {
    const result = await chrome.storage.local.get(`ai_key_${provider}`);
    const encoded = result[`ai_key_${provider}`];
    return encoded ? atob(encoded) : null;
  }
}
```

---

## Part 4: MCP Server Integration (Coding Agent Control)

### Vision

Transform Katalon Recorder into an **MCP (Model Context Protocol) server** that coding agents (Claude Code, Cursor, VS Code Copilot, Google Antigravity) can control programmatically. This enables:

- AI agents to record, execute, and modify tests
- Integration with development workflows (CI/CD, code review)
- Natural language test creation from within IDEs
- Automated test maintenance by coding assistants

### Competitive Landscape

| Tool | Approach | Open Source |
|------|----------|-------------|
| **Claude in Chrome** | Native Messaging API + MCP | ❌ Closed source |
| **Chrome DevTools MCP** | Chrome DevTools Protocol | ✅ [GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| **Playwright MCP** | Accessibility tree snapshots | ✅ [GitHub](https://github.com/microsoft/playwright-mcp) |
| **Browser MCP** | Extension + local MCP server | ✅ Partial [GitHub](https://github.com/BrowserMCP/mcp) |
| **mcp-chrome** | Extension-based MCP server | ✅ [GitHub](https://github.com/hangwin/mcp-chrome) |
| **Google Antigravity** | Built-in browser control | ❌ Closed source |

### Architecture Patterns (From Research)

#### Pattern 1: Claude in Chrome (Native Messaging)
**Source**: [Claude Code Chrome Docs](https://code.claude.com/docs/en/chrome)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Claude Code   │────▶│  Native Messaging │────▶│ Chrome Extension│
│   (Terminal)    │◀────│     Host          │◀────│   (MCP Server)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │ JSON-RPC               │ Unix Socket            │ Chrome APIs
        │ (MCP Protocol)         │ /tmp/claude-mcp-*      │
        ▼                        ▼                        ▼
   Tool Invocations         Bridge Process          Browser Control
```

**Key Insight**: Uses Chrome's Native Messaging API with a bridge process for bidirectional communication.

#### Pattern 2: Chrome DevTools MCP (CDP)
**Source**: [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│   MCP Server     │────▶│ Chrome DevTools │
│ (Claude/Cursor) │◀────│ (Node.js process)│◀────│   Protocol      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │ STDIO/SSE              │ WebSocket              │ CDP Commands
        │                        │ ws://127.0.0.1:9222    │
        ▼                        ▼                        ▼
   26 Tools Available      Protocol Adapter         Browser Instance
```

**Key Insight**: Connects to Chrome's remote debugging port, doesn't require an extension.

#### Pattern 3: Browser MCP (Extension + HTTP)
**Source**: [mcp-chrome](https://github.com/hangwin/mcp-chrome)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│   MCP Server     │────▶│ Chrome Extension│
│                 │◀────│ (mcp-chrome-     │◀────│   (MCP Chrome)  │
└─────────────────┘     │  bridge)         │     └─────────────────┘
        │               └──────────────────┘              │
        │ HTTP                   │                        │
        │ localhost:12306/mcp    │ WebSocket/Extension    │ Chrome APIs
        ▼                        ▼  Messaging             ▼
   Streamable HTTP          Bridge to Extension      20+ Browser Tools
```

**Key Insight**: Uses HTTP transport with a bridge to the extension, easier to integrate.

### Proposed Katalon MCP Architecture

#### Option A: Extension-Native MCP Server (Recommended)

Katalon Recorder becomes its own MCP server, exposing test automation tools directly:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│  Katalon MCP     │────▶│ Katalon Recorder│
│ (Claude Code,   │◀────│  Bridge          │◀────│  Extension      │
│  Cursor, etc.)  │     │ (Node.js)        │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │ STDIO/HTTP             │ WebSocket              │ Test Automation
        │ (MCP Protocol)         │ localhost:50001        │
        ▼                        ▼                        ▼
   Test Automation          Message Routing          Record/Playback
   Tools (30+)                                       Self-Healing
                                                     Export
```

**Components**:

1. **katalon-mcp-bridge** (npm package)
   - Node.js process that implements MCP server protocol
   - Communicates with extension via WebSocket
   - Exposes tools to AI agents

2. **Extension WebSocket Server**
   - Runs inside Katalon Recorder extension
   - Receives commands from bridge
   - Executes test automation actions

3. **MCP Tool Definitions**
   - Structured tools for recording, playback, export
   - JSON schema for tool parameters
   - Streaming responses for long operations

### MCP Tools Specification

#### Test Management Tools

```typescript
// src/mcp/tools/test-management.ts

/**
 * Tool: katalon_list_test_suites
 * Lists all test suites in the current project
 */
interface ListTestSuitesTool {
  name: 'katalon_list_test_suites';
  description: 'List all test suites and test cases in Katalon Recorder';
  inputSchema: {
    type: 'object';
    properties: {};
  };
  returns: {
    suites: Array<{
      id: string;
      name: string;
      testCases: Array<{
        id: string;
        name: string;
        commandCount: number;
      }>;
    }>;
  };
}

/**
 * Tool: katalon_get_test_case
 * Get details of a specific test case
 */
interface GetTestCaseTool {
  name: 'katalon_get_test_case';
  description: 'Get the commands in a specific test case';
  inputSchema: {
    type: 'object';
    properties: {
      testCaseId: { type: 'string', description: 'ID of the test case' };
    };
    required: ['testCaseId'];
  };
  returns: {
    id: string;
    name: string;
    commands: Array<{
      command: string;
      target: string;
      value: string;
    }>;
  };
}

/**
 * Tool: katalon_create_test_case
 * Create a new test case from commands
 */
interface CreateTestCaseTool {
  name: 'katalon_create_test_case';
  description: 'Create a new test case with the specified commands';
  inputSchema: {
    type: 'object';
    properties: {
      name: { type: 'string', description: 'Name of the test case' };
      suiteId: { type: 'string', description: 'ID of the parent test suite' };
      commands: {
        type: 'array';
        items: {
          type: 'object';
          properties: {
            command: { type: 'string' };
            target: { type: 'string' };
            value: { type: 'string' };
          };
        };
      };
    };
    required: ['name', 'commands'];
  };
}
```

#### Recording Tools

```typescript
/**
 * Tool: katalon_start_recording
 * Start recording user interactions
 */
interface StartRecordingTool {
  name: 'katalon_start_recording';
  description: 'Start recording browser interactions into a test case';
  inputSchema: {
    type: 'object';
    properties: {
      testCaseId: { type: 'string', description: 'Target test case ID (optional, creates new if omitted)' };
      url: { type: 'string', description: 'URL to navigate to before recording' };
    };
  };
}

/**
 * Tool: katalon_stop_recording
 * Stop recording and return captured commands
 */
interface StopRecordingTool {
  name: 'katalon_stop_recording';
  description: 'Stop recording and return the captured commands';
  inputSchema: {
    type: 'object';
    properties: {};
  };
  returns: {
    commands: Array<{ command: string; target: string; value: string }>;
    duration: number;
  };
}
```

#### Playback Tools

```typescript
/**
 * Tool: katalon_run_test_case
 * Execute a test case and return results
 */
interface RunTestCaseTool {
  name: 'katalon_run_test_case';
  description: 'Run a test case and return pass/fail results';
  inputSchema: {
    type: 'object';
    properties: {
      testCaseId: { type: 'string', description: 'ID of the test case to run' };
      variables: {
        type: 'object';
        description: 'Variables to substitute in the test';
        additionalProperties: { type: 'string' };
      };
    };
    required: ['testCaseId'];
  };
  returns: {
    status: 'passed' | 'failed' | 'error';
    duration: number;
    results: Array<{
      command: string;
      target: string;
      status: 'passed' | 'failed';
      error?: string;
      screenshot?: string; // base64
    }>;
  };
}

/**
 * Tool: katalon_run_test_suite
 * Execute an entire test suite
 */
interface RunTestSuiteTool {
  name: 'katalon_run_test_suite';
  description: 'Run all test cases in a test suite';
  inputSchema: {
    type: 'object';
    properties: {
      suiteId: { type: 'string' };
      stopOnFailure: { type: 'boolean', default: false };
    };
    required: ['suiteId'];
  };
}
```

#### Export Tools

```typescript
/**
 * Tool: katalon_export_test
 * Export test case to various formats
 */
interface ExportTestTool {
  name: 'katalon_export_test';
  description: 'Export a test case to Playwright, Puppeteer, or other formats';
  inputSchema: {
    type: 'object';
    properties: {
      testCaseId: { type: 'string' };
      format: {
        type: 'string';
        enum: ['playwright', 'puppeteer', 'webdriver', 'cypress', 'json'];
      };
    };
    required: ['testCaseId', 'format'];
  };
  returns: {
    code: string;
    language: string;
  };
}
```

#### Browser Interaction Tools

```typescript
/**
 * Tool: katalon_execute_command
 * Execute a single Katalon command on the current page
 */
interface ExecuteCommandTool {
  name: 'katalon_execute_command';
  description: 'Execute a single test command on the active browser tab';
  inputSchema: {
    type: 'object';
    properties: {
      command: {
        type: 'string';
        enum: ['click', 'type', 'select', 'open', 'assertText', 'assertElementPresent',
               'waitForElementPresent', 'verifyText', 'storeText', 'pause'];
      };
      target: { type: 'string', description: 'Element locator (CSS, XPath, ID, etc.)' };
      value: { type: 'string', description: 'Value for the command (optional)' };
    };
    required: ['command', 'target'];
  };
}

/**
 * Tool: katalon_get_page_elements
 * Get interactive elements on the current page
 */
interface GetPageElementsTool {
  name: 'katalon_get_page_elements';
  description: 'Get a list of interactive elements on the current page with their locators';
  inputSchema: {
    type: 'object';
    properties: {
      filter: {
        type: 'string';
        enum: ['all', 'buttons', 'inputs', 'links', 'forms'];
        default: 'all';
      };
    };
  };
  returns: {
    elements: Array<{
      tagName: string;
      text: string;
      locators: {
        id?: string;
        css: string;
        xpath: string;
        testId?: string;
      };
      attributes: Record<string, string>;
    }>;
  };
}

/**
 * Tool: katalon_get_page_snapshot
 * Get accessibility tree snapshot of current page
 */
interface GetPageSnapshotTool {
  name: 'katalon_get_page_snapshot';
  description: 'Get structured accessibility snapshot of the current page (like Playwright MCP)';
  inputSchema: {
    type: 'object';
    properties: {
      includeHidden: { type: 'boolean', default: false };
    };
  };
  returns: {
    url: string;
    title: string;
    accessibilityTree: AccessibilityNode[];
  };
}
```

#### Self-Healing Tools

```typescript
/**
 * Tool: katalon_get_healing_suggestions
 * Get AI-suggested locator fixes for a failed element
 */
interface GetHealingSuggestionsTool {
  name: 'katalon_get_healing_suggestions';
  description: 'Get alternative locators for a broken element selector';
  inputSchema: {
    type: 'object';
    properties: {
      failedLocator: { type: 'string', description: 'The locator that failed' };
      context: { type: 'string', description: 'Description of what element you are looking for' };
    };
    required: ['failedLocator'];
  };
  returns: {
    suggestions: Array<{
      locator: string;
      type: 'css' | 'xpath' | 'id' | 'testId';
      confidence: number;
      reason: string;
    }>;
  };
}

/**
 * Tool: katalon_apply_healing
 * Apply a healing suggestion to a test case
 */
interface ApplyHealingTool {
  name: 'katalon_apply_healing';
  description: 'Update a test case command with a new locator';
  inputSchema: {
    type: 'object';
    properties: {
      testCaseId: { type: 'string' };
      commandIndex: { type: 'number' };
      newTarget: { type: 'string' };
    };
    required: ['testCaseId', 'commandIndex', 'newTarget'];
  };
}
```

### Implementation: MCP Bridge Package

```typescript
// packages/katalon-mcp-bridge/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocket } from 'ws';

const KATALON_WS_PORT = 50001;

class KatalonMCPServer {
  private server: Server;
  private ws: WebSocket | null = null;
  private pendingRequests = new Map<string, { resolve: Function; reject: Function }>();

  constructor() {
    this.server = new Server(
      { name: 'katalon-recorder', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    this.registerTools();
    this.connectToExtension();
  }

  private async connectToExtension() {
    this.ws = new WebSocket(`ws://localhost:${KATALON_WS_PORT}`);

    this.ws.on('message', (data) => {
      const response = JSON.parse(data.toString());
      const pending = this.pendingRequests.get(response.id);
      if (pending) {
        pending.resolve(response.result);
        this.pendingRequests.delete(response.id);
      }
    });
  }

  private async sendToExtension(method: string, params: any): Promise<any> {
    const id = crypto.randomUUID();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.ws?.send(JSON.stringify({ id, method, params }));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  private registerTools() {
    // List test suites
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'katalon_list_test_suites':
          return this.sendToExtension('listTestSuites', {});

        case 'katalon_run_test_case':
          return this.sendToExtension('runTestCase', args);

        case 'katalon_start_recording':
          return this.sendToExtension('startRecording', args);

        case 'katalon_stop_recording':
          return this.sendToExtension('stopRecording', {});

        case 'katalon_execute_command':
          return this.sendToExtension('executeCommand', args);

        case 'katalon_export_test':
          return this.sendToExtension('exportTest', args);

        case 'katalon_get_page_elements':
          return this.sendToExtension('getPageElements', args);

        // ... more tools
      }
    });

    // List available tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'katalon_list_test_suites',
          description: 'List all test suites and test cases',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'katalon_run_test_case',
          description: 'Execute a test case and return results',
          inputSchema: {
            type: 'object',
            properties: {
              testCaseId: { type: 'string' }
            },
            required: ['testCaseId']
          }
        },
        // ... more tool definitions
      ]
    }));
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Entry point
const server = new KatalonMCPServer();
server.start();
```

### Extension WebSocket Handler

```typescript
// src/mcp/extension-ws-server.ts

class KatalonMCPExtensionServer {
  private wss: WebSocketServer;

  constructor() {
    // Create WebSocket server in extension's background service worker
    // Note: This requires specific permissions in manifest.json
    this.wss = new WebSocketServer({ port: 50001 });

    this.wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        const request = JSON.parse(data.toString());
        const result = await this.handleRequest(request);
        ws.send(JSON.stringify({ id: request.id, result }));
      });
    });
  }

  private async handleRequest(request: { method: string; params: any }) {
    switch (request.method) {
      case 'listTestSuites':
        return this.listTestSuites();
      case 'runTestCase':
        return this.runTestCase(request.params);
      case 'startRecording':
        return this.startRecording(request.params);
      case 'executeCommand':
        return this.executeCommand(request.params);
      // ... more handlers
    }
  }

  private async listTestSuites() {
    // Access Katalon Recorder's internal state
    const suites = window.KRData?.testSuites || [];
    return {
      suites: suites.map(suite => ({
        id: suite.id,
        name: suite.name,
        testCases: suite.testCases.map(tc => ({
          id: tc.id,
          name: tc.name,
          commandCount: tc.commands.length
        }))
      }))
    };
  }

  private async runTestCase(params: { testCaseId: string }) {
    // Trigger playback and stream results
    return new Promise((resolve) => {
      window.KRPlayback.run(params.testCaseId, (results) => {
        resolve({
          status: results.every(r => r.passed) ? 'passed' : 'failed',
          results: results
        });
      });
    });
  }
}
```

### Configuration for AI Clients

#### Claude Code Configuration
```bash
# Add Katalon MCP server to Claude Code
claude mcp add katalon-recorder npx katalon-mcp-bridge@latest
```

#### Claude Desktop (config.json)
```json
{
  "mcpServers": {
    "katalon-recorder": {
      "command": "npx",
      "args": ["katalon-mcp-bridge@latest"]
    }
  }
}
```

#### VS Code / Cursor Settings
```json
{
  "mcp.servers": {
    "katalon-recorder": {
      "command": "npx",
      "args": ["katalon-mcp-bridge@latest"]
    }
  }
}
```

### Use Cases Enabled by MCP

#### 1. AI-Driven Test Creation
```
User: "Create a test that logs into example.com with user@test.com"

Agent uses:
1. katalon_execute_command(open, "https://example.com/login")
2. katalon_get_page_elements(filter: "inputs")
3. katalon_execute_command(type, "#email", "user@test.com")
4. katalon_execute_command(type, "#password", "***")
5. katalon_execute_command(click, "#login-btn")
6. katalon_create_test_case(name: "Login Test", commands: [...])
```

#### 2. Automated Test Maintenance
```
User: "Fix the failing login test"

Agent uses:
1. katalon_run_test_case(testCaseId: "login-test")
2. (sees failure on step 3: element not found)
3. katalon_get_healing_suggestions(failedLocator: "#email")
4. katalon_apply_healing(testCaseId, 2, "[data-testid='email-input']")
5. katalon_run_test_case (verify fix)
```

#### 3. CI/CD Integration
```
Agent in GitHub Actions:
1. katalon_list_test_suites()
2. katalon_run_test_suite(suiteId: "regression")
3. Return results as PR comment
```

### Security Model

```typescript
// Security configuration for MCP server
interface MCPSecurityConfig {
  // Allowed origins for WebSocket connections
  allowedOrigins: string[];  // ['localhost', '127.0.0.1']

  // Require authentication token
  requireAuth: boolean;
  authToken?: string;

  // Rate limiting
  maxRequestsPerMinute: number;

  // Capability restrictions
  capabilities: {
    canRecord: boolean;       // Allow recording
    canExecute: boolean;      // Allow command execution
    canExport: boolean;       // Allow code export
    canModifyTests: boolean;  // Allow test modification
  };
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Set up TypeScript and Webpack build system
- [ ] Create Manifest V3 compatible structure
- [ ] Migrate background scripts to service worker
- [ ] Define core TypeScript interfaces
- [ ] Set up testing infrastructure

### Phase 2: MV3 Migration (Weeks 5-8)
- [ ] Complete service worker migration
- [ ] Remove all `unsafe-eval` dependencies
- [ ] Update all Chrome API calls to V3
- [ ] Migrate storage patterns
- [ ] Test cross-browser compatibility (Firefox, Edge)

### Phase 3: TypeScript Migration (Weeks 9-14)
- [ ] Migrate shared utilities
- [ ] Migrate models and services
- [ ] Migrate UI components
- [ ] Migrate content scripts
- [ ] Update all tests to TypeScript

### Phase 4: AI Integration (Weeks 15-20)
- [ ] Implement AI provider abstraction layer
- [ ] Add BYOK settings UI
- [ ] Implement AI-powered self-healing
- [ ] Add natural language test generation
- [ ] Add assertion suggestions
- [ ] Add failure analysis
- [ ] Security audit of AI features

### Phase 5: MCP Server Integration (Weeks 21-26)
- [ ] Design WebSocket server architecture for extension
- [ ] Create katalon-mcp-bridge npm package
- [ ] Implement core MCP tools (list, run, record, export)
- [ ] Add browser interaction tools (execute command, get elements)
- [ ] Add self-healing tools integration
- [ ] Implement security model (auth, rate limiting)
- [ ] Test with Claude Code, Cursor, VS Code
- [ ] Publish to npm registry

### Phase 6: Polish & Release (Weeks 27-30)
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Beta testing program
- [ ] Chrome Web Store submission
- [ ] Firefox Add-ons submission

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| MV3 breaking changes | High | Medium | Maintain V2 branch as fallback |
| `unsafe-eval` removal complexity | High | High | Early audit and incremental refactoring |
| AI API rate limits | Medium | Medium | Implement caching and rate limiting |
| Cross-browser incompatibility | Medium | Medium | Test early on Firefox/Edge |
| User resistance to BYOK | Low | Low | Clear value proposition, optional feature |

---

## Success Metrics

1. **Technical Metrics**
   - 0 `unsafe-eval` usages
   - 100% Manifest V3 compliance
   - >80% TypeScript coverage
   - <500ms AI response time (p95)

2. **User Metrics**
   - AI feature adoption rate >30%
   - Self-healing success rate improvement >50%
   - User satisfaction score (Chrome Web Store) >4.5

3. **Business Metrics**
   - No user loss during migration
   - Increased daily active users
   - Positive press/community feedback

---

## Appendix A: File Migration Map

| Current File | New Location | Notes |
|--------------|--------------|-------|
| `/background/background.js` | `src/background/service-worker.ts` | Major refactor required |
| `/panel/js/UI/` | `src/panel/` | TypeScript conversion |
| `/content/*.js` | `src/content/` | TypeScript conversion |
| `/katalon/ku-recorder.js` | `src/content/recorder.ts` | TypeScript conversion |
| `/panel/js/self-healing/` | `src/services/self-healing/` | Add AI enhancement |
| (new) | `src/ai/` | New AI module |

## Appendix B: New Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "openai": "^4.28.0"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "@types/chrome": "^0.0.260",
    "typescript": "^5.4.0",
    "webpack": "^5.90.0",
    "jest": "^29.7.0"
  }
}
```

---

*Document Version: 1.0*
*Created: January 2026*
*Author: Modernization Task Force*
