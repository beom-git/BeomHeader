//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : validation-utils.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file provides input validation utility functions.
//        o Input validation for various fields
//        o Error message generation
//
//----------------------------------------------------------------------

import { isValidEmail, isValidUrl, isValidIdentifier } from './string-utils';
import { isValidYear } from './date-utils';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validate language ID input
 */
export function validateLanguageId(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, errorMessage: 'Language ID cannot be empty' };
  }
  
  if (!isValidIdentifier(value)) {
    return { 
      isValid: false, 
      errorMessage: 'Language ID should contain only letters, numbers, hyphens, and underscores' 
    };
  }
  
  return { isValid: true };
}

/**
 * Validate comment token input
 */
export function validateCommentToken(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, errorMessage: 'Comment token cannot be empty' };
  }
  
  return { isValid: true };
}

/**
 * Validate email address input
 */
export function validateEmail(value: string): ValidationResult {
  if (value && !isValidEmail(value)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Validate URL input
 */
export function validateUrl(value: string): ValidationResult {
  if (value && !isValidUrl(value)) {
    return { isValid: false, errorMessage: 'Please enter a valid HTTP or HTTPS URL' };
  }
  
  return { isValid: true };
}

/**
 * Validate copyright notice input
 */
export function validateCopyrightNotice(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, errorMessage: 'Copyright notice cannot be empty' };
  }
  
  return { isValid: true };
}

/**
 * Validate project description input
 */
export function validateProjectDescription(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, errorMessage: 'Project description cannot be empty' };
  }
  
  return { isValid: true };
}

/**
 * Validate separator length input
 */
export function validateSeparatorLength(value: string): ValidationResult {
  const num = parseInt(value);
  if (isNaN(num) || num < 10 || num > 200) {
    return { isValid: false, errorMessage: 'Please enter a number between 10 and 200' };
  }
  
  return { isValid: true };
}

/**
 * Validate year input
 */
export function validateYearInput(value: string): ValidationResult {
  if (!isValidYear(value)) {
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid year between 1900 and current year + 10' 
    };
  }
  
  return { isValid: true };
}
