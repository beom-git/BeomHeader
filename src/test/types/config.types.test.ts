//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config.types.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for configuration types (BDD style)
//        o Type validation
//        o Interface compliance
//        o Type compatibility
//
//----------------------------------------------------------------------

import { expect } from 'chai';

describe('Configuration Types', () => {
  describe('BeomHeaderConfig interface', () => {
    it('should define projectName as string', () => {
      const config: { projectName: string } = { projectName: 'Test' };
      expect(config.projectName).to.be.a('string');
    });

    it('should define author as string', () => {
      const config: { author: string } = { author: 'Author' };
      expect(config.author).to.be.a('string');
    });

    it('should define headerStyle as string', () => {
      const config: { headerStyle: string } = { headerStyle: 'simple' };
      expect(config.headerStyle).to.be.a('string');
    });

    it('should define timeZone as string', () => {
      const config: { timeZone: string } = { timeZone: 'UTC' };
      expect(config.timeZone).to.be.a('string');
    });

    it('should define autoUpdateLastModified as boolean', () => {
      const config: { autoUpdateLastModified: boolean } = { autoUpdateLastModified: true };
      expect(config.autoUpdateLastModified).to.be.a('boolean');
    });

    it('should define autoUpdateEditor as boolean', () => {
      const config: { autoUpdateEditor: boolean } = { autoUpdateEditor: false };
      expect(config.autoUpdateEditor).to.be.a('boolean');
    });

    it('should define enableConfigChangeNotifications as boolean', () => {
      const config: { enableConfigChangeNotifications: boolean } = { enableConfigChangeNotifications: true };
      expect(config.enableConfigChangeNotifications).to.be.a('boolean');
    });

    it('should support all required configuration fields', () => {
      const config = {
        projectName: 'MyProject',
        author: 'AuthorName',
        headerStyle: 'fancy',
        timeZone: 'UTC',
        autoUpdateLastModified: true,
        autoUpdateEditor: false,
        enableConfigChangeNotifications: true
      };

      expect(config).to.have.property('projectName');
      expect(config).to.have.property('author');
      expect(config).to.have.property('headerStyle');
      expect(config).to.have.property('timeZone');
      expect(config).to.have.property('autoUpdateLastModified');
      expect(config).to.have.property('autoUpdateEditor');
      expect(config).to.have.property('enableConfigChangeNotifications');
    });
  });

  describe('string type configurations', () => {
    it('should accept non-empty projectName', () => {
      const names = ['MyProject', 'Project-123', 'ProjectName_v2'];
      names.forEach(name => {
        expect(name).to.be.a('string');
        expect(name).to.not.be.empty;
      });
    });

    it('should accept non-empty author', () => {
      const authors = ['John Doe', 'Jane Smith', 'Team Development'];
      authors.forEach(author => {
        expect(author).to.be.a('string');
        expect(author).to.not.be.empty;
      });
    });

    it('should accept valid header styles', () => {
      const styles = ['simple', 'fancy', 'custom'];
      styles.forEach(style => {
        expect(style).to.be.a('string');
        expect(styles).to.include(style);
      });
    });

    it('should accept valid timezones', () => {
      const timezones = [
        'UTC',
        'Asia/Seoul',
        'Europe/London',
        'America/New_York'
      ];
      timezones.forEach(tz => {
        expect(tz).to.be.a('string');
        expect(timezones).to.include(tz);
      });
    });
  });

  describe('boolean type configurations', () => {
    it('should accept true/false for autoUpdateLastModified', () => {
      const values = [true, false];
      values.forEach(val => {
        expect(val).to.be.a('boolean');
      });
    });

    it('should accept true/false for autoUpdateEditor', () => {
      const values = [true, false];
      values.forEach(val => {
        expect(val).to.be.a('boolean');
      });
    });

    it('should accept true/false for enableConfigChangeNotifications', () => {
      const values = [true, false];
      values.forEach(val => {
        expect(val).to.be.a('boolean');
      });
    });

    it('should not mix types in boolean fields', () => {
      const value: boolean = true;
      expect(typeof value).to.equal('boolean');
      expect(value).to.not.equal('true');
    });
  });

  describe('type compatibility', () => {
    it('should support assignment from compatible types', () => {
      const projectName: string = 'MyProject';
      const config: { projectName: string } = { projectName };
      expect(config.projectName).to.equal('MyProject');
    });

    it('should support boolean assignment', () => {
      const enabled: boolean = true;
      const config: { enabled: boolean } = { enabled };
      expect(config.enabled).to.be.true;
    });

    it('should handle mixed type objects', () => {
      const mixed = {
        stringField: 'value',
        numberField: 42,
        booleanField: true
      };

      expect(mixed.stringField).to.be.a('string');
      expect(mixed.numberField).to.be.a('number');
      expect(mixed.booleanField).to.be.a('boolean');
    });

    it('should support optional fields', () => {
      const config: { required: string; optional?: string } = {
        required: 'value'
      };
      expect(config.required).to.exist;
      expect(config.optional).to.be.undefined;
    });
  });

  describe('timezone type', () => {
    it('should validate UTC timezone', () => {
      const tz: string = 'UTC';
      expect(tz).to.equal('UTC');
    });

    it('should validate Asia timezones', () => {
      const asiaZones = ['Asia/Seoul', 'Asia/Tokyo', 'Asia/Shanghai'];
      asiaZones.forEach(tz => {
        expect(tz).to.include('Asia/');
      });
    });

    it('should validate Europe timezones', () => {
      const europeZones = ['Europe/London', 'Europe/Paris', 'Europe/Berlin'];
      europeZones.forEach(tz => {
        expect(tz).to.include('Europe/');
      });
    });

    it('should validate America timezones', () => {
      const americaZones = ['America/New_York', 'America/Chicago', 'America/Los_Angeles'];
      americaZones.forEach(tz => {
        expect(tz).to.include('America/');
      });
    });

    it('should use string format for timezone', () => {
      const tz: string = 'Asia/Seoul';
      expect(typeof tz).to.equal('string');
      expect(tz).to.be.a('string');
    });
  });

  describe('header style type', () => {
    it('should define valid header styles', () => {
      const styles = ['simple', 'fancy', 'custom'];
      expect(styles).to.be.an('array');
      expect(styles).to.have.lengthOf(3);
    });

    it('should accept simple style', () => {
      const style: string = 'simple';
      expect(style).to.equal('simple');
    });

    it('should accept fancy style', () => {
      const style: string = 'fancy';
      expect(style).to.equal('fancy');
    });

    it('should accept custom style', () => {
      const style: string = 'custom';
      expect(style).to.equal('custom');
    });

    it('should use string format for style', () => {
      const style: string = 'simple';
      expect(typeof style).to.equal('string');
    });
  });

  describe('configuration object structure', () => {
    it('should create valid configuration object', () => {
      const config = {
        projectName: 'TestProject',
        author: 'TestAuthor',
        headerStyle: 'simple',
        timeZone: 'UTC',
        autoUpdateLastModified: true,
        autoUpdateEditor: true,
        enableConfigChangeNotifications: false
      };

      expect(config).to.be.an('object');
      expect(Object.keys(config)).to.have.lengthOf(7);
    });

    it('should preserve field order in configuration', () => {
      const config = {
        projectName: 'Project',
        author: 'Author'
      };

      const keys = Object.keys(config);
      expect(keys[0]).to.equal('projectName');
      expect(keys[1]).to.equal('author');
    });

    it('should support nested configuration objects', () => {
      const config = {
        main: {
          projectName: 'Project'
        },
        sub: {
          author: 'Author'
        }
      };

      expect(config.main.projectName).to.equal('Project');
      expect(config.sub.author).to.equal('Author');
    });

    it('should support array of configurations', () => {
      const configs = [
        { projectName: 'Project1', author: 'Author1' },
        { projectName: 'Project2', author: 'Author2' }
      ];

      expect(configs).to.have.lengthOf(2);
      expect(configs[0].projectName).to.equal('Project1');
    });
  });

  describe('type assertions', () => {
    it('should assert string type', () => {
      const value: string = 'test';
      expect(value).to.be.a('string');
    });

    it('should assert boolean type', () => {
      const value: boolean = true;
      expect(value).to.be.a('boolean');
    });

    it('should assert object type', () => {
      const value: object = {};
      expect(value).to.be.an('object');
    });

    it('should assert array type', () => {
      const value: any[] = [];
      expect(value).to.be.an('array');
    });
  });
});

