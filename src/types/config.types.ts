//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config.types.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:51:55 (by root)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file defines TypeScript types for configuration settings.
//        o Provides type safety for all configuration options
//        o Ensures consistency across the extension
//
//----------------------------------------------------------------------

/**
 * Main configuration interface for BeomHeader extension
 */
export interface BeomHeaderConfig {
  // Core Settings
  projectName: string;
  companyName: string;
  copyrightStartYears: string;
  
  // Author & Team Settings
  authorFullName: string;
  authorEmail: string;
  authorTitle: string;
  teamName: string;
  
  // License Settings
  licenseType: string;
  customLicenseText: string;
  licenseUrl: string;
  copyrightNotice: string;
  includeLicenseHeader: boolean;
  
  // File Path & Display Settings
  showFullPath: boolean;
  showRelativePath: boolean;
  pathSeparator: string;
  
  // Header Style Settings
  headerStyle: 'standard' | 'minimal' | 'detailed';
  separatorChar: string;
  separatorLength: number;
  
  // Version Format Settings
  versionFormat: string;
  customVersionFormat: string;
  includeMinorVersion: boolean;
  autoIncrementVersion: boolean;
  
  // Auto-Update Settings
  autoUpdateLastModified: boolean;
  autoUpdateEditor: boolean;
  
  // Project Description Settings
  projectDescription: string;
  
  // Language & Comment Settings
  commentTokenMap: Record<string, string>;
  shebangPerLanguage: Record<string, string>;
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
 * Version information interface
 */
export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
}

/**
 * License type enumeration
 */
export type LicenseType = 
  | 'All Rights Reserved'
  | 'MIT'
  | 'Apache-2.0'
  | 'GPL-3.0'
  | 'GPL-2.0'
  | 'LGPL-3.0'
  | 'LGPL-2.1'
  | 'BSD-3-Clause'
  | 'BSD-2-Clause'
  | 'ISC'
  | 'MPL-2.0'
  | 'Unlicense'
  | 'Custom';

/**
 * Header style enumeration
 */
export type HeaderStyle = 'standard' | 'minimal' | 'detailed';
