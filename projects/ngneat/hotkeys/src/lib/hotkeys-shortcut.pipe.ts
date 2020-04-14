import { Pipe, PipeTransform } from '@angular/core';
import { hostPlatform } from './utils/platform';

const symbols = {
  shift: '&#8679;',
  backspace: '&#9003;',
  tab: '&#8677;',
  space: '&#9251;',
  left: '&#8592;',
  right: '&#8594;',
  up: '&#8593;',
  down: '&#8595;',
  enter: '&#8996;'
};


const appleSymbols = {
  meta: '&#8984;',
  altleft: '&#8997;',
  control: '&#8963;',
  escape: '&#9099;',
};

const pcSymbols = {
  control: 'Ctrl',
  altleft: 'Alt',
  escape: 'Esc',
};

@Pipe({
  name: 'hotkeyShortcut'
})
export class HotkeyShortcutPipe implements PipeTransform {
  private readonly symbols;
  constructor() {
    const platform = hostPlatform();
    this.symbols = platform === 'apple' ? {...symbols, ...appleSymbols} : {...symbols, ...pcSymbols};
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
