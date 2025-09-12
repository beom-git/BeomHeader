//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : date-utils.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-12 07:26:30 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This file provides date and time utility functions.
//        o Date formatting utilities
//        o Timestamp generation
//
//----------------------------------------------------------------------

/**
 * Get today's date in YYYY/MM/DD format
 */
export function getTodayFormatted(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '/');
}

/**
 * Get current timestamp in YYYY-MM-DD HH:MM:SS format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
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
