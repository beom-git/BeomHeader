//----// File Name     : test-setup.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 01:30:00 UTC (by root)--------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : test-setup.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test setup and utility functions for unit tests
//        o Common test helpers
//        o Mock utilities for VS Code API
//        o Assertion helpers
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';

/**
 * Mock VS Code Configuration object
 */
export class MockVSCodeConfig {
  private configMap: Map<string, any> = new Map();
  private globalSettings: Map<string, any> = new Map();

  get<T>(key: string, defaultValue?: T): T {
    if (this.configMap.has(key)) {
      return this.configMap.get(key) as T;
    }
    return defaultValue as T;
  }

  update(key: string, value: any, target?: any): Promise<void> {
    this.configMap.set(key, value);
    return Promise.resolve();
  }

  inspect<T>(key: string): { defaultValue?: T; globalValue?: T; workspaceValue?: T } {
    return {
      defaultValue: this.configMap.get(key) as T,
      globalValue: this.globalSettings.get(key) as T
    };
  }

  clear(): void {
    this.configMap.clear();
    this.globalSettings.clear();
  }

  setGlobalValue(key: string, value: any): void {
    this.globalSettings.set(key, value);
  }
}

/**
 * Mock VS Code WorkspaceConfiguration
 */
export function createMockWorkspaceConfig(): MockVSCodeConfig {
  return new MockVSCodeConfig();
}

/**
 * Mock VS Code Document
 */
export interface MockDocument {
  uri: { fsPath: string };
  fileName: string;
  languageId: string;
  getText(): string;
  lineCount: number;
  getLineUntilOffset(offset: number): string;
  validatePosition(pos: any): any;
  validateRange(range: any): any;
}

/**
 * Create a mock VS Code document
 */
export function createMockDocument(
  content: string = '',
  fileName: string = 'test.ts',
  languageId: string = 'typescript'
): MockDocument {
  const lines = content.split('\n');
  return {
    uri: { fsPath: `/home/user/workspace/${fileName}` },
    fileName,
    languageId,
    getText: () => content,
    lineCount: lines.length,
    getLineUntilOffset: (offset: number) => content.substring(0, offset),
    validatePosition: (pos: any) => pos,
    validateRange: (range: any) => range
  };
}

/**
 * Mock VS Code Editor
 */
export interface MockEditor {
  document: MockDocument;
  options: {
    tabSize: number | string;
    insertSpaces: boolean | string;
  };
}

/**
 * Create a mock VS Code editor
 */
export function createMockEditor(
  document: MockDocument = createMockDocument(),
  tabSize: number = 2,
  insertSpaces: boolean = true
): MockEditor {
  return {
    document,
    options: {
      tabSize,
      insertSpaces
    }
  };
}

/**
 * Mock VS Code WorkspaceEdit
 */
export class MockWorkspaceEdit {
  private edits: Map<string, any> = new Map();

  replace(uri: any, range: any, newText: string): void {
    this.edits.set(uri, { range, newText });
  }

  getEdits(): Map<string, any> {
    return this.edits;
  }

  clear(): void {
    this.edits.clear();
  }
}

/**
 * Mock VS Code Range
 */
export class MockRange {
  constructor(
    public start: { line: number; character: number },
    public end: { line: number; character: number }
  ) {}
}

/**
 * Helper: Create a valid header content string
 */
export function createHeaderContent(): string {
  return `//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : Test Project
// File Name     : test.ts
// Author        : Test Author
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 01:30:00 (by testuser)
// Editor        : Visual Studio Code, tab size (2)
// Description   : 
//
//     Test file header
//
//----------------------------------------------------------------------
// File History :
//      * 2025/11/07 : (v01p00, testuser) First Release
// To-Do List   :
//      * 2025/11/07 : (ToDo#00, testuser) None
//----------------------------------------------------------------------
`;
}

/**
 * Helper: Extract header section from content
 */
export function extractHeaderSection(content: string): string {
  const lines = content.split('\n');
  let headerStart = -1;
  let headerEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\/+\-+|^\*+\-+/)) {
      if (headerStart === -1) {
        headerStart = i;
      } else {
        headerEnd = i;
        break;
      }
    }
  }

  if (headerStart !== -1 && headerEnd !== -1) {
    return lines.slice(headerStart, headerEnd + 1).join('\n');
  }

  return '';
}

/**
 * Helper: Validate date string format
 */
export function assertValidDateString(
  dateStr: string,
  format: 'YYYY/MM/DD' | 'YYYY-MM-DD HH:MM:SS' = 'YYYY-MM-DD HH:MM:SS'
): void {
  if (format === 'YYYY-MM-DD HH:MM:SS') {
    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    expect(dateStr).to.match(pattern, `Invalid timestamp format: ${dateStr}`);
  } else if (format === 'YYYY/MM/DD') {
    const pattern = /^\d{4}\/\d{2}\/\d{2}$/;
    expect(dateStr).to.match(pattern, `Invalid date format: ${dateStr}`);
  }
}

/**
 * Helper: Create stub for vscode.workspace.getConfiguration
 */
export function stubGetConfiguration(config: MockVSCodeConfig): sinon.SinonStub {
  return sinon.stub().returns(config);
}

/**
 * Helper: Create stub for file operations
 */
export function createFileOperationStubs() {
  return {
    readFile: sinon.stub(),
    writeFile: sinon.stub(),
    exists: sinon.stub()
  };
}

/**
 * Global test configuration
 */
export const TestConfig = {
  timeout: 5000,
  slow: 1000,
  defaultLanguage: 'typescript',
  defaultTimezone: 'UTC'
};

/**
 * Test helper: Assert file header exists
 */
export function assertHeaderExists(content: string, expectedTitle: string = 'File Name'): boolean {
  const headerPattern = /^\/+\-+[\s\S]*?\-+\/+$/m;
  const hasHeader = headerPattern.test(content);
  
  if (hasHeader && expectedTitle) {
    return content.includes(expectedTitle);
  }
  
  return hasHeader;
}

/**
 * Test helper: Count specific pattern in content
 */
export function countPattern(content: string, pattern: RegExp): number {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Mock VS Code Range
 */
export interface MockPosition {
  line: number;
  character: number;
}

export interface MockRange {
  start: MockPosition;
  end: MockPosition;
}

/**
 * Helper: Create mock Range object
 */
export function createMockRange(
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
): MockRange {
  return {
    start: { line: startLine, character: startChar },
    end: { line: endLine, character: endChar }
  };
}

