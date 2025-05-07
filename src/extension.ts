//-----------------------------------------------------
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
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
//      * 2025/05/07 : (v01p01,  seongbeom) Added auto-increment for version and to-do entries
//      * 2025/05/07 : (v01p02,  seongbeom) Added check for existing header to prevent duplication
//      * 2025/05/07 : (v01p03,  seongbeom) Added support for multiple languages
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//-----------------------------------------------------

import * as vscode from 'vscode';
import * as os from 'os';
import { createHeaderTemplate } from './headerTemplate';
import { commentTokenMap } from './commentTokenMap';

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function activate(ctx: vscode.ExtensionContext) {
  // Command: Insert file header
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insert', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const langId = doc.languageId;
      const config = vscode.workspace.getConfiguration('beomHeader');
      const comment = commentTokenMap[langId] || '#';

      // Prevent duplicate insertion
      const checkRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(20, 0));
      if (doc.getText(checkRange).includes(`${comment}-----------------------------------------------------`)) {
        vscode.window.showInformationMessage('Header already exists. Skipping insertion.');
        return;
      }

      const header = createHeaderTemplate(doc, config);
      await editor.edit(edit => edit.insert(new vscode.Position(0, 0), header));
    })
  );

  // Command: Insert version entry with auto-increment
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insertVersion', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const langId = doc.languageId;
      const comment = commentTokenMap[langId] || '#';
      const author = os.userInfo().username;
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

      // Find File History section in header
      const fullText = doc.getText();
      const lines = fullText.split(/\r?\n/);
      const historyHeader = `${comment} File History :`;
      let idx = lines.findIndex(line => line.trim() === historyHeader.trim());
      if (idx < 0) {
        vscode.window.showInformationMessage('File History section not found. Inserting at top.');
        idx = 0;
      } else {
        idx++;
      }

      // Scan for highest version
      let maxMajor = 1;
      let maxPatch = -1;
      while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
        const m = lines[idx].match(/\(v(\d+)p(\d+),/);
        if (m) {
          const maj = parseInt(m[1], 10);
          const pat = parseInt(m[2], 10);
          if (maj > maxMajor || (maj === maxMajor && pat > maxPatch)) {
            maxMajor = maj;
            maxPatch = pat;
          }
        }
        idx++;
      }
      const versionLine = `${comment}      * ${today} : (v${pad2(maxMajor)}p${pad2(maxPatch + 1)},  ${author}) Description\n`;

      // Insert version line
      await editor.edit(edit => edit.insert(new vscode.Position(idx, 0), versionLine));
    })
  );

  // Command: Insert to-do entry within existing header with auto-increment
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insertTodo', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const langId = doc.languageId;
      const comment = commentTokenMap[langId] || '#';
      const author = os.userInfo().username;
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

      const fullText = doc.getText();
      const lines = fullText.split(/\r?\n/);
      const todoHeader = `${comment} To-Do List   :`;
      let idx = lines.findIndex(line => line.trim() === todoHeader.trim());
      if (idx >= 0) {
        idx++;
        let max = -1;
        while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
          const m = lines[idx].match(/\(ToDo#(\d+),/);
          if (m) max = Math.max(max, parseInt(m[1], 10));
          idx++;
        }
        const todoLine = `${comment}      * ${today} : (ToDo#${pad2(max + 1)}, ${author}) Description\n`;
        await editor.edit(edit => edit.insert(new vscode.Position(idx, 0), todoLine));
      } else {
        const todoLine = `${comment}      * ${today} : (ToDo#00, ${author}) Description\n`;
        await editor.edit(edit => edit.insert(new vscode.Position(0, 0), todoLine));
      }
    })
  );
}

export function deactivate() {}
