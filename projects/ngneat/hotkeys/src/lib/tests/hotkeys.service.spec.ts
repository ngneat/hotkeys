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
  });

  it('should unsubscribe shortcuts when removed', () => {
    const subscription = spectator.service.addShortcut({ keys: 'meta.a' }).subscribe();
    spectator.service.removeShortcuts('meta.a');
    expect(subscription.closed).toBe(true);
  });

  it('should delete hotkey and disposer when unsubscribed', () => {
    spectator.service.addShortcut({ keys: 'meta.a' }).subscribe().unsubscribe();
    expect(spectator.service.getHotkeys().length).toBe(0);
  });

  it('should listen to keydown', () => {
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.service.addShortcut({ keys: 'a' }).subscribe(spyFcn);
    fakeKeyboardPress('a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should not listen to keydown if hotkeys are paused, should listen again when resumed', () => {
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.service.addShortcut({ keys: 'a' }).subscribe(spyFcn);
    spectator.service.pause();
    fakeKeyboardPress('a');
    expect(spyFcn).not.toHaveBeenCalled();
    spectator.service.resume();
    fakeKeyboardPress('a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should listen to keyup', () => {
    const spyFcn = createSpy('subscribe', (e) => {});
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

  it('should not call callback when hotkeys are paused, should call again when resumed', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator.service.addShortcut({ keys: 'a' }).subscribe();
    spectator.service.onShortcut(spyFcn);

    spectator.service.pause();
    fakeKeyboardPress('a');
    expect(spyFcn).not.toHaveBeenCalled();

    spectator.service.resume();
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
      preventDefault: true,
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
      preventDefault: false,
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
      description: 'test description',
    };

    spectator.service.addShortcut(options).subscribe();
    const scts = spectator.service.getShortcuts();
    expect(scts[0]).toEqual({
      group: 'test group',
      hotkeys: [
        {
          keys: 'a',
          description: 'test description',
        },
      ],
    });
  });

  it('should listen to up', () => {
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.service.addShortcut({ keys: 'up' }).subscribe(spyFcn);
    fakeKeyboardPress('ArrowUp');
    expect(spyFcn).toHaveBeenCalled();
  });
});

describe('Service: Sequence Hotkeys', () => {
  let spectator: SpectatorService<HotkeysService>;
  const createService = createServiceFactory(HotkeysService);

  beforeEach(() => (spectator = createService()));

  it('should add shortcut', () => {
    spectator.service.addSequenceShortcut({ keys: 'g>a' }).subscribe();
    expect(spectator.service.getHotkeys().length).toBe(1);
  });

  it('should remove shortcut', () => {
    spectator.service.addSequenceShortcut({ keys: 'g>b' });
    spectator.service.addSequenceShortcut({ keys: 'g>c' });
    spectator.service.addSequenceShortcut({ keys: 'g>d' });
    spectator.service.removeShortcuts(['g>b', 'g>c']);
    spectator.service.removeShortcuts('g>d');
    expect(spectator.service.getHotkeys().length).toBe(0);
  });

  it('should unsubscribe shortcuts when removed', () => {
    const subscription = spectator.service.addSequenceShortcut({ keys: 'g>e' }).subscribe();
    spectator.service.removeShortcuts('g>e');
    expect(subscription.closed).toBe(true);
  });

  it('should delete hotkey and disposer when unsubscribed', () => {
    spectator.service.addSequenceShortcut({ keys: 'g>t' }).subscribe().unsubscribe();
    expect(spectator.service.getHotkeys().length).toBe(0);
  });

  it('should allow key sequence within allotted time', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      spectator.service.setSequenceDebounce(200);
      await sleep(250);
      const spyFcn = createSpy('subscribe', (e) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>z' }).subscribe(spyFcn);
      await fakeKeyboardSequencePress(['g', 'z'], 'keydown', 100);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should not allow key sequence outside allotted time', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      spectator.service.setSequenceDebounce(200);
      await sleep(250);
      const spyFcn = createSpy('subscribe', (e) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>z' }).subscribe(spyFcn);
      await fakeKeyboardSequencePress(['g', 'z'], 'keydown', 250);
      await sleep(200);
      expect(spyFcn).not.toHaveBeenCalled();
    };

    return run();
  });

  it('should listen to keydown', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (e) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>f' }).subscribe(spyFcn);
      fakeKeyboardSequencePress(['g', 'f']);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should listen to keyup', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (e) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>g', trigger: 'keyup' }).subscribe(spyFcn);
      fakeKeyboardSequencePress(['g', 'g'], 'keyup');
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should call callback', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>h' }).subscribe();
      spectator.service.onShortcut(spyFcn);
      fakeKeyboardSequencePress(['g', 'h']);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should honor target element', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>i', element: document.body }).subscribe(spyFcn);
      fakeBodyKeyboardSequencePress(['g', 'i']);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should change meta to ctrl', () => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    spectator.service.addSequenceShortcut({ keys: 'meta.a>meta.b' }).subscribe();
    const shortcuts = spectator.service.getShortcuts();
    expect(shortcuts[0].hotkeys[0].keys).toBe('control.a>control.b');
  });

  it('should exclude shortcut', () => {
    spyOn(Platform, 'hostPlatform').and.returnValue('pc');
    spectator.service.addSequenceShortcut({ keys: 'meta.c>meta.d', showInHelpMenu: false }).subscribe();
    const shortcuts = spectator.service.getShortcuts();
    expect(shortcuts.length).toBe(0);
  });

  it('should use defaults', () => {
    spectator.service.addSequenceShortcut({ keys: 'g>j' }).subscribe();
    const hks = spectator.service.getHotkeys();
    expect(hks[0]).toEqual({
      element: document.documentElement,
      showInHelpMenu: true,
      allowIn: [],
      keys: 'g>j',
      trigger: 'keydown',
      group: undefined,
      description: undefined,
      preventDefault: true,
    });
  });

  it('should use options', () => {
    const options: Hotkey = {
      element: document.body,
      showInHelpMenu: false,
      allowIn: [],
      keys: 'g>k',
      trigger: 'keydown',
      group: 'test group',
      description: 'test description',
      preventDefault: false,
    };

    spectator.service.addSequenceShortcut(options).subscribe();
    const hks = spectator.service.getHotkeys();
    expect(hks[0]).toEqual(options);
  });

  it('should return shortcut', () => {
    const options: Hotkey = {
      showInHelpMenu: true,
      keys: 'g>l',
      group: 'test group',
      description: 'test description',
    };

    spectator.service.addSequenceShortcut(options).subscribe();
    const scts = spectator.service.getShortcuts();
    expect(scts[0]).toEqual({
      group: 'test group',
      hotkeys: [
        {
          keys: 'g>l',
          description: 'test description',
        },
      ],
    });
  });

  it('should listen to up', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (e) => {});
      spectator.service.addSequenceShortcut({ keys: 'up>up' }).subscribe(spyFcn);
      fakeKeyboardSequencePress(['ArrowUp', 'ArrowUp']);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should call callback after clearing and adding sequence shortcut', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator.service.addSequenceShortcut({ keys: 'g>h' }).subscribe();
      spectator.service.removeShortcuts('g>h');
      spectator.service.addSequenceShortcut({ keys: 'g>j' }).subscribe();
      spectator.service.onShortcut(spyFcn);
      fakeKeyboardSequencePress(['g', 'j']);
      await sleep(250);
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should add sequence shortcut', () => {
    spectator.service.addSequenceShortcut({ keys: 'g>i' }).subscribe();
    expect(spectator.service.getHotkeys().length).toBe(1);
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

async function fakeKeyboardSequencePress(keys: string[], type = 'keydown', wait = 0) {
  const html = TestBed.inject(DOCUMENT).documentElement;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    html.dispatchEvent(new KeyboardEvent(type, { key }));
    if (wait > 0 && i < keys.length - 1) {
      await sleep(wait);
    }
  }
}

function fakeBodyKeyboardSequencePress(keys: string[], type = 'keydown') {
  const html = TestBed.inject(DOCUMENT).body;
  keys.forEach((key: string) => html.dispatchEvent(new KeyboardEvent(type, { key })));
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
