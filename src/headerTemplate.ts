//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name : VS Code Extension
// File Name    : headerTemplate.ts
// Author       : seongbeom
// Creation Date: 2025/05/07
// Description  : 
//
//     This file is headerTemplate for the BeomHeader extension.
//        o This file generates a standardized header string for insertion.
//        o It uses the user-configured header template and comment token.
//
//----------------------------------------------------------------------
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//----------------------------------------------------------------------


import { TextDocument, WorkspaceConfiguration } from 'vscode';
import * as os from 'os';
import { getCommentTokenMap } from './commentTokenMap';

function interpolate(line: string, vars: Record<string, string>): string {
  return line.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

/**
 * Generates a standardized header string for insertion.
 */
export function createHeaderTemplate(
  doc: TextDocument,
  config: WorkspaceConfiguration
): string {
  const langId = doc.languageId;
  const commentMap = getCommentTokenMap();
  const comment = commentMap[langId] || '#';
  const shebangMap = config.get<Record<string, string>>('shebangPerLanguage', {});
  const shebang = shebangMap[langId] || '';
  const projectName = config.get<string>('projectName', '');
  const company = config.get<string>('company', '');
  const startYear = config.get<string>('copyrightStartYears', '');
  const endYear = new Date().getFullYear().toString();
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
  const fileName = doc.fileName.split(/[/\\]/).pop() || '';
  const author = os.userInfo().username;

  // Fetch header body template lines from settings
  const templateLines = config.get<string[]>('headerBodyTemplate', []);

  // Build interpolation variables
  const vars: Record<string, string> = {
    comment,
    projectName,
    company,
    startYear,
    endYear,
    today,
    fileName,
    author
  };

  const lines: string[] = [];
  if (shebang) {
    lines.push(`#!${shebang}`);
  }
  for (const tmpl of templateLines) {
    lines.push(interpolate(tmpl, vars));
  }
  return lines.join('\n') + '\n\n';
}
