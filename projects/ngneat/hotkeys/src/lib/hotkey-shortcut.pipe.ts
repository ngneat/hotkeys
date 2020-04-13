import { Pipe, PipeTransform } from '@angular/core';

const applePlatformSymbols = {
  meta: '&#8984;',
  shift: '&#8679;',
  altleft: '&#8997;',
  control: '&#8963;',
  backspace: '&#9003;',
  escape: '&#9099;',
  tab: '&#8677;',
  space: '&#9251;',
  left: '&#8592;',
  right: '&#8594;',
  up: '&#8593;',
  down: '&#8595;',
  enter: '&#8996;'
};

const pcPlatformSymbols = {
  meta: 'Ctrl',
  shift: '&#8679;',
  altleft: 'Alt',
  control: '&#8963;',
  backspace: '&#9003;',
  escape: 'Esc',
  tab: '&#8677;',
  space: '&#9251;',
  left: '&#8592;',
  right: '&#8594;',
  up: '&#8593;',
  down: '&#8595;',
  enter: '&#8996;'
};

/* &#63743;              Apple
&#8984;         ⌘      Command, Cmd, Clover, (formerly) Apple
&#8963;         ⌃      Control, Ctl, Ctrl
&#8997;         ⌥      Option, Opt, (Windows) Alt
&#8679;         ⇧      Shift
&#8682;         ⇪      Caps lock
&#9167;         ⏏      Eject
&#8617;         ↩      Return, Carriage Return
&#8629; &crarr; ↵      Return, Carriage Return
&#9166;         ⏎      Return, Carriage Return
&#8996;         ⌤      Enter
&#9003;         ⌫      Delete, Backspace
&#8998;         ⌦      Forward Delete
&#9099;         ⎋      Escape, Esc
&#8594; &rarr;  →      Right arrow
&#8592; &larr;  ←      Left arrow
&#8593; &uarr;  ↑      Up arrow
&#8595; &darr;  ↓      Down arrow
&#8670;         ⇞      Page Up, PgUp
&#8671;         ⇟      Page Down, PgDn
&#8598;         ↖      Home
&#8600;         ↘      End
&#8999;         ⌧      Clear
&#8677;         ⇥      Tab, Tab Right, Horizontal Tab
&#8676;         ⇤      Shift Tab, Tab Left, Back-tab
&#9250;         ␢      Space, Blank
&#9251;         **␣**  Space, Blank
 */

@Pipe({
  name: 'hotkeyShortcut'
})
export class HotkeyShortcutPipe implements PipeTransform {
  private readonly symbols;
  private appleDevices = ['Mac', 'iPhone', 'iPad', 'iPhone'];

  constructor() {
    this.symbols = this.appleDevices.some(d => navigator.platform.includes(d))
      ? applePlatformSymbols
      : pcPlatformSymbols;
  }

  transform(value: string): any {
    if (!value) {
      return '';
    }
    return value
      .split('.')
      .map(c => c.toLowerCase())
      .map(c => this.symbols[c] || c)
      .join(' ');
  }
}
