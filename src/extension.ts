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
import { getCommentTokenMap } from './commentTokenMap';

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function activate(ctx: vscode.ExtensionContext) {
  const configSection = 'beomHeader';

  // Command: Insert file header
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insert', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(configSection);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';

      // Prevent duplicate insertion
      const checkRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(20, 0));
      const firstText = doc.getText(checkRange);
      const separator = `${comment}-----------------------------------------------------`;
      if (firstText.includes(separator)) {
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
      const config = vscode.workspace.getConfiguration(configSection);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';
      const author = os.userInfo().username;
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

      // Find File History section
      const fullText = doc.getText();
      const lines = fullText.split(/\r?\n/);
      const historyHeader = `${comment} File History :`;
      let idx = lines.findIndex(line => line.trim() === historyHeader.trim());
      if (idx < 0) {
        vscode.window.showInformationMessage('File History section not found. Inserting at top.');
        idx = 0;
      } else {
        idx++;
        while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
          idx++;
        }
      }

      // Scan existing versions
      let maxMajor = 1;
      let maxPatch = -1;
      for (let i = idx; i < lines.length; i++) {
        const m = lines[i].match(/\(v(\d+)p(\d+),/);
        if (m) {
          const maj = parseInt(m[1], 10);
          const pat = parseInt(m[2], 10);
          if (maj > maxMajor || (maj === maxMajor && pat > maxPatch)) {
            maxMajor = maj;
            maxPatch = pat;
          }
        } else {
          break;
        }
      }
      const versionLine = `${comment}      * ${today} : (v${pad2(maxMajor)}p${pad2(maxPatch + 1)},  ${author}) Description\n`;
      await editor.edit(edit => edit.insert(new vscode.Position(idx, 0), versionLine));
    })
  );

  // Command: Insert to-do entry with auto-increment
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fileHeader.insertTodo', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const config = vscode.workspace.getConfiguration(configSection);
      const commentMap = getCommentTokenMap();
      const comment = commentMap[doc.languageId] || '#';
      const author = os.userInfo().username;
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

      // Find To-Do List section
      const fullText = doc.getText();
      const lines = fullText.split(/\r?\n/);
      const todoHeader = `${comment} To-Do List   :`;
      let idx = lines.findIndex(line => line.trim() === todoHeader.trim());
      let nextIdx = 0;

      if (idx >= 0) {
        idx++;
        let max = -1;
        while (idx < lines.length && lines[idx].startsWith(`${comment}      *`)) {
          const m = lines[idx].match(/\(ToDo#(\d+),/);
          if (m) {
            const val = parseInt(m[1], 10);
            if (val > max) max = val;
          }
          idx++;
        }
        nextIdx = max + 1;
      } else {
        idx = 0;
        nextIdx = 0;
      }
   
      const todoLine = `${comment}      * ${today} : (ToDo#${pad2(nextIdx)}, ${author}) Description\n`;
      await editor.edit(edit => edit.insert(new vscode.Position(idx, 0), todoLine));
    })
  );
}

export function deactivate() {}
