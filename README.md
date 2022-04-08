<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

![Test](https://github.com/ngneat/hotkeys/workflows/Test/badge.svg)
[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

> Shortcut like a pro!

A declarative library for handling hotkeys in Angular applications.

Web apps are getting closer and closer to be desktop-class applications. With this in mind, it makes sense to add hotkeys for those power users that are looking to navigate their favorite websites using hotkeys just as they do on their regular native apps. To help you have a better experience we developed Hotkeys.

## Features

- ✅ Support Element Scope
- ✅ Support Global Listeners
- ✅ Platform Agnostic
- ✅ Hotkeys Cheatsheet

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)

## Installation

`npm install @ngneat/hotkeys`

## Usage

Add `HotkeysModule` in your `AppModule`:

```ts
import { HotkeysModule } from '@ngneat/hotkeys';

@NgModule({
  imports: [HotkeysModule]
})
export class AppModule {}
```

Now you have two ways to start adding shortcuts to your application:

## Hotkeys Directive

```html
<input hotkeys="meta.a" (hotkey)="handleHotkey($event)" />
```

> Hotkeys take care of transforming keys from macOS to Linux and Windows and vice-versa.

Additionally, the directive accepts three more `input`s:

- `hotkeysGroup` - define the group name.
- `hotkeysDescription` - add a description.
- `hotkeysOptions` - See [Options](#options)
- `isSequence` - indicate hotkey is a sequence of keys.

For example:

<!-- prettier-ignore -->
```html
<input hotkeys="meta.n" 
      hotkeysGroup="File" 
      hotkeysDescription="New Document" 
      (hotkey)="handleHotkey($event)"
```
Example sequence hotkey:
```html
<input hotkeys="g>i" 
      hotkeysGroup="Navigate" 
      hotkeysDescription="Go to Inbox" 
      (hotkey)="handleHotkey($event)"
```
## Hotkeys Service

This is a global service that can be injected anywhere:

```ts
import { HotkeysService } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private hotkeys: HotkeysService) {}

  ngOnInit() {
    this.hotkeys.addShortcut({ keys: 'meta.a' }).subscribe(e => console.log('Hotkey', e));
    this.hotkeys.addSequenceShortcut({ keys: 'g>i' }).subscribe(e => console.log('Hotkey', e));
  }
}
```

### Options

There are additional properties we can provide:

```ts
interface Options {
  // The group name
  group: string;
  // hotkey target element (defaults to `document`)
  element: HTMLElement;
  // The type of event (defaults to `keydown`)
  trigger: 'keydown' | 'keyup';
  // Allow input, textarea and select as key event sources (defaults to []).
  // It can be 'INPUT', 'TEXTAREA' or 'SELECT'.
  allowIn: AllowInElement[];
  // hotkey description
  description: string;
  // Included in the shortcut list to be display in the help dialog (defaults to `true`)
  showInHelpMenu: boolean;
  // Whether to prevent the default behavior of the event. (defaults to `true`)
  preventDefault: boolean;
}
```

#### `onShortcut`

Listen to any registered hotkey. For example:

```ts
const unsubscribe = this.hotkeys.onShortcut((event, key, target) => console.log('callback', key));

// When you're done listening, unsubscribe
unsubscribe();
```

#### `registerHelpModal`

Display a help dialog listing all visible hotkeys:

```ts
import { MatDialog } from '@angular/material/dialog';
import { HotkeysHelpComponent, HotkeysService } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private hotkeys: HotkeysService, private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.hotkeys.registerHelpModal(() => {
      const ref = this.dialog.open(HotkeysHelpComponent, { width: '500px' });
      ref.componentInstance.dimiss.subscribe(() => ref.close());
    });
  }
}
```

It accepts a second input that allows defining the hotkey that should open the dialog. The default shortcut is `Shift + ?`. Here's how `HotkeysHelpComponent` looks like:

<p align="center">
 <img width="50%" height="50%" src="./help_screenshot.png">
</p>

You can also provide a custom component. To help you with that, the service exposes the `getShortcuts` method.

#### `removeShortcuts`

Remove previously registered shortcuts.

```ts
// Remove a single shortcut
this.hotkeys.removeShortcuts('meta.a');
// Remove several shortcuts
this.hotkeys.removeShortcuts(['meta.1', 'meta.2']);
```

#### `setSequenceDebounce`

Set the number of milliseconds to debounce a sequence of keys

```ts
this.hotkeys.setSequenceDebounce(500);
```

## Hotkeys Shortcut Pipe

The `hotkeysShortcut` formats the shortcuts when presenting them in a custom help screen:

```html
<div class="help-dialog-shortcut-key">
  <kbd [innerHTML]="hotkey.keys | hotkeysShortcut"></kbd>
</div>
```

The pipe accepts and additional parameter the way key combinations are separated. By default, the separator is `+`. In the following example, a `-` is used as separator.

```html
<div class="help-dialog-shortcut-key">
  <kbd [innerHTML]="hotkey.keys | hotkeysShortcut: '-'"></kbd>
</div>
```

## Allowing hotkeys in form elements

By default, the library prevents hotkey callbacks from firing when their event originates from an `input`, `select`, or `textarea` element. To enable hotkeys in these elements, specify them in the `allowIn` parameter:

```ts
import { HotkeysService } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private hotkeys: HotkeysService) {}

  ngOnInit() {
    this.hotkeys
      .addShortcut({ keys: 'meta.a', allowIn: ['INPUT', 'SELECT', 'TEXTAREA'] })
      .subscribe(e => console.log('Hotkey', e));
  }
}
```

It's possible to enable them in the template as well:

<!-- prettier-ignore -->
```html
<input hotkeys="meta.n" 
      hotkeysGroup="File" 
      hotkeysDescription="New Document" 
      hotkeysOptions="{allowIn: ['INPUT','SELECT', 'TEXTAREA']}" 
      (hotkey)="handleHotkey($event)"
```

That's all for now! Make sure to check out the `playground` inside the `src` [folder](https://github.com/ngneat/hotkeys/tree/master/src/app).

## FAQ

**Can I define duplicated hotkeys?**

No. It's not possible to define a hotkey multiple times. Each hotkey has a description and a group, so it doesn't make sense assigning a hotkey to different actions.

**Why am I not receiving any event?**

If you've added a hotkey to a particular element of your DOM, make sure it's focusable. Otherwise, hotkeys cannot capture any keyboard event.

## How to ...

**Listening to the same shortcut in different places.**

You can always use `onShortcut`. This method allows listening to all registered hotkeys without affecting the original definition.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://carlosvilacha.com"><img src="https://avatars3.githubusercontent.com/u/1565222?v=4" width="100px;" alt=""/><br /><sub><b>Carlos Vilacha</b></sub></a><br /><a href="https://github.com/@ngneat/hotkeys/commits?author=flatstadt" title="Code">💻</a> <a href="#content-flatstadt" title="Content">🖋</a> <a href="https://github.com/@ngneat/hotkeys/commits?author=flatstadt" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="#blog-NetanelBasal" title="Blogposts">📝</a> <a href="https://github.com/@ngneat/hotkeys/commits?author=NetanelBasal" title="Code">💻</a> <a href="https://github.com/@ngneat/hotkeys/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/alvaromartmart"><img src="https://avatars1.githubusercontent.com/u/18287793?s=120&v=4" width="100px;" alt=""/><br /><sub><b>Álvaro Martínez</b></sub></a><br /><a href="https://github.com/@ngneat/hotkeys/commits?author=alvaromartmart" title="Code">💻</a> <a href="https://github.com/@ngneat/hotkeys/commits?author=alvaromartmart" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
