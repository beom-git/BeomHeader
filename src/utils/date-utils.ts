//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : date-utils.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-11-07 01:26:12 UTC (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This file provides date and time utility functions.
//        o Date formatting utilities
//        o Timestamp generation with timezone support
//        o Timezone format conversion
//
//----------------------------------------------------------------------

import { TIMEZONE_ABBREVIATIONS, TIMEZONE_OFFSETS, TimeZoneFormat } from '../types/config.types';

/**
 * Pad number with leading zeros
 */
function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0');
}

/**
 * Get today's date in YYYY/MM/DD format with optional timezone
 */
export function getTodayFormatted(timeZone?: string): string {
  const date = new Date();
  const dateStr = date.toLocaleString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timeZone || 'UTC'
  });
  
  return dateStr.replace(/-/g, '/');
}

/**
 * Get current timestamp in YYYY-MM-DD HH:MM:SS format with optional timezone
 */
export function getCurrentTimestamp(timeZone?: string): string {
  const date = new Date();
  const dateTimeStr = date.toLocaleString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timeZone || 'UTC'
  });
  
  // Convert "YYYY-MM-DD, HH:MM:SS" to "YYYY-MM-DD HH:MM:SS"
  return dateTimeStr.replace(',', '');
}

/**
 * Get current year as string
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

/**
 * Format date according to specified pattern
 */
export function formatDate(date: Date, pattern: string): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return pattern
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Check if a year string is valid
 */
export function isValidYear(year: string): boolean {
  const yearNum = parseInt(year);
  return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= new Date().getFullYear() + 10;
}

/**
 * Get timezone display string based on format preference
 */
export function getTimeZoneDisplay(timeZone: string, format: TimeZoneFormat): string {
  switch (format) {
    case 'abbreviation':
      return TIMEZONE_ABBREVIATIONS[timeZone] || timeZone;
    case 'full':
      return timeZone;
    case 'offset':
      return TIMEZONE_OFFSETS[timeZone] || 'UTC+0';
    default:
      return timeZone;
  }
}

/**
 * Get current timestamp with formatted timezone display
 */
export function getCurrentTimestampWithTZ(
  timeZone: string = 'UTC',
  format: TimeZoneFormat = 'abbreviation'
): string {
  const timestamp = getCurrentTimestamp(timeZone);
  const tzDisplay = getTimeZoneDisplay(timeZone, format);
  return `${timestamp} ${tzDisplay}`;
}
