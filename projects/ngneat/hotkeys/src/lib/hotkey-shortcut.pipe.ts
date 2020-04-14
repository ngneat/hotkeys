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
  control: 'Ctrl',
  shift: '&#8679;',
  altleft: 'Alt',
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
