//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config-commands.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:53:23 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module provides configuration commands for the extension.
//        o Defines configuration commands for the extension.
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as vscode from 'vscode';
import { EXTENSION_SECTION } from '../../types/common.types';
import { getSupportedLanguageIds, getLanguageExtensions } from '../language/comment-token-map';

/**
 * Configuration commands class
 */
export class ConfigCommands {

  /**
   * Register configuration commands
   */
  public register(context: vscode.ExtensionContext): void {
    // Configure Author Information
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureAuthorInfo', async () => {
        await this.configureAuthorInfo();
      })
    );

    // Configure License
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureLicense', async () => {
        await this.configureLicense();
      })
    );

    // Configure Copyright Notice
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureCopyrightNotice', async () => {
        await this.configureCopyrightNotice();
      })
    );

    // Configure Version Format
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureVersionFormat', async () => {
        await this.configureVersionFormat();
      })
    );

    // Configure Header Style
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureHeaderStyle', async () => {
        await this.configureHeaderStyle();
      })
    );

    // Configure Project Description
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureProjectDescription', async () => {
        await this.configureProjectDescription();
      })
    );

    // Configure File Path Display
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureFilePath', async () => {
        await this.configureFilePath();
      })
    );

    // Configure Path Separator
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configurePathSeparator', async () => {
        await this.configurePathSeparator();
      })
    );

    // Configure License URL
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.configureLicenseUrl', async () => {
        await this.configureLicenseUrl();
      })
    );

    // Add Language Extension Mapping
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.addLanguageExtensionMapping', async () => {
        await this.addLanguageExtensionMapping();
      })
    );

    // Remove Language Extension Mapping
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.removeLanguageExtensionMapping', async () => {
        await this.removeLanguageExtensionMapping();
      })
    );

    // List Language Extension Mappings
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.listLanguageExtensionMappings', async () => {
        await this.listLanguageExtensionMappings();
      })
    );
  }

  /**
   * Configure author information
   */
  private async configureAuthorInfo(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const currentFullName = config.get<string>('beomHeader.authorFullName', '');
    const currentEmail = config.get<string>('beomHeader.authorEmail', '');
    const currentTitle = config.get<string>('beomHeader.authorTitle', '');
    const currentTeam = config.get<string>('beomHeader.teamName', '');

    // Full Name
    const fullName = await vscode.window.showInputBox({
      prompt: 'Enter your full name (leave empty to use system username)',
      placeHolder: 'John Doe',
      value: currentFullName
    });

    if (fullName !== undefined) {
      await config.update('authorFullName', fullName, vscode.ConfigurationTarget.Global);
    }

    // Email
    const email = await vscode.window.showInputBox({
      prompt: 'Enter your email address (optional)',
      placeHolder: 'john.doe@example.com',
      value: currentEmail,
      validateInput: (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    });

    if (email !== undefined) {
      await config.update('authorEmail', email, vscode.ConfigurationTarget.Global);
    }

    // Title/Role
    const title = await vscode.window.showInputBox({
      prompt: 'Enter your title or role (optional)',
      placeHolder: 'Senior Developer',
      value: currentTitle
    });

    if (title !== undefined) {
      await config.update('authorTitle', title, vscode.ConfigurationTarget.Global);
    }

    // Team Name
    const team = await vscode.window.showInputBox({
      prompt: 'Enter your team or department name (optional)',
      placeHolder: 'Development Team',
      value: currentTeam
    });

    if (team !== undefined) {
      await config.update('teamName', team, vscode.ConfigurationTarget.Global);
    }

    vscode.window.showInformationMessage('Author information updated successfully');
  }

  /**
   * Configure license
   */
  private async configureLicense(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const licenseOptions = [
      { label: 'All Rights Reserved', description: 'Proprietary/Closed source', detail: 'Default option' },
      { label: 'MIT', description: 'MIT License', detail: 'Permissive open source license' },
      { label: 'Apache-2.0', description: 'Apache License 2.0', detail: 'Permissive license with patent grant' },
      { label: 'GPL-3.0', description: 'GNU GPL v3.0', detail: 'Strong copyleft license' },
      { label: 'GPL-2.0', description: 'GNU GPL v2.0', detail: 'Strong copyleft license' },
      { label: 'LGPL-3.0', description: 'GNU LGPL v3.0', detail: 'Weak copyleft license' },
      { label: 'LGPL-2.1', description: 'GNU LGPL v2.1', detail: 'Weak copyleft license' },
      { label: 'BSD-3-Clause', description: 'BSD 3-Clause License', detail: 'Permissive license' },
      { label: 'BSD-2-Clause', description: 'BSD 2-Clause License', detail: 'Permissive license' },
      { label: 'ISC', description: 'ISC License', detail: 'Permissive license' },
      { label: 'MPL-2.0', description: 'Mozilla Public License 2.0', detail: 'Weak copyleft license' },
      { label: 'Unlicense', description: 'Unlicense', detail: 'Public domain dedication' },
      { label: 'Custom', description: 'Custom license text', detail: 'Define your own license text' }
    ];

    const selected = await vscode.window.showQuickPick(licenseOptions, {
      placeHolder: 'Select a license for your project'
    });

    if (!selected) return;

    // Update license type
    await config.update('licenseType', selected.label, vscode.ConfigurationTarget.Global);
    
    // If custom license is selected, ask for custom text
    if (selected.label === 'Custom') {
      const customText = await vscode.window.showInputBox({
        prompt: 'Enter your custom license text',
        placeHolder: 'Custom license text'
      });
      
      if (customText) {
        await config.update('customLicenseText', customText, vscode.ConfigurationTarget.Global);
      }
    }
    
    vscode.window.showInformationMessage(
      `License updated to: ${selected.label}`
    );
  }

  /**
   * Configure copyright notice
   */
  private async configureCopyrightNotice(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const templates = [
      {
        label: '(C) Copyright ${startYear}-${endYear} ${companyName}',
        description: 'Standard copyright format',
        detail: 'Default format with year range'
      },
      {
        label: 'Copyright ${endYear} ${companyName}',
        description: 'Simple copyright format',
        detail: 'Current year only'
      },
      {
        label: 'Copyright (c) ${startYear}-${endYear} ${author}',
        description: 'Author-based copyright',
        detail: 'Uses author instead of company name'
      },
      {
        label: '© ${endYear} ${companyName}. All rights reserved.',
        description: 'Copyright symbol format',
        detail: 'Modern format with symbol'
      },
      {
        label: 'Custom',
        description: 'Custom copyright notice',
        detail: 'Define your own format'
      }
    ];

    const selected = await vscode.window.showQuickPick(templates, {
      placeHolder: 'Select a copyright notice format'
    });

    if (!selected) return;

    let copyrightTemplate = selected.label;
    
    if (selected.label === 'Custom') {
      const customTemplate = await vscode.window.showInputBox({
        prompt: 'Enter your custom copyright notice template',
        placeHolder: '(C) Copyright ${startYear}-${endYear} ${companyName}',
        value: config.get<string>('beomHeader.copyrightNotice', ''),
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Copyright notice cannot be empty';
          }
          return null;
        }
      });
      
      if (!customTemplate) return;
      copyrightTemplate = customTemplate;
    }

    await config.update('copyrightNotice', copyrightTemplate, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Copyright notice updated to: ${copyrightTemplate}`
    );
  }

  /**
   * Configure version format
   */
  private async configureVersionFormat(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const formatOptions = [
      { label: 'v01p00', description: 'v{major:02d}p{patch:02d}', detail: 'Default format with zero padding' },
      { label: 'v1.0.0', description: 'v{major}.{minor}.{patch}', detail: 'Semantic versioning with v prefix' },
      { label: '1.0.0', description: '{major}.{minor}.{patch}', detail: 'Standard semantic versioning' },
      { label: 'v1.0', description: 'v{major}.{patch}', detail: 'Simple version with v prefix' },
      { label: '1.0', description: '{major}.{patch}', detail: 'Simple version without prefix' },
      { label: 'Custom', description: 'custom', detail: 'Define your own format' }
    ];

    const selected = await vscode.window.showQuickPick(formatOptions, {
      placeHolder: 'Select version number format'
    });

    if (!selected) return;

    await config.update('versionFormat', selected.description, vscode.ConfigurationTarget.Global);
    
    if (selected.label === 'Custom') {
      const customFormat = await vscode.window.showInputBox({
        prompt: 'Enter custom version format (use {major}, {patch}, {minor}, {major:02d}, etc.)',
        placeHolder: 'v{major:02d}p{patch:02d}',
        value: config.get<string>('beomHeader.customVersionFormat', '')
      });
      
      if (customFormat) {
        await config.update('customVersionFormat', customFormat, vscode.ConfigurationTarget.Global);
      }
    }
    
    vscode.window.showInformationMessage(`Version format updated to: ${selected.label}`);
  }

  /**
   * Configure header style
   */
  private async configureHeaderStyle(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const separatorChars = [
      { label: 'Dashes (-)', description: 'Standard dashes', value: '-' },
      { label: 'Equals (=)', description: 'Equal signs', value: '=' },
      { label: 'Asterisks (*)', description: 'Star characters', value: '*' },
      { label: 'Hash (#)', description: 'Hash characters', value: '#' },
      { label: 'Tildes (~)', description: 'Tilde characters', value: '~' },
      { label: 'Plus (+)', description: 'Plus signs', value: '+' },
      { label: 'Underscores (_)', description: 'Underscore characters', value: '_' }
    ];

    // Select separator character
    const selectedChar = await vscode.window.showQuickPick(separatorChars, {
      placeHolder: 'Select separator character for header lines'
    });

    if (!selectedChar) return;

    await config.update('separatorChar', selectedChar.value, vscode.ConfigurationTarget.Global);

    // Configure separator length
    const lengthInput = await vscode.window.showInputBox({
      prompt: 'Enter separator line length (10-200)',
      placeHolder: '70',
      value: config.get<number>('beomHeader.separatorLength', 70).toString(),
      validateInput: (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 10 || num > 200) {
          return 'Please enter a number between 10 and 200';
        }
        return null;
      }
    });

    if (lengthInput) {
      await config.update('separatorLength', parseInt(lengthInput), vscode.ConfigurationTarget.Global);
    }

    vscode.window.showInformationMessage(
      `Header style updated: ${selectedChar.label}, length ${lengthInput || 70}`
    );
  }

  /**
   * Configure project description
   */
  private async configureProjectDescription(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const descriptionTemplates = [
      {
        label: 'Core functionality',
        description: 'This module provides core functionality for the ${projectName} application',
        detail: 'Standard description for core modules'
      },
      {
        label: 'Utility functions',
        description: 'This module contains utility functions and helper methods for ${projectName}',
        detail: 'Good for utility/helper modules'
      },
      {
        label: 'API interface',
        description: 'This module defines the API interface and endpoints for ${projectName}',
        detail: 'For API-related files'
      },
      {
        label: 'Configuration module',
        description: 'This module handles configuration management for ${projectName}',
        detail: 'For configuration files'
      },
      {
        label: 'Data model',
        description: 'This module defines data models and structures for ${projectName}',
        detail: 'For model/schema files'
      },
      {
        label: 'Business logic',
        description: 'This module implements business logic and core algorithms for ${projectName}',
        detail: 'For service/business logic files'
      },
      {
        label: 'User interface',
        description: 'This module handles user interface components and interactions for ${projectName}',
        detail: 'For UI/frontend files'
      },
      {
        label: 'Custom',
        description: 'custom',
        detail: 'Define your own project description'
      }
    ];

    const selected = await vscode.window.showQuickPick(descriptionTemplates, {
      placeHolder: 'Select a project description template'
    });

    if (!selected) return;

    let projectDescription = selected.description;
    
    if (selected.label === 'Custom') {
      const customDescription = await vscode.window.showInputBox({
        prompt: 'Enter your custom project description template',
        placeHolder: 'This module provides core functionality for the ${projectName} application',
        value: config.get<string>('beomHeader.projectDescription', ''),
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Project description cannot be empty';
          }
          return null;
        }
      });
      
      if (!customDescription) return;
      projectDescription = customDescription;
    }

    await config.update('projectDescription', projectDescription, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Project description updated to: ${selected.label}`
    );
  }

  /**
   * Configure file path display
   */
  private async configureFilePath(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const options = [
      {
        label: 'Filename only',
        description: 'Show only the filename (e.g., "extension.ts")',
        detail: 'Default option',
        value: { showFullPath: false, showRelativePath: false }
      },
      {
        label: 'Relative path',
        description: 'Show path relative to workspace root (e.g., "src/extension.ts")',
        detail: 'Recommended for project files',
        value: { showFullPath: false, showRelativePath: true }
      },
      {
        label: 'Full path',
        description: 'Show complete absolute path (e.g., "/home/user/project/src/extension.ts")',
        detail: 'Useful for debugging',
        value: { showFullPath: true, showRelativePath: false }
      }
    ];

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select how file paths should be displayed in headers'
    });

    if (!selected) return;

    // Update configuration
    await config.update('showFullPath', selected.value.showFullPath, vscode.ConfigurationTarget.Global);
    await config.update('showRelativePath', selected.value.showRelativePath, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `File path display updated to: ${selected.label}`
    );
  }

  /**
   * Configure path separator
   */
  private async configurePathSeparator(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const options = [
      {
        label: 'Forward slash (/)',
        description: 'Unix/Linux style path separator',
        detail: 'Recommended for cross-platform compatibility',
        value: '/'
      },
      {
        label: 'Backslash (\\)',
        description: 'Windows style path separator',
        detail: 'Use only if specifically needed',
        value: '\\'
      },
      {
        label: 'System default',
        description: `Use system default (${require('path').sep})`,
        detail: 'Adapts to the current operating system',
        value: require('path').sep
      }
    ];

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select path separator for file paths in headers'
    });

    if (!selected) return;

    // Update configuration
    await config.update('pathSeparator', selected.value, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Path separator updated to: ${selected.label}`
    );
  }

  /**
   * Configure license URL
   */
  private async configureLicenseUrl(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    const licenseUrl = await vscode.window.showInputBox({
      prompt: 'Enter the URL to your license text (optional)',
      placeHolder: 'https://example.com/LICENSE',
      value: config.get<string>('beomHeader.licenseUrl', ''),
      validateInput: (value) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid HTTP or HTTPS URL';
        }
        return null;
      }
    });

    if (licenseUrl !== undefined) {
      await config.update('licenseUrl', licenseUrl, vscode.ConfigurationTarget.Global);
      
      const message = licenseUrl 
        ? `License URL updated to: ${licenseUrl}`
        : 'License URL cleared';
        
      vscode.window.showInformationMessage(message);
    }
  }

  /**
   * Add language extension mapping
   */
  private async addLanguageExtensionMapping(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    // Get language ID
    const languageId = await vscode.window.showInputBox({
      prompt: 'Enter the language ID',
      placeHolder: 'typescript, javascript, python, etc.',
      validateInput: (value) => {
        if (!value?.trim()) {
          return 'Language ID cannot be empty';
        }
        return null;
      }
    });

    if (!languageId) return;

    // Check if this language has default mappings
    const defaultMappings = config.inspect<Record<string, string[]>>('beomHeader.languageExtensions')?.defaultValue || {};
    const defaultExtensions = defaultMappings[languageId.toLowerCase()];
    
    let promptText = 'Enter file extensions (comma-separated)';
    let placeholderText = '.ts, .tsx, .mts';
    
    if (defaultExtensions) {
      promptText = `Enter file extensions to override default (current: ${defaultExtensions.join(', ')})`;
      placeholderText = defaultExtensions.join(', ');
    }

    // Get file extensions
    const extensionsInput = await vscode.window.showInputBox({
      prompt: promptText,
      placeHolder: placeholderText,
      value: defaultExtensions ? defaultExtensions.join(', ') : '',
      validateInput: (value) => {
        if (!value?.trim()) {
          return 'Extensions cannot be empty';
        }
        const extensions = value.split(',').map(ext => ext.trim());
        for (const ext of extensions) {
          if (!ext.startsWith('.') && !ext.includes('Makefile') && !ext.includes('Dockerfile')) {
            return 'Extensions must start with a dot (e.g., .ts, .js) or be special files (Makefile, Dockerfile)';
          }
        }
        return null;
      }
    });

    if (!extensionsInput) return;

    // Parse extensions
    const extensions = extensionsInput.split(',').map(ext => ext.trim());
    
    // Get current mappings
    const currentMappings = config.get<Record<string, string[]>>('beomHeader.languageExtensions', {});
    
    // Add new mapping
    currentMappings[languageId.toLowerCase()] = extensions;
    
    // Update configuration
    await config.update('beomHeader.languageExtensions', currentMappings, vscode.ConfigurationTarget.Global);
    
    const isOverride = defaultExtensions ? ' (overriding default)' : '';
    vscode.window.showInformationMessage(
      `Language extension mapping ${defaultExtensions ? 'updated' : 'added'}: ${languageId} → ${extensions.join(', ')}${isOverride}`
    );
  }

  /**
   * Remove language extension mapping
   */
  private async removeLanguageExtensionMapping(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentMappings = config.get<Record<string, string[]>>('beomHeader.languageExtensions', {});
    const defaultMappings = config.inspect<Record<string, string[]>>('beomHeader.languageExtensions')?.defaultValue || {};
    
    if (Object.keys(currentMappings).length === 0) {
      vscode.window.showInformationMessage('No custom language extension mappings found.');
      return;
    }

    // Create options for quick pick - only show languages that are actually customized
    const options = Object.entries(currentMappings)
      .filter(([languageId]) => {
        // Show if it's completely custom or overrides a default
        return !defaultMappings[languageId] || 
               JSON.stringify(currentMappings[languageId]) !== JSON.stringify(defaultMappings[languageId]);
      })
      .map(([languageId, extensions]) => {
        const defaultExt = defaultMappings[languageId];
        const isCustom = !defaultExt;
        const description = isCustom 
          ? `${extensions.join(', ')} (custom language)`
          : `${extensions.join(', ')} (will restore to: ${defaultExt.join(', ')})`;
        
        return {
          label: languageId,
          description,
          detail: isCustom ? `Remove custom language mapping` : `Restore default mapping`,
          value: languageId,
          isCustom
        };
      });

    if (options.length === 0) {
      vscode.window.showInformationMessage('No custom or overridden language extension mappings found.');
      return;
    }

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select language mapping to remove/restore'
    });

    if (!selected) return;

    // Remove the mapping
    delete currentMappings[selected.value];
    
    // Update configuration
    await config.update('beomHeader.languageExtensions', currentMappings, vscode.ConfigurationTarget.Global);
    
    const defaultExt = defaultMappings[selected.value];
    const message = defaultExt
      ? `Language extension mapping restored to default: ${selected.label} → ${defaultExt.join(', ')}`
      : `Custom language extension mapping removed: ${selected.label}`;
    
    vscode.window.showInformationMessage(message);
  }

  /**
   * List language extension mappings
   */
  private async listLanguageExtensionMappings(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    // Get default mappings from configuration default
    const defaultMappings = config.inspect<Record<string, string[]>>('beomHeader.languageExtensions')?.defaultValue || {};
    
    // Get user custom mappings (those that differ from defaults)
    const currentMappings = config.get<Record<string, string[]>>('beomHeader.languageExtensions', {});
    
    // Separate custom mappings (new languages or overridden defaults)
    const customMappings: Record<string, string[]> = {};
    const overriddenDefaults: Record<string, string[]> = {};
    
    for (const [languageId, extensions] of Object.entries(currentMappings)) {
      if (!defaultMappings[languageId]) {
        // This is a completely new language
        customMappings[languageId] = extensions;
      } else if (JSON.stringify(extensions) !== JSON.stringify(defaultMappings[languageId])) {
        // This overrides a default mapping
        overriddenDefaults[languageId] = extensions;
      }
    }
    
    // Create display content
    let content = '# Language Extension Mappings\n\n';
    
    content += '## Default Mappings\n';
    content += '*These are the built-in language extension mappings:*\n\n';
    
    for (const [languageId, extensions] of Object.entries(defaultMappings).sort()) {
      const isOverridden = overriddenDefaults[languageId];
      const prefix = isOverridden ? '~~' : '';
      const suffix = isOverridden ? '~~ *(overridden)*' : '';
      content += `- **${prefix}${languageId}${suffix}**: ${extensions.join(', ')}\n`;
    }
    
    if (Object.keys(overriddenDefaults).length > 0) {
      content += '\n## Overridden Default Mappings\n';
      content += '*These default mappings have been customized:*\n\n';
      for (const [languageId, extensions] of Object.entries(overriddenDefaults).sort()) {
        const defaultExt = defaultMappings[languageId] || [];
        content += `- **${languageId}**: ${extensions.join(', ')} *(was: ${defaultExt.join(', ')})*\n`;
      }
    }
    
    if (Object.keys(customMappings).length > 0) {
      content += '\n## Custom Language Mappings\n';
      content += '*These are completely new language mappings:*\n\n';
      for (const [languageId, extensions] of Object.entries(customMappings).sort()) {
        content += `- **${languageId}**: ${extensions.join(', ')}\n`;
      }
    }
    
    content += '\n## Usage\n';
    content += '- Use "Add Language Extension Mapping" to add new mappings or override defaults\n';
    content += '- Use "Remove Language Extension Mapping" to remove custom mappings (restores defaults)\n';
    content += '- Custom mappings override default mappings for the same language ID\n';
    content += '- Default mappings are built into the extension and cannot be permanently removed\n';

    // Show in a new document
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'markdown'
    });
    
    await vscode.window.showTextDocument(doc);
  }
}
