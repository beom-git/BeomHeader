//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : TCL
// File Name     : comment-token-map.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:53:23 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This file provides mapping from file extensions to comment tokens.
//        o Maps file extensions to appropriate comment styles
//        o Supports single-line and multi-line comments
//        o Handles special cases for different languages
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------


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
 * Language ID to file extension mapping (supports multiple extensions per language)
 */
const languageIdToExtension: Record<string, string[]> = {
  'typescript': ['.ts', '.tsx'],
  'javascript': ['.js', '.jsx', '.mjs', '.cjs'],
  'typescriptreact': ['.tsx'],
  'javascriptreact': ['.jsx'],
  'python': ['.py', '.pyw', '.pyi'],
  'java': ['.java'],
  'c': ['.c', '.h'],
  'cpp': ['.cpp', '.cc', '.cxx', '.c++', '.hpp', '.hh', '.hxx', '.h++'],
  'csharp': ['.cs'],
  'go': ['.go'],
  'rust': ['.rs'],
  'swift': ['.swift'],
  'kotlin': ['.kt', '.kts'],
  'scala': ['.scala', '.sc'],
  'ruby': ['.rb', '.rbw'],
  'perl': ['.pl', '.pm', '.t'],
  'shell': ['.sh'],
  'shellscript': ['.sh', '.bash', '.zsh', '.fish'],
  'bash': ['.bash', '.sh'],
  'powershell': ['.ps1', '.psm1', '.psd1'],
  'r': ['.r', '.R'],
  'html': ['.html', '.htm', '.xhtml'],
  'xml': ['.xml', '.xsd', '.xsl', '.xslt'],
  'css': ['.css'],
  'scss': ['.scss'],
  'sass': ['.sass'],
  'less': ['.less'],
  'stylus': ['.styl'],
  'haskell': ['.hs', '.lhs'],
  'ocaml': ['.ml', '.mli'],
  'fsharp': ['.fs', '.fsi', '.fsx'],
  'clojure': ['.clj', '.cljs', '.cljc'],
  'lisp': ['.lisp', '.lsp'],
  'sql': ['.sql', '.pgsql', '.mysql'],
  'markdown': ['.md', '.markdown', '.mdown', '.mkd'],
  'tex': ['.tex', '.latex'],
  'yaml': ['.yml', '.yaml'],
  'toml': ['.toml'],
  'ini': ['.ini', '.cfg', '.conf'],
  'vim': ['.vim', '.vimrc'],
  'lua': ['.lua'],
  'matlab': ['.m'],
  'julia': ['.jl'],
  'dart': ['.dart'],
  'php': ['.php', '.phtml', '.php3', '.php4', '.php5'],
  'elixir': ['.ex', '.exs'],
  'erlang': ['.erl', '.hrl'],
  'assembly': ['.asm', '.s', '.S'],
  'makefile': ['Makefile', 'makefile', '.mk'],
  'dockerfile': ['Dockerfile', '.dockerfile'],
  'json': ['.json', '.jsonc'],
  'jsonc': ['.jsonc'],
  'properties': ['.properties'],
  'gitignore': ['.gitignore'],
  'ignore': ['.ignore', '.eslintignore', '.prettierignore']
};

/**
 * Get comment token for file extension or language ID
 */
export function getCommentToken(fileExtensionOrLanguageId: string): CommentToken {
  let normalizedExt: string;
  
  // Check if it's a language ID or file extension
  if (fileExtensionOrLanguageId.startsWith('.')) {
    normalizedExt = fileExtensionOrLanguageId.toLowerCase();
  } else {
    // It's a language ID, convert to extension
    const extensions = getLanguageExtensions(fileExtensionOrLanguageId.toLowerCase());
    
    if (extensions && extensions.length > 0) {
      normalizedExt = extensions[0]; // Use first extension as primary
    } else {
      normalizedExt = '.txt'; // Default fallback
    }
  }
  
  // First check user configuration
  const userConfig = getCommentTokenMap();
  const languageId = fileExtensionOrLanguageId.startsWith('.') 
    ? fileExtensionOrLanguageId.substring(1) 
    : fileExtensionOrLanguageId;
    
  if (userConfig[languageId]) {
    // Parse user config format for backward compatibility
    const userToken = userConfig[languageId];
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
 * Get default language extensions from configuration
 */
function getDefaultLanguageExtensions(): Record<string, string[]> {
  const config = vscode.workspace.getConfiguration('beomHeader');
  return config.get<Record<string, string[]>>('languageExtensions', {});
}

/**
 * Retrieves the user-configured language to extensions mapping
 */
export function getUserLanguageExtensions(languageId: string): string[] | undefined {
  const config = vscode.workspace.getConfiguration('beomHeader');
  const userExtensions = config.get<Record<string, string[]>>('languageExtensions', {});
  
  return userExtensions[languageId];
}

/**
 * Get all supported language IDs
 */
export function getSupportedLanguageIds(): string[] {
  const defaultExtensions = getDefaultLanguageExtensions();
  const userExtensions = vscode.workspace.getConfiguration('beomHeader')
    .get<Record<string, string[]>>('languageExtensions', {});
  
  return [...new Set([...Object.keys(defaultExtensions), ...Object.keys(userExtensions)])];
}

/**
 * Get extensions for a language ID (user config takes precedence over defaults)
 */
export function getLanguageExtensions(languageId: string): string[] {
  const defaultExtensions = getDefaultLanguageExtensions();
  const userExtensions = getUserLanguageExtensions(languageId);
  
  if (userExtensions && userExtensions.length > 0) {
    return userExtensions;
  }
  
  return defaultExtensions[languageId] || languageIdToExtension[languageId] || [];
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