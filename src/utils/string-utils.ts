//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : string-utils.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file contains string manipulation utility functions.
//        o String formatting and manipulation
//        o Template interpolation
//        o Regular expression utilities
//
//----------------------------------------------------------------------

/**
 * Pad a number with leading zeros
 */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Simple template interpolation for placeholders like ${key}
 */
export function interpolateTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] ?? '');
}

/**
 * Generate separator line with specified character and length
 */
export function generateSeparator(char: string, length: number): string {
  return char.repeat(length);
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+/.test(url);
}

/**
 * Validate identifier format (letters, numbers, hyphens, underscores)
 */
export function isValidIdentifier(identifier: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(identifier);
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove extra whitespace and normalize line endings
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}
