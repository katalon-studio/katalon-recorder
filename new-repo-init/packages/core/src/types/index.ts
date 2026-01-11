/**
 * Core type definitions for Katalon Recorder
 */

// ============================================================================
// Commands
// ============================================================================

export interface Command {
  id: string;
  command: string;
  target: string;
  value: string;
  comment?: string;
  locators?: Locator[];
  timestamp?: number;
}

export type CommandStatus = 'pending' | 'executing' | 'passed' | 'failed' | 'skipped';

export interface CommandResult {
  status: 'passed' | 'failed' | 'error';
  message?: string;
  error?: string;
  duration?: number;
  screenshot?: string;
  healedLocator?: Locator;
}

export interface CommandDefinition {
  name: string;
  description: string;
  target?: {
    required: boolean;
    description: string;
  };
  value?: {
    required: boolean;
    description: string;
  };
  returns?: string;
}

// ============================================================================
// Locators
// ============================================================================

export type LocatorStrategy =
  | 'role'
  | 'testId'
  | 'text'
  | 'label'
  | 'placeholder'
  | 'css'
  | 'xpath'
  | 'id'
  | 'name'
  | 'linkText';

export interface Locator {
  strategy: LocatorStrategy;
  value: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface RankedLocator extends Locator {
  priority: number;
}

// ============================================================================
// Tests
// ============================================================================

export interface TestCase {
  id: string;
  name: string;
  commands: Command[];
  baseUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TestSuite {
  id: string;
  name: string;
  testCases: TestCase[];
  createdAt: number;
  updatedAt: number;
}

export interface TestProject {
  id: string;
  name: string;
  version: string;
  suites: TestSuite[];
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectSettings {
  baseUrl?: string;
  timeout?: number;
  locatorStrategies?: LocatorStrategy[];
  aiProvider?: string;
}

// ============================================================================
// Playback
// ============================================================================

export type PlaybackStatus =
  | 'idle'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'completed'
  | 'failed'
  | 'error';

export interface PlaybackState {
  status: PlaybackStatus;
  currentCommandIndex: number;
  results: Map<string, CommandResult>;
  variables: Map<string, unknown>;
  startTime?: number;
  endTime?: number;
}

export interface PlaybackOptions {
  speed?: number;
  pauseOnFailure?: boolean;
  stopOnFailure?: boolean;
  enableHealing?: boolean;
  enableAI?: boolean;
  timeout?: number;
}

// ============================================================================
// Recording
// ============================================================================

export type RecordingStatus = 'idle' | 'recording' | 'paused';

export interface RecordingState {
  status: RecordingStatus;
  commands: Command[];
  startTime?: number;
  tabId?: number;
  frameId?: number;
}

export interface RecordingOptions {
  captureScreenshots?: boolean;
  locatorStrategies?: LocatorStrategy[];
  filterEvents?: string[];
}

// ============================================================================
// Self-Healing
// ============================================================================

export interface HealingContext {
  command: Command;
  originalLocator: Locator;
  pageUrl: string;
  htmlSnapshot?: string;
  previousLocators?: Locator[];
}

export interface HealingResult {
  success: boolean;
  locator?: Locator;
  confidence: number;
  strategy: string;
  message?: string;
}

export interface HealingSuggestion {
  locator: Locator;
  confidence: number;
  reason: string;
}

// ============================================================================
// AI
// ============================================================================

export interface AIProvider {
  name: string;
  suggestLocators(context: HealingContext): Promise<HealingSuggestion[]>;
  generateTest(prompt: string, context: PageContext): Promise<Command[]>;
  explainTest(commands: Command[]): Promise<string>;
  suggestAssertions(element: ElementSnapshot): Promise<Command[]>;
}

export interface PageContext {
  url: string;
  title: string;
  html?: string;
  screenshot?: string;
}

export interface ElementSnapshot {
  tagName: string;
  attributes: Record<string, string>;
  textContent?: string;
  boundingBox?: DOMRect;
  computedStyles?: Record<string, string>;
}

// ============================================================================
// Events
// ============================================================================

export type KatalonEvent =
  | { type: 'recording:started'; data: { tabId: number } }
  | { type: 'recording:stopped'; data: { commands: Command[] } }
  | { type: 'recording:command'; data: { command: Command } }
  | { type: 'playback:started'; data: { testCase: TestCase } }
  | { type: 'playback:stopped'; data: { reason: string } }
  | { type: 'playback:command:start'; data: { command: Command; index: number } }
  | { type: 'playback:command:end'; data: { command: Command; result: CommandResult } }
  | { type: 'playback:completed'; data: { results: CommandResult[] } }
  | { type: 'healing:started'; data: { command: Command } }
  | { type: 'healing:completed'; data: { result: HealingResult } };

export type EventHandler<T extends KatalonEvent['type']> = (
  event: Extract<KatalonEvent, { type: T }>
) => void;

// ============================================================================
// Storage
// ============================================================================

export interface StorageAdapter {
  getProject(id: string): Promise<TestProject | null>;
  saveProject(project: TestProject): Promise<void>;
  deleteProject(id: string): Promise<void>;
  listProjects(): Promise<TestProject[]>;
  exportProject(id: string, format: string): Promise<string>;
  importProject(data: string, format: string): Promise<TestProject>;
}
