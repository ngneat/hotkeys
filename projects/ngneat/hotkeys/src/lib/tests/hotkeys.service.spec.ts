import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Hotkey, HotkeysService } from '@ngneat/hotkeys';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import * as Platform from '../utils/platform';

import createSpy = jasmine.createSpy;
// TODO: Use Spectator to trigger keyboard events
describe('Service: Hotkeys', () => {
  let spectator: SpectatorService<HotkeysService>;
  const createService = createServiceFactory(HotkeysService);

  beforeEach(() => (spectator = createService()));

  it('should add shortcut', () => {
    spectator.service.addShortcut({ keys: 'a' }).subscribe();
    expect(spectator.service.getHotkeys().length).toBe(1);
  });

  it('should remove shortcut', () => {
    spectator.service.addShortcut({ keys: 'meta.a' });
    spectator.service.addShortcut({ keys: 'meta.b' });
    spectator.service.addShortcut({ keys: 'meta.c' });
    spectator.service.removeShortcuts(['meta.a', 'meta.b']);
    spectator.service.removeShortcuts('meta.c');
    expect(spectator.service.getHotkeys().length).toBe(0);
    const spy = spyOn(console, 'warn');
    spectator.service.removeShortcuts('meta.c');
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe shortcuts when removed', () => {
    const subscription = spectator.service.addShortcut({ keys: 'meta.a' }).subscribe();
    spectator.service.removeShortcuts('meta.a');
    expect(subscription.closed).toBe(true);
  });

  it('should delete hotkey and disposer when unsubscribed', () => {
    spectator.service
      .addShortcut({ keys: 'meta.a' })
      .subscribe()
      .unsubscribe();
    expect(spectator.service.getHotkeys().length).toBe(0);
    expect(spectator.service['disposers'].has('meta.a')).toBe(false);
  });

  it('should listen to keydown', () => {
    const spyFcn = createSpy('subscribe', e => {});
    spectator.service.addShortcut({ keys: 'a' }).subscribe(spyFcn);
    fakeKeyboardPress('a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should listen to keyup', () => {
    const spyFcn = createSpy('subscribe', e => {});
    spectator.service.addShortcut({ keys: 'a', trigger: 'keyup' }).subscribe(spyFcn);
    fakeKeyboardPress('a', 'keyup');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should call callback', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator.service.addShortcut({ keys: 'a' }).subscribe();
    spectator.service.onShortcut(spyFcn);
    fakeKeyboardPress('a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should honor target element', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator.service.addShortcut({ keys: 'a', element: document.body }).subscribe(spyFcn);
    fakeBodyKeyboardPress('a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should change meta to ctrl', () => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    spectator.service.addShortcut({ keys: 'meta.a' }).subscribe();
    const shortcuts = spectator.service.getShortcuts();
    expect(shortcuts[0].hotkeys[0].keys).toBe('control.a');
  });

  it('should exclude shortcut', () => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    spectator.service.addShortcut({ keys: 'meta.a', showInHelpMenu: false }).subscribe();
    const shortcuts = spectator.service.getShortcuts();
    expect(shortcuts.length).toBe(0);
  });

  it('should use defaults', () => {
    spectator.service.addShortcut({ keys: 'a' }).subscribe();
    const hks = spectator.service.getHotkeys();
    expect(hks[0]).toEqual({
      element: document.documentElement,
      showInHelpMenu: true,
      allowIn: [],
      keys: 'a',
      trigger: 'keydown',
      group: undefined,
      description: undefined,
      preventDefault: true
    });
  });

  it('should use options', () => {
    const options: Hotkey = {
      element: document.body,
      showInHelpMenu: false,
      allowIn: [],
      keys: 'a',
      trigger: 'keydown',
      group: 'test group',
      description: 'test description',
      preventDefault: false
    };

    spectator.service.addShortcut(options).subscribe();
    const hks = spectator.service.getHotkeys();
    expect(hks[0]).toEqual(options);
  });

  it('should return shortcut', () => {
    const options: Hotkey = {
      showInHelpMenu: true,
      keys: 'a',
      group: 'test group',
      description: 'test description'
    };

    spectator.service.addShortcut(options).subscribe();
    const scts = spectator.service.getShortcuts();
    expect(scts[0]).toEqual({
      group: 'test group',
      hotkeys: [
        {
          keys: 'a',
          description: 'test description'
        }
      ]
    });
  });
});

function fakeKeyboardPress(key: string, type = 'keydown') {
  const html = TestBed.inject(DOCUMENT).documentElement;
  html.dispatchEvent(new KeyboardEvent(type, { key }));
}

function fakeBodyKeyboardPress(key: string, type = 'keydown') {
  const html = TestBed.inject(DOCUMENT).body;
  html.dispatchEvent(new KeyboardEvent(type, { key }));
}
