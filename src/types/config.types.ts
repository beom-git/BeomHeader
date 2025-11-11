//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config.types.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-11-07 01:26:12 (by root)
// Editor        : Visual Studio Code, tab size (4)
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
  enableConfigChangeNotifications: boolean;
  
  // Date & Time Settings
  timeZone: string;
  timeZoneFormat: 'abbreviation' | 'full' | 'offset';
  
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

/**
 * Timezone format enumeration
 */
export type TimeZoneFormat = 'abbreviation' | 'full' | 'offset';

/**
 * Timezone abbreviation mapping
 */
export const TIMEZONE_ABBREVIATIONS: Record<string, string> = {
  'UTC': 'UTC',
  'Asia/Seoul': 'KST',
  'Asia/Tokyo': 'JST',
  'Asia/Shanghai': 'CST',
  'Asia/Bangkok': 'ICT',
  'Asia/Singapore': 'SGT',
  'Asia/Hong_Kong': 'HKT',
  'Asia/Kolkata': 'IST',
  'Asia/Dubai': 'GST',
  'Europe/London': 'GMT',
  'Europe/Paris': 'CET',
  'Europe/Berlin': 'CET',
  'Europe/Moscow': 'MSK',
  'America/New_York': 'EST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'America/Los_Angeles': 'PST',
  'America/Toronto': 'EST',
  'America/Mexico_City': 'CST',
  'America/Sao_Paulo': 'BRT',
  'Australia/Sydney': 'AEDT',
  'Australia/Melbourne': 'AEDT',
  'Pacific/Auckland': 'NZDT'
};

/**
 * Timezone offset mapping (UTC+/- format)
 */
export const TIMEZONE_OFFSETS: Record<string, string> = {
  'UTC': 'UTC+0',
  'Asia/Seoul': 'UTC+9',
  'Asia/Tokyo': 'UTC+9',
  'Asia/Shanghai': 'UTC+8',
  'Asia/Bangkok': 'UTC+7',
  'Asia/Singapore': 'UTC+8',
  'Asia/Hong_Kong': 'UTC+8',
  'Asia/Kolkata': 'UTC+5:30',
  'Asia/Dubai': 'UTC+4',
  'Europe/London': 'UTC+0',
  'Europe/Paris': 'UTC+1',
  'Europe/Berlin': 'UTC+1',
  'Europe/Moscow': 'UTC+3',
  'America/New_York': 'UTC-5',
  'America/Chicago': 'UTC-6',
  'America/Denver': 'UTC-7',
  'America/Los_Angeles': 'UTC-8',
  'America/Toronto': 'UTC-5',
  'America/Mexico_City': 'UTC-6',
  'America/Sao_Paulo': 'UTC-3',
  'Australia/Sydney': 'UTC+11',
  'Australia/Melbourne': 'UTC+11',
  'Pacific/Auckland': 'UTC+13'
};
