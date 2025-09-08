//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : header-commands.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file contains commands for header insertion functionality.
//        o Insert file headers
//        o Insert version entries
//        o Insert todo entries
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';
import * as os from 'os';
import { TemplateManager } from '../templates/template-manager';
import { VariableResolver } from '../templates/variable-resolver';
import { getCommentToken } from '../language/comment-token-map';
import { padNumber, interpolateTemplate } from '../../utils/string-utils';
import { EXTENSION_SECTION } from '../../types/common.types';

/**
 * Header insertion command class
 */
export class HeaderCommands {
  constructor(private extensionPath: string) {}

  /**
   * Register header-related commands
   */
  public register(context: vscode.ExtensionContext): void {
    // Insert File Header
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.insert', async () => {
        await this.insertFileHeader();
      })
    );

    // Insert Version Entry
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.insertVersion', async () => {
        await this.insertVersionEntry();
      })
    );

    // Insert To-Do Entry
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.insertTodo', async () => {
        await this.insertTodoEntry();
      })
    );
  }

  /**
   * Insert file header command
   */
  private async insertFileHeader(): Promise<void> {
    try {
      console.log('insertFileHeader: Starting...');
      
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        console.log('insertFileHeader: No active editor');
        vscode.window.showErrorMessage('No active editor found');
        return;
      }

      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
      const commentToken = getCommentToken(`.${doc.languageId}`);
      const comment = commentToken.single || '//';

      console.log('insertFileHeader: Language:', doc.languageId, 'Comment:', comment);

      // Prevent duplicate insertion
      const snippet = doc.getText(new vscode.Range(0, 0, 20, 0));
      const separatorLine = `${comment}-----------------------------------------------------`;
      if (snippet.includes(separatorLine)) {
        vscode.window.showInformationMessage('Header already exists. Skipping insertion.');
        return;
      }

      console.log('insertFileHeader: Getting template manager...');
      
      // Generate header
      const templateManager = TemplateManager.getInstance(this.extensionPath);
      const variableResolver = new VariableResolver();
      const variables = variableResolver.resolveVariables(doc, config, this.extensionPath);
      
      console.log('insertFileHeader: Variables resolved:', Object.keys(variables));
      
      const headerTemplateLines = templateManager.getHeaderBodyTemplate(config);
      
      console.log('insertFileHeader: Template lines count:', headerTemplateLines.length);
      
      const header = headerTemplateLines.map(line => 
        variableResolver.interpolateTemplate(line, variables)
      ).join('\n');

      console.log('insertFileHeader: Generated header preview:', header.substring(0, 100) + '...');

      await editor.edit(e => e.insert(new vscode.Position(0, 0), header));
      
      console.log('insertFileHeader: Header inserted successfully');
      vscode.window.showInformationMessage('File header inserted successfully!');
      
    } catch (error) {
      console.error('insertFileHeader: Error occurred:', error);
      vscode.window.showErrorMessage(`Failed to insert header: ${error}`);
    }
  }

  /**
   * Insert version entry command
   */
  private async insertVersionEntry(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const commentToken = getCommentToken(`.${doc.languageId}`);
    const comment = commentToken.single || '//';
    const author = os.userInfo().username;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

    // Locate File History section
    const lines = doc.getText().split(/\r?\n/);
    const headerLine = `${comment} File History :`;
    let idx = lines.findIndex(l => l.trim() === headerLine.trim());
    if (idx < 0) {
      vscode.window.showInformationMessage('File History section not found. Inserting at top.');
      idx = 0;
    } else {
      idx++;
      while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
        idx++;
      }
    }

    // Determine next version numbers
    let maxMajor = 1, maxPatch = -1, maxMinor = 0;
    const versionRegex = /\(v?(\d+)(?:\.(\d+))?(?:[\.p](\d+))?,/;
    
    for (let i = idx; i < lines.length; i++) {
      const m = lines[i].match(versionRegex);
      if (m) {
        const maj = parseInt(m[1]) || 1;
        const min = parseInt(m[2]) || 0;
        const pat = parseInt(m[3]) || 0;
        
        if (maj > maxMajor || (maj === maxMajor && min > maxMinor) || 
            (maj === maxMajor && min === maxMinor && pat > maxPatch)) {
          maxMajor = maj;
          maxMinor = min;
          maxPatch = pat;
        }
      } else break;
    }

    // Format version using user configuration
    const nextVersion = this.formatVersion(maxMajor, maxPatch + 1, maxMinor, config);
    
    // Get template from TemplateManager
    const templateManager = TemplateManager.getInstance(this.extensionPath);
    const tmpl = templateManager.getVersionEntryTemplate(config);
    const versionLine = interpolateTemplate(tmpl, {
      comment,
      today,
      author,
      major: padNumber(maxMajor, 2),
      patch: padNumber(maxPatch + 1, 2),
      minor: padNumber(maxMinor, 2),
      version: nextVersion
    });

    await editor.edit(e => e.insert(new vscode.Position(idx, 0), versionLine));
  }

  /**
   * Insert todo entry command
   */
  private async insertTodoEntry(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const commentToken = getCommentToken(`.${doc.languageId}`);
    const comment = commentToken.single || '//';
    const author = os.userInfo().username;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

    // Locate To-Do List section
    const lines = doc.getText().split(/\r?\n/);
    const todoHeader = `${comment} To-Do List   :`;
    let idx = lines.findIndex(l => l.trim() === todoHeader.trim());
    let maxIdx = -1;
    if (idx >= 0) {
      idx++;
      while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
        const m = lines[idx].match(/\(ToDo#(\d+),/);
        if (m) maxIdx = Math.max(maxIdx, +m[1]);
        idx++;
      }
    } else {
      idx = 0;
    }

    // Get template from TemplateManager
    const templateManager = TemplateManager.getInstance(this.extensionPath);
    const tmpl = templateManager.getTodoEntryTemplate(config);
    const todoLine = interpolateTemplate(tmpl, {
      comment,
      today,
      author,
      index: padNumber(maxIdx + 1, 2)
    });

    await editor.edit(e => e.insert(new vscode.Position(idx, 0), todoLine));
  }

  /**
   * Format version number based on user configuration
   */
  private formatVersion(major: number, patch: number, minor: number, config: vscode.WorkspaceConfiguration): string {
    const versionFormat = config.get<string>('versionFormat', 'v{major:02d}p{patch:02d}');
    const customFormat = config.get<string>('customVersionFormat', 'v{major:02d}p{patch:02d}');
    
    const format = versionFormat === 'custom' ? customFormat : versionFormat;
    
    return format
      .replace(/\{major:02d\}/g, major.toString().padStart(2, '0'))
      .replace(/\{major\}/g, major.toString())
      .replace(/\{patch:02d\}/g, patch.toString().padStart(2, '0'))
      .replace(/\{patch\}/g, patch.toString())
      .replace(/\{minor:02d\}/g, minor.toString().padStart(2, '0'))
      .replace(/\{minor\}/g, minor.toString());
  }
}
