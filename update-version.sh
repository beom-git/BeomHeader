#!/bin/bash

# Beom Header Version Update Script
# This script automatically increments version numbers in package.json and README.md

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Files to update
PACKAGE_JSON="package.json"
README_MD="README.md"

# Backup suffix
BACKUP_SUFFIX=".backup"

echo -e "${BLUE}🚀 Beom Header Version Update Script${NC}"
echo "=================================="

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to validate version format
validate_version() {
    local version=$1
    if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid version format: $version (expected: x.y.z)"
        return 1
    fi
    return 0
}

# Function to increment version
increment_version() {
    local version=$1
    local increment_type=$2
    
    IFS='.' read -r major minor patch <<< "$version"
    
    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch"|*)
            patch=$((patch + 1))
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Function to get current version from package.json
get_package_version() {
    grep '"version"' "$PACKAGE_JSON" | sed 's/.*"version": *"\([^"]*\)".*/\1/'
}

# Function to create backup
create_backup() {
    local file=$1
    cp "$file" "${file}${BACKUP_SUFFIX}"
    print_info "Created backup: ${file}${BACKUP_SUFFIX}"
}

# Function to update package.json version
update_package_json() {
    local old_version=$1
    local new_version=$2
    
    print_info "Updating $PACKAGE_JSON: $old_version → $new_version"
    
    # Create backup
    create_backup "$PACKAGE_JSON"
    
    # Update version using sed
    sed -i "s/\"version\": *\"$old_version\"/\"version\": \"$new_version\"/" "$PACKAGE_JSON"
    
    # Verify update
    local updated_version=$(get_package_version)
    if [[ "$updated_version" == "$new_version" ]]; then
        print_success "Successfully updated $PACKAGE_JSON"
    else
        print_error "Failed to update $PACKAGE_JSON"
        return 1
    fi
}

# Function to update README.md version
update_readme() {
    local old_version=$1
    local new_version=$2
    
    print_info "Updating $README_MD: $old_version → $new_version"
    
    # Create backup
    create_backup "$README_MD"
    
    # Update version badge
    sed -i "s/version-$old_version-blue/version-$new_version-blue/" "$README_MD"
    
    # Update any other version references (like "What's New in v3.0")
    # This is more conservative - only update if the major version changes
    local old_major=$(echo "$old_version" | cut -d. -f1)
    local new_major=$(echo "$new_version" | cut -d. -f1)
    
    if [[ "$old_major" != "$new_major" ]]; then
        print_info "Major version changed, updating 'What's New' section"
        sed -i "s/What's New in v$old_major\./What's New in v$new_major./" "$README_MD"
    fi
    
    print_success "Successfully updated $README_MD"
}

# Function to clean up backups
cleanup_backups() {
    if [[ "$1" == "yes" ]]; then
        rm -f "${PACKAGE_JSON}${BACKUP_SUFFIX}" "${README_MD}${BACKUP_SUFFIX}"
        print_success "Cleaned up backup files"
    else
        print_info "Backup files preserved:"
        print_info "  - ${PACKAGE_JSON}${BACKUP_SUFFIX}"
        print_info "  - ${README_MD}${BACKUP_SUFFIX}"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [VERSION_TYPE] [OPTIONS]"
    echo ""
    echo "VERSION_TYPE (optional):"
    echo "  patch    - Increment patch version (x.y.Z) [default]"
    echo "  minor    - Increment minor version (x.Y.0)"
    echo "  major    - Increment major version (X.0.0)"
    echo "  x.y.z    - Set specific version"
    echo ""
    echo "OPTIONS:"
    echo "  --cleanup    - Remove backup files after successful update"
    echo "  --dry-run    - Show what would be changed without making changes"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Increment patch version"
    echo "  $0 minor              # Increment minor version"
    echo "  $0 major              # Increment major version"
    echo "  $0 3.1.5              # Set specific version"
    echo "  $0 patch --cleanup    # Increment patch and cleanup backups"
    echo "  $0 --dry-run          # Preview changes"
}

# Main execution
main() {
    # Parse arguments
    local version_type="patch"
    local cleanup=false
    local dry_run=false
    local specific_version=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_usage
                exit 0
                ;;
            --cleanup)
                cleanup=true
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            major|minor|patch)
                version_type=$1
                shift
                ;;
            [0-9]*.[0-9]*.[0-9]*)
                specific_version=$1
                validate_version "$specific_version" || exit 1
                shift
                ;;
            *)
                print_error "Unknown argument: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check if required files exist
    if [[ ! -f "$PACKAGE_JSON" ]]; then
        print_error "$PACKAGE_JSON not found"
        exit 1
    fi
    
    if [[ ! -f "$README_MD" ]]; then
        print_error "$README_MD not found"
        exit 1
    fi
    
    # Get current version
    local current_version=$(get_package_version)
    if [[ -z "$current_version" ]]; then
        print_error "Could not extract version from $PACKAGE_JSON"
        exit 1
    fi
    
    validate_version "$current_version" || exit 1
    print_info "Current version: $current_version"
    
    # Calculate new version
    local new_version
    if [[ -n "$specific_version" ]]; then
        new_version="$specific_version"
    else
        new_version=$(increment_version "$current_version" "$version_type")
    fi
    
    print_info "New version: $new_version"
    
    # Dry run mode
    if [[ "$dry_run" == true ]]; then
        print_warning "DRY RUN MODE - No files will be modified"
        echo ""
        print_info "Changes that would be made:"
        echo "  📦 $PACKAGE_JSON: \"version\": \"$current_version\" → \"version\": \"$new_version\""
        echo "  📖 $README_MD: version-$current_version-blue → version-$new_version-blue"
        
        local old_major=$(echo "$current_version" | cut -d. -f1)
        local new_major=$(echo "$new_version" | cut -d. -f1)
        if [[ "$old_major" != "$new_major" ]]; then
            echo "  📖 $README_MD: What's New in v$old_major. → What's New in v$new_major."
        fi
        exit 0
    fi
    
    # Confirm changes
    echo ""
    echo -e "${YELLOW}About to update version: $current_version → $new_version${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operation cancelled"
        exit 0
    fi
    
    # Perform updates
    echo ""
    print_info "Starting version update..."
    
    update_package_json "$current_version" "$new_version"
    update_readme "$current_version" "$new_version"
    
    echo ""
    print_success "Version update completed successfully!"
    print_info "Updated files:"
    print_info "  📦 $PACKAGE_JSON"
    print_info "  📖 $README_MD"
    
    # Cleanup backups if requested
    echo ""
    if [[ "$cleanup" == true ]]; then
        cleanup_backups "yes"
    else
        cleanup_backups "no"
        echo ""
        print_info "To remove backup files later, run:"
        print_info "  rm ${PACKAGE_JSON}${BACKUP_SUFFIX} ${README_MD}${BACKUP_SUFFIX}"
    fi
    
    echo ""
    print_success "🎉 All done! Version updated from $current_version to $new_version"
}

# Run main function with all arguments
main "$@"
