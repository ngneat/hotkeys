import { fakeAsync } from '@angular/core/testing';
import { HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { createPipeFactory } from '@ngneat/spectator';

import * as Platform from '../utils/platform';

describe('Pipe: Hotkeys Shortcut', () => {
  const createPipe = createPipeFactory(HotkeysShortcutPipe);

  it('should format hotkey with lowercase', fakeAsync(() => {
    const spectator = createPipe(`{{ 'R' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('r');
  }));

  it('should format hotkey with enter', fakeAsync(() => {
    const spectator = createPipe(`{{ 'enter.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('&#8996; + r');
  }));

  it('should format hotkey with apple Command', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('apple');
    const spectator = createPipe(`{{ 'meta.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('&#8984; + r');
  }));

  it('should format hotkey with apple Option', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('apple');
    const spectator = createPipe(`{{ 'altleft.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('&#8997; + r');
  }));

  it('should format hotkey with apple Escape', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('apple');
    const spectator = createPipe(`{{ 'escape.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('&#9099; + r');
  }));

  it('should format hotkey with pc Ctrl', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    const spectator = createPipe(`{{ 'control.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('Ctrl + r');
  }));

  it('should format hotkey with pc Alt', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    const spectator = createPipe(`{{ 'altleft.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('Alt + r');
  }));

  it('should format hotkey with pc Escape', fakeAsync(() => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    const spectator = createPipe(`{{ 'escape.r' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('Esc + r');
  }));

  it('should format hotkey with custom separator', fakeAsync(() => {
    const spectator = createPipe(`{{ 'shift.r' | hotkeysShortcut : '#'}}`);
    expect(spectator.element).toHaveText('&#8679;#r');
  }));
});
