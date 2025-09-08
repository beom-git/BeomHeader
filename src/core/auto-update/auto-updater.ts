//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : auto-updater.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:24:04 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module provides auto-update functionality for file headers
//        o Updates Last Modified timestamp
//        o Updates Editor information
//        o Configurable update strategies
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as vscode from 'vscode';
import { getCommentToken } from '../language/comment-token-map';
import { getCurrentTimestamp } from '../../utils/date-utils';
import { escapeRegex } from '../../utils/string-utils';
import { EXTENSION_SECTION } from '../../types/common.types';
import { UpdateStrategy } from '../../types/common.types';

/**
 * Last Modified update strategy
 */
class LastModifiedUpdateStrategy implements UpdateStrategy {
  name = 'LastModified';
  // More robust pattern to handle any number of "Last" repetitions
  pattern = /^(.*?)(?:\s*(?:Last\s+)*(?:Last\s+)?Updated\s*:\s*.*|Updated\s*:\s*.*)$/;

  canUpdate(line: string): boolean {
    // Check if line contains " Last Updated  : 2025-09-08 04:46:24 (by root)
    return /Updated\s*:\s*/.test(line);
  }

  updateLine(line: string, variables: Record<string, string>): string {
    const now = getCurrentTimestamp();
    const currentUser = require('os').userInfo().username;
    const newTimestamp = `${now} (by ${currentUser})`;
    
    // Find the comment prefix and any existing field prefix
    const match = line.match(/^(.*?)(?:\s*(?:Last\s+)*(?:Last\s+)?Updated\s*:\s*.*|Updated\s*:\s*.*)$/);
    if (match) {
      let prefix = match[1];
      // Clean up any trailing "Last" words from the prefix
      prefix = prefix.replace(/\s*(?:Last\s*)*$/, '');
      return `${prefix} Last Updated  : ${newTimestamp}`;
    }
    
    // Fallback - should not reach here if canUpdate works correctly
    return line.replace(/Updated\s*:\s*.*$/, `Last Updated  : ${newTimestamp}`);
  }
}

/**
 * Editor info update strategy
 */
class EditorInfoUpdateStrategy implements UpdateStrategy {
  name = 'EditorInfo';
  pattern = /^(.*)Editor\s*:\s*(.*)$/;

  canUpdate(line: string): boolean {
    return this.pattern.test(line);
  }

  updateLine(line: string, variables: Record<string, string>): string {
    const editorInfo = variables['editorInfo'] || 'Visual Studio Code, space size (4)';
    return line.replace(this.pattern, (_, prefix) => `${prefix}Editor        : ${editorInfo}`);
  }
}

/**
 * Auto updater for header information
 */
export class AutoUpdater {
  private strategies: UpdateStrategy[] = [
    new LastModifiedUpdateStrategy(),
    new EditorInfoUpdateStrategy()
  ];

  /**
   * Register auto-update event handler
   */
  public register(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.workspace.onWillSaveTextDocument(async (event) => {
        await this.updateDocument(event.document);
      })
    );

    // Add command to clean up duplicate "Last" entries
    context.subscriptions.push(
      vscode.commands.registerCommand('fileHeader.cleanupDuplicateLastEntries', async () => {
        await this.cleanupDuplicateLastEntries();
      })
    );
  }

  /**
   * Clean up duplicate "Last" entries in the current document
   */
  private async cleanupDuplicateLastEntries(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    let hasUpdates = false;

    // Process first 50 lines only (header area)
    for (let i = 0; i < Math.min(50, lines.length); i++) {
      const line = lines[i];
      
      // Check for lines with multiple "Last" entries
      if (/Last\s+Last/.test(line) && /Updated\s*:/.test(line)) {
        // Clean up multiple "Last" occurrences
        const cleanedLine = line.replace(/(\s*)(?:Last\s+)+Last(\s+Updated\s*:\s*.*)/, '$1Last$2');
        if (line !== cleanedLine) {
          lines[i] = cleanedLine;
          hasUpdates = true;
          console.log(`Cleaned line ${i + 1}: "${line}" → "${cleanedLine}"`);
        }
      }
    }

    if (hasUpdates) {
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
      edit.replace(document.uri, fullRange, lines.join('\n'));
      await vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage('Cleaned up duplicate "Last" entries');
    } else {
      vscode.window.showInformationMessage('No duplicate "Last" entries found');
    }
  }

  /**
   * Update document with all applicable strategies
   */
  private async updateDocument(document: vscode.TextDocument): Promise<void> {
    const config = vscode.workspace.getConfiguration(EXTENSION_SECTION);
    const autoUpdateLastModified = config.get<boolean>('beomHeader.autoUpdateLastModified', true);
    const autoUpdateEditor = config.get<boolean>('beomHeader.autoUpdateEditor', true);
    
    if (!autoUpdateLastModified && !autoUpdateEditor) return;

    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const variables = this.buildVariables(document);
    
    // Find header boundaries
    const headerBounds = this.findHeaderBounds(lines);
    if (!headerBounds) {
      console.log('🚫 No header found in document, skipping auto-update');
      return;
    }
    
    console.log(`📋 Header found: lines ${headerBounds.start + 1} to ${headerBounds.end + 1}`);
    
    let hasUpdates = false;
    
    // Process only within header boundaries
    for (let i = headerBounds.start; i <= headerBounds.end; i++) {
      for (const strategy of this.strategies) {
        if (strategy.canUpdate(lines[i])) {
          // Check if this update type is enabled
          if ((strategy.name === 'LastModified' && !autoUpdateLastModified) ||
              (strategy.name === 'EditorInfo' && !autoUpdateEditor)) {
            continue;
          }
          
          const newLine = strategy.updateLine(lines[i], variables);
          if (lines[i] !== newLine) {
            lines[i] = newLine;
            hasUpdates = true;
            console.log(`🔄 Updated line ${i + 1}: ${strategy.name}`);
          }
        }
      }
    }
    
    if (hasUpdates) {
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
      edit.replace(document.uri, fullRange, lines.join('\n'));
      await vscode.workspace.applyEdit(edit);
    }
  }

  /**
   * Find header boundaries by looking for separator lines
   */
  private findHeaderBounds(lines: string[]): { start: number; end: number } | null {
    let headerStart = -1;
    let headerEnd = -1;
    
    // Look for header separator patterns
    const separatorPattern = /^[\/\*#%\-\+\=]{4,}[\-\+\=\s]*$/;
    
    // Find first separator (header start)
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (separatorPattern.test(line)) {
        headerStart = i;
        break;
      }
    }
    
    if (headerStart === -1) {
      return null; // No header found
    }
    
    // Find second separator (header end) - look within reasonable range
    for (let i = headerStart + 1; i < Math.min(headerStart + 50, lines.length); i++) {
      const line = lines[i].trim();
      if (separatorPattern.test(line)) {
        headerEnd = i;
        break;
      }
    }
    
    if (headerEnd === -1) {
      return null; // No complete header found
    }
    
    return { start: headerStart, end: headerEnd };
  }

  /**
   * Build variables for update strategies
   */
  private buildVariables(document: vscode.TextDocument): Record<string, string> {
    const editor = vscode.window.activeTextEditor;
    
    let editorInfo = `${vscode.env.appName}, tab size (4)`;
    if (editor && editor.document === document) {
      const tabSize = editor.options.tabSize || 4;
      const insertSpaces = editor.options.insertSpaces;
      const indentType = insertSpaces ? 'space' : 'tab';
      editorInfo = `${vscode.env.appName}, ${indentType} size (${tabSize})`;
    }
    
    return {
      editorInfo
    };
  }
}
