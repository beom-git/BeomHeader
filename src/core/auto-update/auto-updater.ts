//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : auto-updater.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Last Updated : 2025-09-08 04:00:39 (by root)
// Editor       : Visual Studio Code, tab size (4)
// Description   : 
//
//     This file manages automatic header updates on file save.
//        o Updates Last Modified timestamp
//        o Updates Editor information
//        o Configurable update strategies
//
//----------------------------------------------------------------------

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
    // Check if line contains "Last Updated : 2025-09-08 04:00:39 (by root)
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
    return line.replace(this.pattern, (_, prefix) => `${prefix}Editor       : ${editorInfo}`);
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
    const autoUpdateLastModified = config.get<boolean>('autoUpdateLastModified', true);
    const autoUpdateEditor = config.get<boolean>('autoUpdateEditor', true);
    
    if (!autoUpdateLastModified && !autoUpdateEditor) return;

    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const variables = this.buildVariables(document);
    
    let hasUpdates = false;
    
    // Process first 50 lines only (header area)
    for (let i = 0; i < Math.min(50, lines.length); i++) {
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
