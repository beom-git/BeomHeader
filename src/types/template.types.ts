//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : template.types.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file defines TypeScript types for template system.
//        o Template variable definitions
//        o Template structure interfaces
//
//----------------------------------------------------------------------

/**
 * Comment token structure
 */
export interface CommentToken {
  single?: string;
  multi?: {
    start: string;
    end: string;
  };
}

/**
 * Comment token mapping by file extension
 */
export type CommentTokenMap = Record<string, CommentToken>;

/**
 * Available template variables for substitution
 */
export interface TemplateVariables {
  // Core fields
  authorName: string;
  authorEmail: string;
  creationDate: string;
  lastModifiedDate: string;
  lastModifiedUser: string;
  editorInfo: string;
  fileName: string;
  projectName: string;
  description: string;
  copyright: string;
  fileHistory: string;
  todoList: string;
  
  // Additional template fields
  comment: string;
  separator: string;
  company: string;
  fullPath: string;
  relativePath: string;
  baseFileName: string;
  author: string;
  authorWithEmail: string;
  currentDate: string;
  currentYear: string;
  startYear: string;
  endYear: string;
  licenseType: string;
  licenseUrl: string;
  
  // Make it indexable for dynamic access
  [key: string]: string;
}

/**
 * Template structure for header body
 */
export interface HeaderBodyTemplate {
  standard: string[];
  minimal: string[];
  detailed: string[];
}

/**
 * Template structure for version entries
 */
export interface VersionEntryTemplate {
  standard: string;
  minimal: string;
  detailed: string;
}

/**
 * Template structure for todo entries
 */
export interface TodoEntryTemplate {
  standard: string;
  minimal: string;
  detailed: string;
}

/**
 * Complete template collection
 */
export interface TemplateCollection {
  headerBody: HeaderBodyTemplate;
  versionEntry: VersionEntryTemplate;
  todoEntry: TodoEntryTemplate;
}

/**
 * Template interpolation context
 */
export interface TemplateContext {
  variables: TemplateVariables;
  style: 'standard' | 'minimal' | 'detailed';
}
