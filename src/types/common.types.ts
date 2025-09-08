//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : common.types.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file defines common TypeScript types used across the extension.
//        o Shared interfaces and types
//        o Utility types
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';

/**
 * Command registration function type
 */
export type CommandRegistrar = (context: vscode.ExtensionContext) => void;

/**
 * Update strategy interface for auto-update functionality
 */
export interface UpdateStrategy {
  name: string;
  pattern: RegExp;
  canUpdate(line: string): boolean;
  updateLine(line: string, variables: Record<string, string>): string;
}

/**
 * Language mapping interface
 */
export interface LanguageMapping {
  languageId: string;
  commentToken: string;
  shebang?: string;
}

/**
 * Author information interface
 */
export interface AuthorInfo {
  name: string;
  email: string;
  fullName: string;
  title: string;
}

/**
 * File information interface
 */
export interface FileInfo {
  name: string;
  fullPath: string;
  relativePath: string;
  baseName: string;
  languageId: string;
}

/**
 * Editor configuration interface
 */
export interface EditorConfig {
  tabSize: number;
  insertSpaces: boolean;
  editorName: string;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

/**
 * Configuration section constant
 */
export const EXTENSION_SECTION = 'beomHeader' as const;
