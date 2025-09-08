//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : template-manager.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Last Updated : 2025-09-08 04:28:04 (by root)
// Editor       : Visual Studio Code, tab size (4)
// Description   : 
//
//     This file manages template loading and selection for the BeomHeader extension.
//        o Loads templates from JSON files in the assets/templates directory
//        o Provides template selection based on user configuration
//        o Handles fallback to default templates
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HeaderBodyTemplate, VersionEntryTemplate, TodoEntryTemplate } from '../../types/template.types';
import { HeaderStyle } from '../../types/config.types';

/**
 * Template manager for handling header, version, and todo templates
 */
export class TemplateManager {
  private static instance: TemplateManager;
  private headerTemplates: HeaderBodyTemplate = { standard: [], minimal: [], detailed: [] };
  private versionTemplates: VersionEntryTemplate = { standard: '', minimal: '', detailed: '' };
  private todoTemplates: TodoEntryTemplate = { standard: '', minimal: '', detailed: '' };
  private extensionPath: string;

  private constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
    this.loadTemplates();
  }

  public static getInstance(extensionPath?: string): TemplateManager {
    if (!TemplateManager.instance) {
      if (!extensionPath) {
        throw new Error('Extension path is required for first initialization');
      }
      TemplateManager.instance = new TemplateManager(extensionPath);
    }
    return TemplateManager.instance;
  }

  /**
   * Load all templates from JSON files
   */
  private loadTemplates(): void {
    try {
      // Try multiple possible paths for templates
      let templatesDir: string;
      
      // Development environment path
      const devPath = path.join(this.extensionPath, 'src', 'assets', 'templates');
      // Production environment path (compiled)
      const prodPath = path.join(this.extensionPath, 'out', 'src', 'assets', 'templates');
      // Alternative production path
      const altProdPath = path.join(this.extensionPath, 'assets', 'templates');
      
      if (fs.existsSync(devPath)) {
        templatesDir = devPath;
        console.log('📁 Loading templates from development path:', templatesDir);
      } else if (fs.existsSync(prodPath)) {
        templatesDir = prodPath;
        console.log('📁 Loading templates from production path:', templatesDir);
      } else if (fs.existsSync(altProdPath)) {
        templatesDir = altProdPath;
        console.log('📁 Loading templates from alternative path:', templatesDir);
      } else {
        console.error('❌ No templates directory found. Checked paths:');
        console.error('  - Dev path:', devPath);
        console.error('  - Prod path:', prodPath);
        console.error('  - Alt path:', altProdPath);
        this.setDefaultTemplates();
        return;
      }
      
      // Load header body templates
      this.loadHeaderBodyTemplates(templatesDir);
      
      // Load version entry templates
      this.loadVersionEntryTemplates(templatesDir);
      
      // Load todo entry templates
      this.loadTodoEntryTemplates(templatesDir);
      
      console.log('✅ Templates loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load templates:', error);
      this.setDefaultTemplates();
    }
  }

  /**
   * Load header body templates from JSON file
   */
  private loadHeaderBodyTemplates(templatesDir: string): void {
    const headerFile = path.join(templatesDir, 'headerBodyTemplate.json');
    console.log('📄 Loading header body templates from:', headerFile);
    if (fs.existsSync(headerFile)) {
      const headerContent = fs.readFileSync(headerFile, 'utf8');
      this.headerTemplates = JSON.parse(headerContent);
      console.log('✅ Header body templates loaded. Available styles:', Object.keys(this.headerTemplates));
    } else {
      console.error('❌ Header body template file not found:', headerFile);
    }
  }

  /**
   * Load version entry templates from JSON file
   */
  private loadVersionEntryTemplates(templatesDir: string): void {
    const versionFile = path.join(templatesDir, 'versionEntryTemplate.json');
    if (fs.existsSync(versionFile)) {
      const versionContent = fs.readFileSync(versionFile, 'utf8');
      this.versionTemplates = JSON.parse(versionContent);
    }
  }

  /**
   * Load todo entry templates from JSON file
   */
  private loadTodoEntryTemplates(templatesDir: string): void {
    const todoFile = path.join(templatesDir, 'todoEntryTemplate.json');
    if (fs.existsSync(todoFile)) {
      const todoContent = fs.readFileSync(todoFile, 'utf8');
      this.todoTemplates = JSON.parse(todoContent);
    }
  }

  /**
   * Set fallback default templates
   */
  private setDefaultTemplates(): void {
    this.headerTemplates = {
      standard: [
        "${comment}----------------------------------------------------------------------",
        "${comment} ${copyrightNotice}",
        "${comment}",
        "${comment} ${licenseText}",
        "${comment}",
        "${comment} Project Name  : ${projectName}",
        "${comment} File Name     : ${fileName}",
        "${comment} Author        : ${author}",
        "${comment} First Created : ${today}",
        "${comment} Last Updated  : ${lastModifiedDate} (by ${lastModifiedUser})",
        "${comment} Editor        : ${editorInfo}",
        "${comment} Description   : ",
        "${comment}",
        "${comment}     ${projectDescription}",
        "${comment}        o ",
        "${comment}",
        "${comment}----------------------------------------------------------------------",
        "${comment} File History :",
        "${comment}      * ${today} : (v01p00,  ${author}) First Release by '${author}'",
        "${comment} To-Do List   :",
        "${comment}      * ${today} : (ToDo#00, ${author}) None",
        "${comment}----------------------------------------------------------------------"
      ],
      minimal: [
        "${comment}----------------------------------------------------------------------",
        "${comment} ${copyrightNotice}",
        "${comment} ${licenseText}",
        "${comment}",
        "${comment} File        : ${fileName}",
        "${comment} Author      : ${author}",
        "${comment} Created     : ${today}",
        "${comment} Updated     : ${lastModifiedDate} (by ${lastModifiedUser})",
        "${comment} Editor      : ${editorInfo}",
        "${comment} Description : ${projectDescription}",
        "${comment}----------------------------------------------------------------------"
      ],
      detailed: [
        "${comment}----------------------------------------------------------------------",
        "${comment} ${copyrightNotice}",
        "${comment}",
        "${comment} ${licenseText}",
        "${comment}",
        "${comment} Project Name  : ${projectName}",
        "${comment} File Name     : ${fileName}",
        "${comment} Full Path     : ${fullPath}",
        "${comment} Author        : ${authorName}",
        "${comment} Team          : ${teamName}",
        "${comment} First Created : ${today}",
        "${comment} Last Updated  : ${lastModifiedDate} (by ${lastModifiedUser})",
        "${comment} Editor        : ${editorInfo}",
        "${comment} Description   : ",
        "${comment}",
        "${comment}     ${projectDescription}",
        "${comment}",
        "${comment}     Purpose:",
        "${comment}        o ",
        "${comment}",
        "${comment}     Dependencies:",
        "${comment}        o ",
        "${comment}",
        "${comment}     Notes:",
        "${comment}        o ",
        "${comment}",
        "${comment}----------------------------------------------------------------------",
        "${comment} File History :",
        "${comment}      * ${today} : (v01p00,  ${author}) First Release by '${author}'",
        "${comment} To-Do List   :",
        "${comment}      * ${today} : (ToDo#00, ${author}) None",
        "${comment}----------------------------------------------------------------------"
      ]
    };

    this.versionTemplates = {
      standard: "${comment}      * ${today} : (${version},  ${author}) Description\n",
      minimal: "${comment}      * ${today} : (${version},  ${author}) Description\n",
      detailed: "${comment}      * ${today} : (${version},  ${author}) Description\n"
    };

    this.todoTemplates = {
      standard: "${comment}      * ${today} : (ToDo#${index}, ${author}) Description\n",
      minimal: "${comment}      * ${today} : (ToDo#${index}, ${author}) Description\n",
      detailed: "${comment}      * ${today} : (ToDo#${index}, ${author}) Description\n"
    };
  }

  /**
   * Get header body template based on user configuration
   */
  public getHeaderBodyTemplate(config: vscode.WorkspaceConfiguration): string[] {
    const headerStyle = config.get<HeaderStyle>('headerStyle', 'standard');
    console.log('📋 getHeaderBodyTemplate: Requested style:', headerStyle);
    console.log('📋 Available template styles:', Object.keys(this.headerTemplates));
    
    const template = this.headerTemplates[headerStyle] || this.headerTemplates.standard || [];
    console.log('📋 Selected template lines count:', template.length);
    
    if (template.length === 0) {
      console.error('❌ No template found for style:', headerStyle);
      console.error('❌ Available templates:', this.headerTemplates);
    }
    
    return template;
  }

  /**
   * Get version entry template based on user configuration
   */
  public getVersionEntryTemplate(config: vscode.WorkspaceConfiguration): string {
    const headerStyle = config.get<HeaderStyle>('headerStyle', 'standard');
    return this.versionTemplates[headerStyle] || this.versionTemplates.standard || "";
  }

  /**
   * Get todo entry template based on user configuration
   */
  public getTodoEntryTemplate(config: vscode.WorkspaceConfiguration): string {
    const headerStyle = config.get<HeaderStyle>('headerStyle', 'standard');
    return this.todoTemplates[headerStyle] || this.todoTemplates.standard || "";
  }

  /**
   * Get available template styles
   */
  public getAvailableStyles(): HeaderStyle[] {
    return ['standard', 'minimal', 'detailed'];
  }

  /**
   * Reload templates from files
   */
  public reloadTemplates(): void {
    this.loadTemplates();
  }
}
