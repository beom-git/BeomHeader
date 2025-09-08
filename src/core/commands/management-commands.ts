//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : management-commands.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:24:04 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module defines management commands
//        o Language mapping management
//        o Toggle settings management
//        o Extension state management
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as vscode from 'vscode';
import { TemplateManager } from '../templates/template-manager';
import { EXTENSION_SECTION } from '../../types/common.types';

/**
 * Management commands class
 */
export class ManagementCommands {

  /**
   * Register management commands
   */
  public register(context: vscode.ExtensionContext): void {
    const extensionPath = context.extensionPath;

    // Add Language Comment Token Mapping
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.addLanguageMapping', async () => {
        await this.addLanguageMapping();
      })
    );

    // Remove Language Comment Token Mapping
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.removeLanguageMapping', async () => {
        await this.removeLanguageMapping();
      })
    );

    // List All Language Comment Token Mappings
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.listLanguageMappings', async () => {
        await this.listLanguageMappings();
      })
    );

    // Toggle Auto Update Last Modified
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.toggleAutoUpdateLastModified', async () => {
        await this.toggleAutoUpdateLastModified();
      })
    );

    // Toggle Auto Update Editor Info
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.toggleAutoUpdateEditor', async () => {
        await this.toggleAutoUpdateEditor();
      })
    );

    // Toggle License Header
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.toggleLicenseHeader', async () => {
        await this.toggleLicenseHeader();
      })
    );

    // Toggle Auto Increment Version
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.toggleAutoIncrementVersion', async () => {
        await this.toggleAutoIncrementVersion();
      })
    );

    // Select Header Style
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.selectHeaderStyle', async () => {
        await this.selectHeaderStyle(extensionPath);
      })
    );
  }

  /**
   * Add language comment token mapping
   */
  private async addLanguageMapping(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    // Get language ID from user
    const languageId = await vscode.window.showInputBox({
      prompt: 'Enter the language ID (e.g., python, javascript, rust)',
      placeHolder: 'Language ID',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Language ID cannot be empty';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return 'Language ID should contain only letters, numbers, hyphens, and underscores';
        }
        return null;
      }
    });

    if (!languageId) return;

    // Get comment token from user
    const commentToken = await vscode.window.showInputBox({
      prompt: 'Enter the comment token for this language (e.g., //, #, --, /*)',
      placeHolder: 'Comment token',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Comment token cannot be empty';
        }
        return null;
      }
    });

    if (!commentToken) return;

    // Get current comment token map and add new mapping
    const currentMap = config.get<Record<string, string>>('commentTokenMap', {});
    const newMap = { ...currentMap, [languageId.trim()]: commentToken.trim() };

    // Update configuration
    await config.update('commentTokenMap', newMap, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Added mapping: ${languageId} → ${commentToken}`
    );
  }

  /**
   * Remove language comment token mapping
   */
  private async removeLanguageMapping(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentMap = config.get<Record<string, string>>('commentTokenMap', {});
    
    if (Object.keys(currentMap).length === 0) {
      vscode.window.showInformationMessage('No language mappings found.');
      return;
    }

    // Show list of current mappings for user to select
    const items = Object.entries(currentMap).map(([lang, token]) => ({
      label: lang,
      description: `→ ${token}`,
      detail: `Remove mapping for ${lang}`,
      languageId: lang
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a language mapping to remove'
    });

    if (!selected) return;

    // Remove the selected mapping
    const newMap = { ...currentMap };
    delete newMap[selected.languageId];

    // Update configuration
    await config.update('commentTokenMap', newMap, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Removed mapping: ${selected.languageId} → ${currentMap[selected.languageId]}`
    );
  }

  /**
   * List all language comment token mappings
   */
  private async listLanguageMappings(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentMap = config.get<Record<string, string>>('commentTokenMap', {});
    
    if (Object.keys(currentMap).length === 0) {
      vscode.window.showInformationMessage('No language mappings found.');
      return;
    }

    // Create a formatted list of mappings
    const mappings = Object.entries(currentMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([lang, token]) => `${lang.padEnd(20)} → ${token}`)
      .join('\n');

    // Show in a new document
    const doc = await vscode.workspace.openTextDocument({
      content: `Current Language Comment Token Mappings:\n\n${mappings}`,
      language: 'plaintext'
    });
    
    await vscode.window.showTextDocument(doc);
  }

  /**
   * Toggle auto update last modified
   */
  private async toggleAutoUpdateLastModified(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentValue = config.get<boolean>('beomHeader.autoUpdateLastModified', true);
    
    await config.update('autoUpdateLastModified', !currentValue, vscode.ConfigurationTarget.Global);
    
    const message = !currentValue 
      ? 'Auto-update Last Modified is now enabled'
      : 'Auto-update Last Modified is now disabled';
      
    vscode.window.showInformationMessage(message);
  }

  /**
   * Toggle auto update editor info
   */
  private async toggleAutoUpdateEditor(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentValue = config.get<boolean>('beomHeader.autoUpdateEditor', true);
    
    await config.update('autoUpdateEditor', !currentValue, vscode.ConfigurationTarget.Global);
    
    const message = !currentValue 
      ? 'Auto-update Editor info is now enabled'
      : 'Auto-update Editor info is now disabled';
      
    vscode.window.showInformationMessage(message);
  }

  /**
   * Toggle license header
   */
  private async toggleLicenseHeader(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentValue = config.get<boolean>('beomHeader.includeLicenseHeader', true);
    
    await config.update('beomHeader.includeLicenseHeader', !currentValue, vscode.ConfigurationTarget.Global);
    
    const message = !currentValue 
      ? 'License header will now be included in file headers'
      : 'License header will no longer be included in file headers';
      
    vscode.window.showInformationMessage(message);
  }

  /**
   * Toggle auto increment version
   */
  private async toggleAutoIncrementVersion(): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const currentValue = config.get<boolean>('beomHeader.autoIncrementVersion', true);
    
    await config.update('beomHeader.autoIncrementVersion', !currentValue, vscode.ConfigurationTarget.Global);
    
    const message = !currentValue 
      ? 'Auto increment version is now enabled'
      : 'Auto increment version is now disabled';
      
    vscode.window.showInformationMessage(message);
  }

  /**
   * Select header style
   */
  private async selectHeaderStyle(extensionPath: string): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const templateManager = TemplateManager.getInstance(extensionPath);
    const availableStyles = templateManager.getAvailableStyles();
    
    const styleOptions = availableStyles.map(style => ({
      label: style.charAt(0).toUpperCase() + style.slice(1),
      description: style,
      detail: `Use ${style} header template style`
    }));

    const selected = await vscode.window.showQuickPick(styleOptions, {
      placeHolder: 'Select header template style'
    });

    if (!selected) return;

    await config.update('headerStyle', selected.description, vscode.ConfigurationTarget.Global);
    
    vscode.window.showInformationMessage(
      `Header style updated to: ${selected.label}`
    );
  }
}
