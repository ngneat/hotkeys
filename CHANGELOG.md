# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/ngneat/hotkeys/compare/v2.0.0...v4.0.0) (2024-03-20)


### ⚠ BREAKING CHANGES

* Angular v17 is required
* **dependencies:** **

### Bug Fixes

* **dependencies:** removing @ng-bootstrap/ng-bootstrap ([ef30dec](https://github.com/ngneat/hotkeys/commit/ef30dec1c2ae42f17789be84272269c46291cb6d)), closes [#89](https://github.com/ngneat/hotkeys/issues/89)
* **release:** bump all dependencies to latest ([17f74c6](https://github.com/ngneat/hotkeys/commit/17f74c60567e16248af7c6f9dd6a537559663929))
* **release:** update to angular 17 and bump all dependencies to latest ([26a6048](https://github.com/ngneat/hotkeys/commit/26a6048b33f1c3a75b870253b7dc69377fae9151))
* **release:** update to angular 17 and bump all dependencies to latest ([5323d0c](https://github.com/ngneat/hotkeys/commit/5323d0cbc38279a2a502f794a3c278a32d80adbb))
* **release:** update to angular 17 and bump all dependencies to latest ([234edd9](https://github.com/ngneat/hotkeys/commit/234edd98c864ce3f8978f1f0f92ef425368a6f7f))
* **release:** update to angular 17 and bump all dependencies to latest ([3d17db6](https://github.com/ngneat/hotkeys/commit/3d17db65d74312aff7c8f710c52104d73131ff9f))


* Merge pull request #91 from Pilpin/master ([1ff0709](https://github.com/ngneat/hotkeys/commit/1ff0709a83b8edf97c6d6b7de59e4514d3353797)), closes [#91](https://github.com/ngneat/hotkeys/issues/91)

## [2.0.0](https://github.com/ngneat/hotkeys/compare/v1.2.0...v2.0.0) (2023-09-11)


### ⚠ BREAKING CHANGES

* 🧨 Replaced @angular/material with @ng-bootstrap/ng-bootstrap
* `dimiss` property has been renamed to `dismiss` in help component.

### Features

* ignore contentEditable elements ([4185015](https://github.com/ngneat/hotkeys/commit/4185015fb21e22f7f69ec7c885aafac5b2778a32))
* upgrade all deps ([bf602dc](https://github.com/ngneat/hotkeys/commit/bf602dcd21750820c24f7c427763cf6e12cad126))
* upgrade to 16 ([b2c839e](https://github.com/ngneat/hotkeys/commit/b2c839eb97a4d4348ecf39ace89ad16d143c2b46))
* upgrade to angular 15 ([e66128f](https://github.com/ngneat/hotkeys/commit/e66128f5e2a314474feb38c828bf216eaf9fa8ee))


### Bug Fixes

* added unit test ([f6d326c](https://github.com/ngneat/hotkeys/commit/f6d326cb515c651567f387fc0a21987f2edea785))
* change property `dimiss` to `dismiss` in help component output ([c4c69f1](https://github.com/ngneat/hotkeys/commit/c4c69f1b649dc7a666325a5c030f98c3aaa01b90))
* remove empty sequence map entry ([e66063e](https://github.com/ngneat/hotkeys/commit/e66063e735c92977d5c4afa213284eeaaa0a5458))
* tests ([6354acf](https://github.com/ngneat/hotkeys/commit/6354acfdbfe2c8b255dbd5bd04c601b2f929c130))
* update node.js version ([0da82aa](https://github.com/ngneat/hotkeys/commit/0da82aac30d45dfc6074d8fe22100418d2dca5ff))


* 💡 Remove Angular  material and use bootstrap ([bc7be48](https://github.com/ngneat/hotkeys/commit/bc7be48bbd72780752265e5e038c427b3a6e853c)), closes [#83](https://github.com/ngneat/hotkeys/issues/83)

## [1.3.0](https://github.com/ngneat/hotkeys/compare/v1.2.0...v1.3.0) (2022-06-10)


### Features

* ignore contentEditable elements ([4185015](https://github.com/ngneat/hotkeys/commit/4185015fb21e22f7f69ec7c885aafac5b2778a32))


### Bug Fixes

* added unit test ([f6d326c](https://github.com/ngneat/hotkeys/commit/f6d326cb515c651567f387fc0a21987f2edea785))
* remove empty sequence map entry ([e66063e](https://github.com/ngneat/hotkeys/commit/e66063e735c92977d5c4afa213284eeaaa0a5458))
* update node.js version ([0da82aa](https://github.com/ngneat/hotkeys/commit/0da82aac30d45dfc6074d8fe22100418d2dca5ff))

## [1.2.0](https://github.com/ngneat/hotkeys/compare/v1.1.4...v1.2.0) (2022-04-09)


### Features

* support ctrl,alt,shift for sequence hotkey ([ac0f78d](https://github.com/ngneat/hotkeys/commit/ac0f78d5ff25ec4e0117c9f47de0ce598bc52418))
* support for sequence hotkeys added ([fcdcdbd](https://github.com/ngneat/hotkeys/commit/fcdcdbd5403e9bd21b832fd9a90abb88fc6b5d5b))


### Bug Fixes

* arrow keys mapping to keycodes ([a772d84](https://github.com/ngneat/hotkeys/commit/a772d843efdb2ff7775e18f3a4aa6e83f6320d4e))


### Tests

* updated specs ([5acfe1b](https://github.com/ngneat/hotkeys/commit/5acfe1b0918e0d414c2f86e98f1511ccca06719e))

### [1.1.4](https://github.com/ngneat/hotkeys/compare/v1.1.3...v1.1.4) (2021-07-29)


### Bug Fixes

* dispose EventManager when unsubscribed ([91083c6](https://github.com/ngneat/hotkeys/commit/91083c6fc735f60e0851fcabba69bc373c5f90e2))

### [1.1.3](https://github.com/ngneat/hotkeys/compare/v1.1.2...v1.1.3) (2021-07-26)


### Bug Fixes

* unsubscribe shortcuts when removed ([1e2aba3](https://github.com/ngneat/hotkeys/commit/1e2aba3bb5256231ef1542aceb7744298888ec4c))
* use single subject ([91d9ad8](https://github.com/ngneat/hotkeys/commit/91d9ad8409df0989ad7f94be9299d188cabbf6db))

### [1.1.2](https://github.com/ngneat/hotkeys/compare/v1.1.1...v1.1.2) (2021-01-02)


### Bug Fixes

* 🐛 remove peer deps ([b54f358](https://github.com/ngneat/hotkeys/commit/b54f3589ea8dcd1fafe8b115f9f4d84b9691d216))

### [1.1.1](https://github.com/ngneat/hotkeys/compare/v1.1.0...v1.1.1) (2020-06-29)


### Bug Fixes

* filter form elements events ([9f955eb](https://github.com/ngneat/hotkeys/commit/9f955eb7498913f96111710e5b1c8a5f0fe58e9f))
* inefficiencies ([c047201](https://github.com/ngneat/hotkeys/commit/c047201b5900d034111ec6e560227bdb5d6dcb77))

## [1.1.0](https://github.com/ngneat/hotkeys/compare/v1.0.1...v1.1.0) (2020-06-14)


### Features

* add HotkeyService.removeShortcuts ([#6](https://github.com/ngneat/hotkeys/issues/6)) ([b0af8e0](https://github.com/ngneat/hotkeys/commit/b0af8e0e25405a823344184c476c7138d27282ed))

### [1.0.1](https://github.com/ngneat/hotkeys/compare/v1.0.0...v1.0.1) (2020-05-13)


### Bug Fixes

* 🐛 remove material ([6d39222](https://github.com/ngneat/hotkeys/commit/6d3922297fc071ce72baa681e3d5789c4e2b4e10))

## 1.0.0 (2020-04-24)
