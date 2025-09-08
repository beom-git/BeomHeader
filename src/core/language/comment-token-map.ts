//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : comment-token-map.ts
// Author        : seongbeom
// First Created : 2025/05/07
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file provides mapping from file extensions to comment tokens.
//        o Maps file extensions to appropriate comment styles
//        o Supports single-line and multi-line comments
//        o Handles special cases for different languages
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';
import { CommentTokenMap, CommentToken } from '../../types/template.types';

/**
 * Language to comment token mapping
 */
const commentTokenMap: CommentTokenMap = {
  // C-style languages
  '.c': { single: '//', multi: { start: '/*', end: '*/' } },
  '.cpp': { single: '//', multi: { start: '/*', end: '*/' } },
  '.cc': { single: '//', multi: { start: '/*', end: '*/' } },
  '.h': { single: '//', multi: { start: '/*', end: '*/' } },
  '.hpp': { single: '//', multi: { start: '/*', end: '*/' } },
  '.cs': { single: '//', multi: { start: '/*', end: '*/' } },
  '.java': { single: '//', multi: { start: '/*', end: '*/' } },
  '.js': { single: '//', multi: { start: '/*', end: '*/' } },
  '.jsx': { single: '//', multi: { start: '/*', end: '*/' } },
  '.ts': { single: '//', multi: { start: '/*', end: '*/' } },
  '.tsx': { single: '//', multi: { start: '/*', end: '*/' } },
  '.go': { single: '//', multi: { start: '/*', end: '*/' } },
  '.rs': { single: '//', multi: { start: '/*', end: '*/' } },
  '.swift': { single: '//', multi: { start: '/*', end: '*/' } },
  '.kt': { single: '//', multi: { start: '/*', end: '*/' } },
  '.scala': { single: '//', multi: { start: '/*', end: '*/' } },
  
  // Script languages
  '.py': { single: '#', multi: { start: '"""', end: '"""' } },
  '.rb': { single: '#', multi: { start: '=begin', end: '=end' } },
  '.pl': { single: '#', multi: { start: '=pod', end: '=cut' } },
  '.sh': { single: '#' },
  '.bash': { single: '#' },
  '.zsh': { single: '#' },
  '.fish': { single: '#' },
  '.ps1': { single: '#', multi: { start: '<#', end: '#>' } },
  '.r': { single: '#' },
  '.R': { single: '#' },
  
  // Web technologies
  '.html': { multi: { start: '<!--', end: '-->' } },
  '.htm': { multi: { start: '<!--', end: '-->' } },
  '.xml': { multi: { start: '<!--', end: '-->' } },
  '.xhtml': { multi: { start: '<!--', end: '-->' } },
  '.svg': { multi: { start: '<!--', end: '-->' } },
  '.css': { multi: { start: '/*', end: '*/' } },
  '.scss': { single: '//', multi: { start: '/*', end: '*/' } },
  '.sass': { single: '//' },
  '.less': { single: '//', multi: { start: '/*', end: '*/' } },
  '.stylus': { single: '//', multi: { start: '/*', end: '*/' } },
  
  // Functional languages
  '.hs': { single: '--', multi: { start: '{-', end: '-}' } },
  '.elm': { single: '--', multi: { start: '{-', end: '-}' } },
  '.ml': { multi: { start: '(*', end: '*)' } },
  '.fs': { single: '//', multi: { start: '(*', end: '*)' } },
  '.clj': { single: ';' },
  '.lisp': { single: ';' },
  '.scm': { single: ';' },
  
  // SQL
  '.sql': { single: '--', multi: { start: '/*', end: '*/' } },
  '.pgsql': { single: '--', multi: { start: '/*', end: '*/' } },
  '.mysql': { single: '--', multi: { start: '/*', end: '*/' } },
  
  // Markup and data
  '.md': { multi: { start: '<!--', end: '-->' } },
  '.markdown': { multi: { start: '<!--', end: '-->' } },
  '.tex': { single: '%' },
  '.latex': { single: '%' },
  '.yml': { single: '#' },
  '.yaml': { single: '#' },
  '.toml': { single: '#' },
  '.ini': { single: ';' },
  '.conf': { single: '#' },
  '.cfg': { single: '#' },
  
  // Assembly
  '.asm': { single: ';' },
  '.s': { single: '#' },
  
  // Others
  '.vim': { single: '"' },
  '.lua': { single: '--', multi: { start: '--[[', end: ']]' } },
  '.m': { single: '%' }, // MATLAB/Octave
  '.jl': { single: '#', multi: { start: '#=', end: '=#' } }, // Julia
  '.dart': { single: '//', multi: { start: '/*', end: '*/' } },
  '.php': { single: '//', multi: { start: '/*', end: '*/' } },
  '.ex': { single: '#' }, // Elixir
  '.exs': { single: '#' }, // Elixir
  '.erl': { single: '%' }, // Erlang
  '.hrl': { single: '%' }, // Erlang
};

/**
 * Get comment token for file extension
 */
export function getCommentToken(fileExtension: string): CommentToken {
  const normalizedExt = fileExtension.toLowerCase();
  
  // First check user configuration
  const userConfig = getCommentTokenMap();
  if (userConfig[normalizedExt]) {
    // Parse user config format for backward compatibility
    const userToken = userConfig[normalizedExt];
    return { single: userToken };
  }
  
  // Use default mapping
  return commentTokenMap[normalizedExt] || { single: '//', multi: { start: '/*', end: '*/' } };
}

/**
 * Retrieves the user-configured comment token map for backward compatibility
 */
export function getCommentTokenMap(): Record<string, string> {
  return vscode.workspace
    .getConfiguration('beomHeader')
    .get<Record<string, string>>('commentTokenMap', {});
}

/**
 * Get all supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return Object.keys(commentTokenMap);
}

/**
 * Check if file extension is supported
 */
export function isExtensionSupported(fileExtension: string): boolean {
  const normalizedExt = fileExtension.toLowerCase();
  return normalizedExt in commentTokenMap;
}