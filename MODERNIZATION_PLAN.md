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

### Current State
- Vanilla JavaScript (ES6 modules)
- No build system (raw files served directly)
- jQuery 3.2.1 for DOM manipulation
- No type checking
- No bundling or minification

### Proposed Architecture

```
katalon-recorder/
├── src/
│   ├── background/           # Service worker code
│   │   └── service-worker.ts
│   ├── content/             # Content scripts
│   │   ├── recorder.ts
│   │   └── locator-builder.ts
│   ├── panel/               # Main UI
│   │   ├── components/      # UI components
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── index.tsx
│   ├── shared/              # Shared utilities
│   │   ├── types/          # TypeScript interfaces
│   │   ├── constants.ts
│   │   └── storage.ts
│   └── ai/                  # AI integration module
│       ├── providers/       # LLM provider implementations
│       ├── services/        # AI services
│       └── index.ts
├── dist/                    # Built extension
├── tests/                   # Test suite
├── package.json
├── tsconfig.json
├── webpack.config.js
└── manifest.json
```

### Build System Setup

#### Package.json (New)
```json
{
  "name": "katalon-recorder",
  "version": "6.0.0",
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "@types/chrome": "^0.0.260",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "copy-webpack-plugin": "^12.0.0",
    "css-loader": "^6.10.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "openai": "^4.28.0",
    "style-loader": "^3.3.4",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.5.0",
    "typescript": "^5.4.0",
    "webpack": "^5.90.0",
    "webpack-cli": "^5.1.0"
  }
}
```

### TypeScript Migration Strategy

#### Phase 2.1: Setup Infrastructure
1. Initialize TypeScript configuration
2. Set up Webpack for bundling
3. Configure ESLint with TypeScript rules
4. Set up Jest for testing

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
  type: 'xpath' | 'css' | 'id' | 'name' | 'linkText';
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

### Phase 5: Polish & Release (Weeks 21-24)
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
