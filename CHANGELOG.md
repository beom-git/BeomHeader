# Change Log

All notable changes to the "beom-header" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [3.0.0] - 2025-09-08

### Added
- **Complete Architecture Refactoring**: Modular design with separated concerns for better maintainability
- **Organized Code Structure**: New directory structure with `core/`, `utils/`, `types/`, and `assets/` modules
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions throughout
- **Auto-Update System**: Redesigned with strategy pattern for extensible update logic
- **Command Separation**: Organized commands into logical groups (header, config, management)
- **Template Manager**: Centralized template loading and management from secure JSON files
- **Variable Resolver**: Advanced variable resolution with type-safe processing
- **Enhanced Language Support**: Extended comment token mappings for 60+ programming languages
- **Configuration Commands**: 25+ configuration options with dedicated command interface
- **Toggle Commands**: Easy toggle functionality for all boolean settings
- **Language Management**: Add, remove, and list language comment token mappings
- **Header Style Selection**: Multiple header templates (standard, minimal, detailed)
- **Secure Asset Management**: Protected template storage in `src/assets/templates/`
- **Comprehensive Error Handling**: Improved validation and error reporting throughout
- **Performance Optimizations**: Efficient template processing and variable resolution

### Changed
- **Function Naming**: Unified naming conventions (e.g., `interpolate()` → `interpolateTemplate()`)
- **Template System**: Migrated from embedded templates to secure JSON-based system
- **Command Organization**: Separated commands into logical modules (header, config, management)
- **Auto-Update Logic**: Strategy-based system replacing previous hardcoded approach
- **Configuration Structure**: Enhanced settings with better organization and validation
- **Extension Entry Point**: Simplified `extension.ts` with modular initialization
- **Type Definitions**: Comprehensive TypeScript interfaces replacing loose typing
- **Documentation**: Complete README.md update reflecting v3.0 architecture

### Removed
- **Legacy Files**: Removed outdated `templateManager.ts`, `headerTemplate.ts`
- **Old Template System**: Removed embedded template strings in favor of JSON files
- **Unused Dependencies**: Cleaned up unnecessary imports and dependencies
- **Deprecated Functions**: Removed old function implementations after refactoring

### Fixed
- **TypeScript Compilation**: All compilation errors resolved with proper type definitions
- **Template Processing**: Improved template variable resolution and error handling
- **Command Registration**: Proper command organization and registration
- **File Path Handling**: Better absolute and relative path processing
- **Language Detection**: Enhanced language ID to comment token mapping
- **GitHub Actions**: Updated Node.js version and vsce usage for better compatibility
- **Package Dependencies**: Added @vscode/vsce to devDependencies for reliable publishing

### Security
- **Template Storage**: Secure JSON-based template system with validation
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Boundaries**: Proper error handling to prevent extension crashes

## [2.0.0] - Previous Version

### Added
- Basic header insertion functionality
- Version entry management
- TODO entry management
- Basic configuration options
- Language comment token support

## [1.0.0] - Initial Release

### Added
- Initial extension framework
- Basic file header generation
- Simple template system