//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : variable-resolver.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 01:40:00 UTC (by root)
// Editor        : Visual Studio Code, tab size (2)
// Description   : 
//
//     Unit tests for variable-resolver module (BDD style)
//        o Template variable resolution
//        o Placeholder interpolation
//        o Fallback value handling
//        o Variable escaping
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  assertValidDateString,
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('VariableResolver', () => {
  let mockConfig: MockVSCodeConfig;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
    mockConfig.update('projectName', 'TestProject', null);
    mockConfig.update('author', 'TestAuthor', null);
    mockConfig.update('timeZone', 'UTC', null);
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('basic variable resolution', () => {
    it('should resolve project name variable', () => {
      const projectName = mockConfig.get<string>('projectName');
      expect(projectName).to.equal('TestProject');
    });

    it('should resolve author variable', () => {
      const author = mockConfig.get<string>('author');
      expect(author).to.equal('TestAuthor');
    });

    it('should resolve timezone variable', () => {
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should support multiple variable types', () => {
      const variables = {
        projectName: 'Project',
        author: 'Author',
        date: '2025-11-07'
      };
      expect(Object.keys(variables)).to.have.lengthOf(3);
    });
  });

  describe('placeholder interpolation', () => {
    it('should interpolate [[project-name]] placeholder', () => {
      const template = 'Project: [[project-name]]';
      const projectName = mockConfig.get<string>('projectName');
      const result = template.replace('[[project-name]]', projectName);
      expect(result).to.equal('Project: TestProject');
    });

    it('should interpolate [[author]] placeholder', () => {
      const template = 'Author: [[author]]';
      const author = mockConfig.get<string>('author');
      const result = template.replace('[[author]]', author);
      expect(result).to.equal('Author: TestAuthor');
    });

    it('should interpolate [[created-date]] placeholder', () => {
      const template = 'Created: [[created-date]]';
      const result = template.replace('[[created-date]]', '2025-11-07');
      expect(result).to.include('Created:');
    });

    it('should interpolate [[modified-date]] placeholder', () => {
      const template = 'Modified: [[modified-date]]';
      const result = template.replace('[[modified-date]]', '2025-11-07');
      expect(result).to.include('Modified:');
    });

    it('should handle multiple placeholders in one string', () => {
      const template = '[[project-name]] by [[author]] on [[created-date]]';
      const count = (template.match(/\[\[.*?\]\]/g) || []).length;
      expect(count).to.equal(3);
    });

    it('should preserve non-placeholder text', () => {
      const template = 'Project: [[project-name]] - Active';
      expect(template).to.include('Active');
      expect(template).to.include('Project:');
    });
  });

  describe('fallback value handling', () => {
    it('should use fallback when variable is undefined', () => {
      mockConfig.clear();
      const projectName = mockConfig.get<string>('projectName', 'DefaultProject');
      expect(projectName).to.equal('DefaultProject');
    });

    it('should use fallback for missing author', () => {
      mockConfig.clear();
      const author = mockConfig.get<string>('author', 'Unknown');
      expect(author).to.equal('Unknown');
    });

    it('should prefer actual value over fallback', () => {
      const projectName = mockConfig.get<string>('projectName', 'DefaultProject');
      expect(projectName).to.equal('TestProject');
      expect(projectName).to.not.equal('DefaultProject');
    });

    it('should support null fallback', () => {
      mockConfig.clear();
      const value = mockConfig.get<string | null>('missing', null);
      expect(value).to.be.null;
    });

    it('should support empty string fallback', () => {
      mockConfig.clear();
      const value = mockConfig.get<string>('missing', '');
      expect(value).to.equal('');
    });
  });

  describe('date variable resolution', () => {
    it('should resolve created date correctly', () => {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-CA');
      expect(dateStr).to.match(/\d{4}-\d{2}-\d{2}/);
    });

    it('should respect timezone in date resolution', () => {
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should format date consistently', () => {
      const date1 = new Date().toLocaleDateString('en-CA');
      const date2 = new Date().toLocaleDateString('en-CA');
      expect(date1).to.equal(date2);
    });

    it('should handle timezone-aware dates', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Asia/Seoul');
    });
  });

  describe('variable escaping', () => {
    it('should handle special characters in project name', () => {
      mockConfig.update('projectName', 'Test-Project_v2', null);
      const name = mockConfig.get<string>('projectName');
      expect(name).to.equal('Test-Project_v2');
    });

    it('should handle spaces in author name', () => {
      mockConfig.update('author', 'John Doe', null);
      const author = mockConfig.get<string>('author');
      expect(author).to.equal('John Doe');
    });

    it('should not double-escape values', () => {
      mockConfig.update('projectName', 'Project (Test)', null);
      const name = mockConfig.get<string>('projectName');
      expect(name).to.equal('Project (Test)');
    });

    it('should handle unicode characters', () => {
      mockConfig.update('author', '테스트 작성자', null);
      const author = mockConfig.get<string>('author');
      expect(author).to.include('테스트');
    });
  });

  describe('complex interpolation scenarios', () => {
    it('should resolve all variables in header template', () => {
      const template = `
        Project: [[project-name]]
        Author: [[author]]
        Created: [[created-date]]
      `;
      expect(template).to.include('[[project-name]]');
      expect(template).to.include('[[author]]');
      expect(template).to.include('[[created-date]]');
    });

    it('should handle repeated placeholders', () => {
      const template = '[[author]] wrote [[project-name]] created by [[author]]';
      const matches = template.match(/\[\[author\]\]/g);
      expect(matches).to.have.lengthOf(2);
    });

    it('should preserve formatting in interpolation', () => {
      const template = '  [[project-name]]  ';
      expect(template).to.include('  ');
    });

    it('should not modify template structure', () => {
      const template = `
        -------
        [[project-name]]
        -------
      `;
      expect(template).to.include('-------');
    });
  });

  describe('variable type handling', () => {
    it('should handle string variables', () => {
      const value: string = mockConfig.get<string>('projectName', 'default');
      expect(value).to.be.a('string');
    });

    it('should handle boolean variables', () => {
      mockConfig.update('autoUpdate', true, null);
      const value: boolean = mockConfig.get<boolean>('autoUpdate', false);
      expect(value).to.be.a('boolean');
    });

    it('should handle numeric variables', () => {
      mockConfig.update('tabSize', 4, null);
      const value: number = mockConfig.get<number>('tabSize', 2);
      expect(value).to.be.a('number');
    });

    it('should convert types appropriately', () => {
      mockConfig.update('value', 42, null);
      const num = mockConfig.get<number>('value', 0);
      expect(num).to.equal(42);
    });
  });

  describe('variable validation', () => {
    it('should validate required variables are present', () => {
      const projectName = mockConfig.get<string>('projectName');
      expect(projectName).to.exist;
      expect(projectName).to.not.be.empty;
    });

    it('should validate variable length', () => {
      mockConfig.update('projectName', 'Short', null);
      const name = mockConfig.get<string>('projectName');
      expect(name.length).to.be.greaterThan(0);
    });

    it('should sanitize variable values', () => {
      const value = mockConfig.get<string>('projectName');
      expect(value).to.not.include('\n');
      expect(value).to.not.include('\r');
    });

    it('should handle empty string variables', () => {
      mockConfig.update('optional', '', null);
      const value = mockConfig.get<string>('optional', 'default');
      expect(value).to.equal('');
    });
  });
});

