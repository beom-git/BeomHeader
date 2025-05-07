//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name : VS Code Extension
// File Name    : commentTokenMap.ts
// Author       : seongbeom
// Creation Date: 2025/05/07
// Description  : 
//
//     This file is commentTokenMap for the BeomHeader extension.
//        o This map is used to determine the comment token for each language.
//        o You can configure the comment token in the settings.json file.
//
//----------------------------------------------------------------------
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//----------------------------------------------------------------------

import * as vscode from 'vscode';

/**
 * Retrieves the user-configured comment token map.
 */
export function getCommentTokenMap(): Record<string, string> {
  return vscode.workspace
    .getConfiguration('beomHeader')
    .get<Record<string, string>>('commentTokenMap', {});
}