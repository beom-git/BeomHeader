//-----------------------------------------------------
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
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//-----------------------------------------------------

import { TextDocument, WorkspaceConfiguration } from 'vscode';
import * as os from 'os';
import { commentTokenMap } from './commentTokenMap';

/**
 * Returns the body lines for the header using provided parameters.
 */
function getHeaderBodyLines(params: {
  comment: string;
  startYear: string;
  endYear: string;
  company: string;
  projectName: string;
  fileName: string;
  author: string;
  today: string;
}): string[] {
  const { comment, startYear, endYear, company, projectName, fileName, author, today } = params;
  return [
    `${comment}-----------------------------------------------------`,
    `${comment} (C) Copyright ${startYear}-${endYear} ${company}`,
    `${comment}`,
    `${comment} All Rights Reserved`,
    `${comment}`,
    `${comment} Project Name : ${projectName}`,
    `${comment} File Name    : ${fileName}`,
    `${comment} Author       : ${author}`,
    `${comment} Creation Date: ${today}`,
    `${comment} Description  : `,
    `${comment}`,
    `${comment} File History :`,
    `${comment}      * ${today} : (v01p00,  ${author}) First Release by '${author}'`,
    `${comment} To-Do List   :`,
    `${comment}      * ${today} : (ToDo#00, ${author}) None`,
    `${comment}-----------------------------------------------------`
  ];
}

/**
 * Generates a standardized header string for insertion.
 */
export function createHeaderTemplate(
  doc: TextDocument,
  config: WorkspaceConfiguration
): string {
  const langId = doc.languageId;
  const shebangMap = config.get<{ [key: string]: string }>('shebangPerLanguage')!;
  const shebang = shebangMap[langId] || '';
  const author = os.userInfo().username;
  const projectName = config.get<string>('projectName')!;
  const company = config.get<string>('company')!;
  const startYear = config.get<string>('copyrightStartYears')!;
  const endYear = new Date().getFullYear().toString();
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
  const fileName = doc.fileName.split(/[/\\]/).pop()!;
  const comment = commentTokenMap[langId] || '#';

  const lines: string[] = [];
  if (shebang) {
    lines.push(`#!${shebang}`);
  }
  lines.push(
    ...getHeaderBodyLines({ comment, startYear, endYear, company, projectName, fileName, author, today })
  );

  return lines.join('\n') + '\n\n';
}
