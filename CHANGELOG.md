# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 4.0.0

- Drops support for Node versions < 16. No new functionality is introduced, but from this point forwards it should not be assumed Node 12 will work.

## 3.0.1

### Fixed
  - Reverted `3.0.0` and re-added `bpk-tokens` as a project dependency.

## 3.0.0

### Breaking
  - Moved `bpk-tokens` to peer dependencies, so that version required in projects do not mismatch with project required versions.

## 2.0.3
  - Upgraded `bpk-tokens` dependency.

## 2.0.2

### Fixed
  - Upgraded `bpk-tokens` dependency.

## 2.0.1 - Upgrade lodash dependency

### Fixed
  - Upgraded `lodash` dependency.

## 2.0.0 - Support for web components

### Breaking
- `use-components` now takes a `platform` option. The possible options are `web` (default) and `native`. This is breaking because previous users of this rule will need to add `platform: 'native'` to their config.

### Added
- `use-components` now works with web components too.

## 1.1.0 - 2020-06-16 - New component rules
- Added new `use-component` rules for React Native components
  - `BpkFlatList`, `BpkPicker`, `BpkSectionList`, `BpkSwitch`, `BpkTextInput`


## 1.0.1 - 2020-05-26 - Moved Snyk dep
  - Moved Snyk dependency to devDeps

## 1.0.0 - 2020-03-23 - Upgrade dependencies and add Node 12 support

### Breaking
  - Upgraded to support Node 12

### Fixed
  - Upgrade dependencies.

## 0.2.3 - 2019-02-05 - Upgrade deps

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
