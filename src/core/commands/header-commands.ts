//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : header-commands.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:36:43 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module implements header insertion commands.
//        o Insert file headers
//        o Insert version entries
//        o Insert todo entries
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

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
      console.log('🔧 insertFileHeader: Starting...');
      
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        console.log('❌ insertFileHeader: No active editor');
        vscode.window.showErrorMessage('No active editor found');
        return;
      }

      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
      const commentToken = getCommentToken(doc.languageId);
      const comment = commentToken.single || '//';

      console.log('📄 insertFileHeader: Document info:');
      console.log('  - Language:', doc.languageId);
      console.log('  - Comment token:', comment);
      console.log('  - File name:', doc.fileName);
      console.log('  - URI:', doc.uri.toString());
      console.log('  - Current content length:', doc.getText().length);

      // Prevent duplicate insertion
      const snippet = doc.getText(new vscode.Range(0, 0, 20, 0));
      const separatorLine = `${comment}-----------------------------------------------------`;
      if (snippet.includes(separatorLine)) {
        console.log('⚠️ insertFileHeader: Header already exists, skipping');
        vscode.window.showInformationMessage('Header already exists. Skipping insertion.');
        return;
      }

      console.log('🏭 insertFileHeader: Getting template manager...');
      
      // Generate header
      const templateManager = TemplateManager.getInstance(this.extensionPath);
      console.log('📋 insertFileHeader: Template manager initialized');
      
      const variableResolver = new VariableResolver();
      console.log('🔍 insertFileHeader: Variable resolver initialized');
      
      const variables = variableResolver.resolveVariables(doc, config, this.extensionPath);
      console.log('💾 insertFileHeader: Variables resolved:');
      console.log('  - Variable keys:', Object.keys(variables));
      console.log('  - Sample variables:', {
        comment: variables.comment,
        fileName: variables.fileName,
        author: variables.author,
        today: variables.today
      });
      
      const headerTemplateLines = templateManager.getHeaderBodyTemplate(config);
      console.log('📝 insertFileHeader: Template lines:');
      console.log('  - Lines count:', headerTemplateLines.length);
      console.log('  - Template preview:', headerTemplateLines.slice(0, 3));
      
      if (headerTemplateLines.length === 0) {
        console.error('❌ insertFileHeader: No template lines found!');
        vscode.window.showErrorMessage('No header template found. Please check your configuration.');
        return;
      }
      
      const header = headerTemplateLines.map((line, index) => {
        const interpolated = variableResolver.interpolateTemplate(line, variables);
        console.log(`  Line ${index}: "${line}" → "${interpolated}"`);
        return interpolated;
      }).join('\n');

      console.log('🎯 insertFileHeader: Generated header:');
      console.log('  - Header length:', header.length);
      console.log('  - Header preview (first 200 chars):', header.substring(0, 200));
      console.log('  - Header full content:');
      console.log(header);

      if (!header || header.trim().length === 0) {
        console.error('❌ insertFileHeader: Generated header is empty!');
        vscode.window.showErrorMessage('Generated header is empty. Please check your template configuration.');
        return;
      }

      console.log('✏️ insertFileHeader: Inserting header at position (0,0)...');
      const position = new vscode.Position(0, 0);
      console.log('📍 Position details:', { line: position.line, character: position.character });

      const editResult = await editor.edit(editBuilder => {
        console.log('🔨 Editor.edit callback executing...');
        editBuilder.insert(position, header + '\n');
        console.log('📝 Insert operation completed');
      });

      console.log('📊 Edit result:', editResult);
      
      if (editResult) {
        console.log('✅ insertFileHeader: Header inserted successfully');
        console.log('📄 Document content length after insertion:', doc.getText().length);
        vscode.window.showInformationMessage('File header inserted successfully!');
      } else {
        console.error('❌ insertFileHeader: Edit operation failed!');
        vscode.window.showErrorMessage('Failed to insert header. Edit operation returned false.');
      }
      
    } catch (error) {
      console.error('💥 insertFileHeader: Error occurred:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
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
    const commentToken = getCommentToken(doc.languageId);
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
    const commentToken = getCommentToken(doc.languageId);
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
    const versionFormat = config.get<string>('beomHeader.versionFormat', 'v{major:02d}p{patch:02d}');
    const customFormat = config.get<string>('beomHeader.customVersionFormat', 'v{major:02d}p{patch:02d}');
    
    const format = versionFormat === 'custom' ? customFormat : versionFormat;
    
    return format
      .replace(/\{major:02d\}/g, major.toString().padStart(2, '0'))
      .replace(/\{major\}/g, major.toString())
      .replace(/\{patch:02d\}/g, patch.toString().padStart(2, '0'))
      .replace(/\{patch\}/g, patch.toString())
      .replace(/\{minor:02d\}/g, minor.toString().padStart(2, '0'))
      .replace(/\{minor\}/g, minor.toString());
  }

  /**
   * Check if the file has an existing header
   */
  public async hasExistingHeader(editor: vscode.TextEditor): Promise<boolean> {
    const doc = editor.document;
    const commentToken = getCommentToken(doc.languageId);
    const comment = commentToken.single || '//';
    
    // Check first 20 lines for header pattern
    const snippet = doc.getText(new vscode.Range(0, 0, Math.min(20, doc.lineCount), 0));
    const separatorLine = `${comment}-----------------------------------------------------`;
    
    return snippet.includes(separatorLine);
  }

  /**
   * Update existing header in the current file
   */
  public async updateExistingHeader(editor: vscode.TextEditor): Promise<void> {
    const doc = editor.document;
    const commentToken = getCommentToken(doc.languageId);
    const comment = commentToken.single || '//';
    
    // Find header boundaries
    const headerBounds = this.findHeaderBounds(doc, comment);
    if (!headerBounds) {
      throw new Error('No existing header found to update');
    }

    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    
    // Generate new header
    const templateManager = TemplateManager.getInstance(this.extensionPath);
    const variableResolver = new VariableResolver();
    const variables = variableResolver.resolveVariables(doc, config, this.extensionPath);
    
    const headerTemplateLines = templateManager.getHeaderBodyTemplate(config);
    if (headerTemplateLines.length === 0) {
      throw new Error('No header template found. Please check your configuration.');
    }
    
    const newHeader = headerTemplateLines.map(line => 
      variableResolver.interpolateTemplate(line, variables)
    ).join('\n');

    // Replace existing header
    const headerRange = new vscode.Range(
      new vscode.Position(headerBounds.start, 0),
      new vscode.Position(headerBounds.end + 1, 0)
    );

    await editor.edit(editBuilder => {
      editBuilder.replace(headerRange, newHeader + '\n');
    });
  }

  /**
   * Find header boundaries in the document
   */
  private findHeaderBounds(doc: vscode.TextDocument, comment: string): { start: number; end: number } | null {
    const lines = doc.getText().split(/\r?\n/);
    const separatorPattern = `${comment}-----------------------------------------------------`;
    
    let startLine = -1;
    let endLine = -1;
    
    // Find start of header (first separator line)
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes(separatorPattern)) {
        startLine = i;
        break;
      }
    }
    
    if (startLine === -1) {
      return null;
    }
    
    // Find end of header (last separator line or end of header section)
    for (let i = startLine + 1; i < Math.min(startLine + 50, lines.length); i++) {
      if (lines[i].includes(separatorPattern)) {
        endLine = i;
        // Continue to find the actual end (could be multiple separator sections)
      } else if (endLine !== -1 && lines[i].trim() === '') {
        // Empty line after separator might indicate end of header
        break;
      }
    }
    
    if (endLine === -1) {
      // If no ending separator found, assume header ends at a reasonable point
      endLine = Math.min(startLine + 30, lines.length - 1);
    }
    
    return { start: startLine, end: endLine };
  }
}
