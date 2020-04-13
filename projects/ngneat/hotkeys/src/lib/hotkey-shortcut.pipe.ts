import { Pipe, PipeTransform } from '@angular/core';

const symbols = {
  meta: '&#8984;', // ⌘
  shift: '&#8679;', // ⇧
  left: '&#8592;', // ←
  right: '&#8594;', // →
  up: '&#8593;', // ↑
  down: '&#8595;' // ↓
};

@Pipe({
  name: 'hotkeyShortcut'
})
export class HotkeyShortcutPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return '';
    }
    return value
      .split('.')
      .map(c => c.toLowerCase())
      .map(c => symbols[c] || c.toUpperCase())
      .join('');
  }
}
