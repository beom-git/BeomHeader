//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name : VS Code Extension
// File Name    : extension.ts
// Author       : seongbeom
// Creation Date: 2025/05/07
// Description  : 
//
//    This file contains the main logic for the VS Code extension
//      o Inserts a file header with "Insert file header" command
//      o Inserts version entries with "Insert version entry" command
//      o Inserts to-do entries with "Insert to-do entry" command
//
//----------------------------------------------------------------------
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
//      * 2025/05/07 : (v01p01,  seongbeom) Added auto-increment for version and to-do entries
//      * 2025/05/07 : (v01p02,  seongbeom) Added check for existing header to prevent duplication
//      * 2025/05/07 : (v01p03,  seongbeom) Added support for multiple languages
//      * 2025/05/07 : (v01p04,  seongbeom) Added support for header template 
//                                            and user-configurable comment tokens
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//----------------------------------------------------------------------
import * as vscode from 'vscode';
import * as os from 'os';
import { createHeaderTemplate } from './headerTemplate';
import { getCommentTokenMap } from './commentTokenMap';

/**
 * Pads a number to 2 digits (e.g., 3 -> "03").
 */
function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Simple template interpolation for placeholders like ${key}.
 */
function interpolate(line: string, vars: Record<string, string>): string {
  return line.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

export function activate(ctx: vscode.ExtensionContext) {
  const SECTION = 'beomHeader';

  // --- Insert File Header ---
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insert', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(SECTION);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';

      // Prevent duplicate insertion
      const snippet = doc.getText(new vscode.Range(0, 0, 20, 0));
      const separatorLine = `${comment}-----------------------------------------------------`;
      if (snippet.includes(separatorLine)) {
        vscode.window.showInformationMessage('Header already exists. Skipping insertion.');
        return;
      }

      const header = createHeaderTemplate(doc, config);
      await editor.edit(e => e.insert(new vscode.Position(0, 0), header));
    })
  );

  // --- Insert Version Entry ---
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insertVersion', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(SECTION);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';
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
      let maxMajor = 1, maxPatch = -1;
      for (let i = idx; i < lines.length; i++) {
        const m = lines[i].match(/\(v(\d+)p(\d+),/);
        if (m) {
          const maj = +m[1], pat = +m[2];
          if (maj > maxMajor || (maj === maxMajor && pat > maxPatch)) {
            maxMajor = maj;
            maxPatch = pat;
          }
        } else break;
      }

      // Use user-defined template
      const tmpl = config.get<string>('versionEntryTemplate', '');
      const versionLine = interpolate(tmpl, {
        comment,
        today,
        author,
        major: pad2(maxMajor),
        patch: pad2(maxPatch + 1)
      });

      await editor.edit(e => e.insert(new vscode.Position(idx, 0), versionLine));
    })
  );

  // --- Insert To-Do Entry ---
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insertTodo', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(SECTION);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';
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

      // Use user-defined template
      const tmpl = config.get<string>('todoEntryTemplate', '');
      const todoLine = interpolate(tmpl, {
        comment,
        today,
        author,
        index: pad2(maxIdx + 1)
      });

      await editor.edit(e => e.insert(new vscode.Position(idx, 0), todoLine));
    })
  );
}

export function deactivate() {}

