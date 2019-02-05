# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Fixed
 - Upgrade dependencies.

## 0.2.2 - 2018-07-20 - Fixed false-positives for accepted hardcoded color values

### Fixed
 - Whitelist colour values `"transparent"`, `null` and `undefined`.

## 0.2.1 - 2018-07-20 - Added no-unknown colors to `use-tokens`

### Added
 - Added error for unknow color when using `use-tokens` rule.

## 0.2.0 - 2018-07-16 - Removed `auto-import-tokens` rule and added `use-components` rule

### Added

- Added `use-components' rule.

### Removed

- Removed `auto-import-tokens` rule and merged it as part of the `use-tokens` rule.

## 0.1.1 - 2018-07-10 - Fixed `auto-import-tokens` to handle config correctly

### Fixed

- Fixed `auto-import-tokens` to correctly parse different configs for different folders.

## 0.1.0 - 2018-07-03 - Auto import and support for more tokens

### Added

- Added `auto-import-tokens` rule.
- `use-tokens` rule now works with lengths.

## 0.0.1 - 2018-06-14 - Initial release

### Added

- Initial support for Backpack colours
