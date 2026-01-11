/**
 * Locator building and resolution
 */

import type { Locator, LocatorStrategy, RankedLocator } from '../types';

/**
 * Priority order for locator strategies (lower = better)
 */
const STRATEGY_PRIORITY: LocatorStrategy[] = [
  'testId',
  'role',
  'label',
  'placeholder',
  'text',
  'id',
  'name',
  'css',
  'xpath',
];

/**
 * Build multiple locators for an element, ranked by stability
 */
export function buildLocators(element: Element): RankedLocator[] {
  const locators: RankedLocator[] = [];
  let priority = 0;

  // Test ID (data-testid, data-test, data-cy)
  const testId = getTestId(element);
  if (testId) {
    locators.push({
      strategy: 'testId',
      value: testId,
      priority: priority++,
      confidence: 1.0,
    });
  }

  // ID attribute
  const id = element.id;
  if (id && !isGeneratedId(id)) {
    locators.push({
      strategy: 'id',
      value: id,
      priority: priority++,
      confidence: 0.9,
    });
  }

  // Name attribute
  const name = element.getAttribute('name');
  if (name) {
    locators.push({
      strategy: 'name',
      value: name,
      priority: priority++,
      confidence: 0.8,
    });
  }

  // Link text (for anchors)
  if (element.tagName === 'A') {
    const linkText = element.textContent?.trim();
    if (linkText && linkText.length < 50) {
      locators.push({
        strategy: 'linkText',
        value: linkText,
        priority: priority++,
        confidence: 0.7,
      });
    }
  }

  // CSS selector
  const cssSelector = buildCssSelector(element);
  if (cssSelector) {
    locators.push({
      strategy: 'css',
      value: cssSelector,
      priority: priority++,
      confidence: 0.6,
    });
  }

  // XPath (fallback)
  const xpath = buildXPath(element);
  locators.push({
    strategy: 'xpath',
    value: xpath,
    priority: priority++,
    confidence: 0.5,
  });

  return locators;
}

/**
 * Resolve a locator to an element
 */
export function resolveLocator(locator: Locator, root: Document | Element = document): Element | null {
  switch (locator.strategy) {
    case 'id':
      return document.getElementById(locator.value);

    case 'name':
      return root.querySelector(`[name="${escapeSelector(locator.value)}"]`);

    case 'testId':
      return (
        root.querySelector(`[data-testid="${escapeSelector(locator.value)}"]`) ||
        root.querySelector(`[data-test="${escapeSelector(locator.value)}"]`) ||
        root.querySelector(`[data-cy="${escapeSelector(locator.value)}"]`)
      );

    case 'css':
      return root.querySelector(locator.value);

    case 'xpath':
      const result = document.evaluate(
        locator.value,
        root,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue as Element | null;

    case 'linkText':
      const links = root.querySelectorAll('a');
      for (const link of links) {
        if (link.textContent?.trim() === locator.value) {
          return link;
        }
      }
      return null;

    default:
      return null;
  }
}

/**
 * Parse a locator string (e.g., "css=.btn" or "xpath=//div")
 */
export function parseLocatorString(str: string): Locator {
  const match = str.match(/^(\w+)=(.+)$/);
  if (match) {
    return {
      strategy: match[1] as LocatorStrategy,
      value: match[2],
    };
  }

  // Default to CSS if no prefix
  return {
    strategy: 'css',
    value: str,
  };
}

/**
 * Format a locator as a string
 */
export function formatLocator(locator: Locator): string {
  return `${locator.strategy}=${locator.value}`;
}

// Helper functions

function getTestId(element: Element): string | null {
  return (
    element.getAttribute('data-testid') ||
    element.getAttribute('data-test') ||
    element.getAttribute('data-cy') ||
    null
  );
}

function isGeneratedId(id: string): boolean {
  // Common patterns for generated IDs
  return /^(ember|react|vue|ng|ext-|yui_|[a-f0-9]{8}-[a-f0-9]{4})/i.test(id) ||
    /^\d+$/.test(id) ||
    /_\d+$/.test(id);
}

function buildCssSelector(element: Element): string | null {
  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    // Add class if available (but not generated classes)
    const classes = Array.from(current.classList)
      .filter((c) => !isGeneratedClass(c))
      .slice(0, 2);

    if (classes.length > 0) {
      selector += '.' + classes.join('.');
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    parts.unshift(selector);

    // Stop if we have a unique selector
    if (document.querySelectorAll(parts.join(' > ')).length === 1) {
      return parts.join(' > ');
    }

    current = parent;
  }

  return parts.length > 0 ? parts.join(' > ') : null;
}

function isGeneratedClass(className: string): boolean {
  // Common patterns for generated class names
  return /^(css-|sc-|styled-|emotion-|_[a-z]+_[a-z0-9]+)/i.test(className) ||
    /[A-Z][a-z]+__[A-Z][a-z]+/i.test(className); // BEM-like generated
}

function buildXPath(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling: Element | null = current.previousElementSibling;

    while (sibling) {
      if (sibling.tagName === current.tagName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }

    const tagName = current.tagName.toLowerCase();
    parts.unshift(`${tagName}[${index}]`);

    current = current.parentElement;
  }

  return '//' + parts.join('/');
}

function escapeSelector(str: string): string {
  return str.replace(/["\\]/g, '\\$&');
}
