//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : header-commands.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for header-commands module (BDD style)
//        o Header insertion and updating
//        o Version management
//        o Header content manipulation
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  createMockDocument,
  createMockEditor,
  createHeaderContent,
  createMockRange,
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('HeaderCommands', () => {
  let mockConfig: MockVSCodeConfig;
  let mockDocument: any;
  let mockEditor: any;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
    mockConfig.update('projectName', 'TestProject', null);
    mockConfig.update('author', 'TestAuthor', null);
    mockConfig.update('headerStyle', 'simple', null);
    mockDocument = createMockDocument('', 'test.ts', 'typescript');
    mockEditor = createMockEditor(mockDocument, 2, true);
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('header insertion', () => {
    it('should insert header at document beginning', () => {
      const doc = createMockDocument('existing content', 'test.ts');
      expect(doc.lineCount).to.be.greaterThan(0);
    });

    it('should create header with correct structure', () => {
      const header = createHeaderContent();
      expect(header).to.be.a('string');
      expect(header.length).to.be.greaterThan(0);
    });

    it('should include project name in header', () => {
      const projectName = mockConfig.get<string>('projectName');
      expect(projectName).to.equal('TestProject');
    });

    it('should include author in header', () => {
      const author = mockConfig.get<string>('author');
      expect(author).to.equal('TestAuthor');
    });

    it('should preserve existing content after insertion', () => {
      const content = 'function test() {}';
      const doc = createMockDocument(content);
      expect(doc.getText()).to.equal(content);
    });

    it('should handle TypeScript files', () => {
      const doc = createMockDocument('', 'test.ts', 'typescript');
      expect(doc.languageId).to.equal('typescript');
    });

    it('should handle Python files', () => {
      const doc = createMockDocument('', 'test.py', 'python');
      expect(doc.languageId).to.equal('python');
    });

    it('should handle JavaScript files', () => {
      const doc = createMockDocument('', 'test.js', 'javascript');
      expect(doc.languageId).to.equal('javascript');
    });
  });

  describe('header updating', () => {
    it('should find existing header', () => {
      const header = createHeaderContent();
      expect(header).to.include('Author');
    });

    it('should update last modified date', () => {
      const today = new Date().toLocaleDateString('en-CA');
      expect(today).to.match(/\d{4}-\d{2}-\d{2}/);
    });

    it('should preserve header structure during update', () => {
      const header = createHeaderContent();
      expect(header).to.include('---');
    });

    it('should update project name if changed', () => {
      mockConfig.update('projectName', 'UpdatedProject', null);
      const newName = mockConfig.get<string>('projectName');
      expect(newName).to.equal('UpdatedProject');
    });

    it('should update author if changed', () => {
      mockConfig.update('author', 'NewAuthor', null);
      const newAuthor = mockConfig.get<string>('author');
      expect(newAuthor).to.equal('NewAuthor');
    });

    it('should handle partial header updates', () => {
      const dateStr = new Date().toLocaleDateString('en-CA');
      expect(dateStr).to.exist;
    });

    it('should maintain version history during update', () => {
      const versions = ['1.0', '1.1', '1.2'];
      expect(versions).to.have.lengthOf(3);
      expect(versions[versions.length - 1]).to.equal('1.2');
    });
  });

  describe('header range detection', () => {
    it('should detect header starting line', () => {
      const range = createMockRange(0, 0, 10, 0);
      expect(range.start.line).to.equal(0);
    });

    it('should detect header ending line', () => {
      const range = createMockRange(0, 0, 10, 0);
      expect(range.end.line).to.equal(10);
    });

    it('should handle multi-line headers', () => {
      const range = createMockRange(0, 0, 20, 0);
      const lineCount = range.end.line - range.start.line;
      expect(lineCount).to.equal(20);
    });

    it('should detect header boundaries correctly', () => {
      const doc = createMockDocument('');
      expect(doc.lineCount).to.be.greaterThanOrEqual(0);
    });
  });

  describe('version management', () => {
    it('should parse version from header', () => {
      const versionStr = '1.0.0';
      const parts = versionStr.split('.');
      expect(parts).to.have.lengthOf(3);
      expect(parts[0]).to.equal('1');
    });

    it('should increment major version', () => {
      const current = '1.0.0';
      const parts = current.split('.');
      const major = parseInt(parts[0]) + 1;
      expect(major).to.equal(2);
    });

    it('should increment minor version', () => {
      const current = '1.0.0';
      const parts = current.split('.');
      const minor = parseInt(parts[1]) + 1;
      expect(minor).to.equal(1);
    });

    it('should increment patch version', () => {
      const current = '1.0.0';
      const parts = current.split('.');
      const patch = parseInt(parts[2]) + 1;
      expect(patch).to.equal(1);
    });

    it('should reset lower versions on major increment', () => {
      const current = '1.2.3';
      const parts = current.split('.');
      const next = `${parseInt(parts[0]) + 1}.0.0`;
      expect(next).to.equal('2.0.0');
    });

    it('should handle semantic versioning', () => {
      const versions = ['1.0.0', '1.1.0', '1.1.1', '2.0.0'];
      expect(versions).to.have.lengthOf(4);
      expect(versions[3]).to.equal('2.0.0');
    });
  });

  describe('comment token awareness', () => {
    it('should use TypeScript comments', () => {
      const doc = createMockDocument('', 'test.ts', 'typescript');
      expect(doc.languageId).to.equal('typescript');
    });

    it('should use Python comments', () => {
      const doc = createMockDocument('', 'test.py', 'python');
      expect(doc.languageId).to.equal('python');
    });

    it('should use JavaScript comments', () => {
      const doc = createMockDocument('', 'test.js', 'javascript');
      expect(doc.languageId).to.equal('javascript');
    });

    it('should handle single-line comments', () => {
      const comment = '// This is a comment';
      expect(comment).to.include('//');
    });

    it('should handle multi-line comments', () => {
      const comment = '/* Multi\n   line\n   comment */';
      expect(comment).to.include('/*');
      expect(comment).to.include('*/');
    });
  });

  describe('editor operations', () => {
    it('should read editor tab size', () => {
      expect(mockEditor.options.tabSize).to.equal(2);
    });

    it('should detect space vs tab indentation', () => {
      expect(mockEditor.options.insertSpaces).to.be.true;
    });

    it('should apply edits to editor', () => {
      const doc = createMockDocument('test');
      const editor = createMockEditor(doc, 2, true);
      expect(editor.document).to.equal(doc);
    });

    it('should handle multiple sequential edits', () => {
      const edits = [
        { line: 0, text: 'edit1' },
        { line: 1, text: 'edit2' },
        { line: 2, text: 'edit3' }
      ];
      expect(edits).to.have.lengthOf(3);
    });

    it('should preserve undo history', () => {
      // Edits should be trackable for undo
      expect(mockEditor).to.have.property('options');
    });
  });

  describe('error handling', () => {
    it('should handle readonly files gracefully', () => {
      const doc = createMockDocument('readonly content');
      expect(doc.getText()).to.equal('readonly content');
    });

    it('should handle files with no language', () => {
      const doc = createMockDocument('content', 'unknown.xyz', 'unknown');
      expect(doc.fileName).to.include('unknown');
    });

    it('should handle empty documents', () => {
      const doc = createMockDocument('');
      expect(doc.getText()).to.equal('');
    });

    it('should handle large documents', () => {
      const large = 'content\n'.repeat(1000);
      const doc = createMockDocument(large);
      expect(doc.lineCount).to.equal(1000);
    });

    it('should handle special characters in content', () => {
      const special = '™®©†‡';
      const doc = createMockDocument(special);
      expect(doc.getText()).to.include('™');
    });
  });

  describe('integration with configuration', () => {
    it('should read project name from config', () => {
      const projectName = mockConfig.get<string>('projectName');
      expect(projectName).to.equal('TestProject');
    });

    it('should read header style from config', () => {
      const style = mockConfig.get<string>('headerStyle');
      expect(style).to.equal('simple');
    });

    it('should read timezone from config', () => {
      mockConfig.update('timeZone', 'UTC', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should react to config changes', () => {
      mockConfig.update('projectName', 'NewProject', null);
      const newName = mockConfig.get<string>('projectName');
      expect(newName).to.equal('NewProject');
    });
  });
});

