import { TestBed } from '@angular/core/testing';
import { HotkeysDirective, HotkeysService } from '@ngneat/hotkeys';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import createSpy = jasmine.createSpy;
describe('Directive: Hotkeys', () => {
  let spectator: SpectatorDirective<HotkeysDirective>;
  const createDirective = createDirectiveFactory(HotkeysDirective);

  it('should trigger hotkey', () => {
    spectator = createDirective(`<div [hotkeys]="'a'"></div>`);
    spectator.output('hotkey').subscribe((e: KeyboardEvent) => {
      expect(e).toBeTruthy();
    });
    spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'a');
    spectator.fixture.detectChanges();
  });

  it('should not trigger hotkey output if hotkeys are paused, should trigger again when resumed', () => {
    spectator = createDirective(`<div [hotkeys]="'a'"></div>`);

    const hotkeysService = spectator.inject(HotkeysService);
    hotkeysService.pause();
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.output('hotkey').subscribe(spyFcn);
    spectator.fixture.detectChanges();
    spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'a');
    expect(spyFcn).not.toHaveBeenCalled();

    hotkeysService.resume();
    spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'a');
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should not trigger global hotkey output if hotkeys are paused, should trigger again when resumed', () => {
    spectator = createDirective(`<div [hotkeys]="'a'" isGlobal></div>`);

    const hotkeysService = spectator.inject(HotkeysService);
    hotkeysService.pause();
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.output('hotkey').subscribe(spyFcn);
    spectator.fixture.detectChanges();
    spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'a');
    expect(spyFcn).not.toHaveBeenCalled();

    hotkeysService.resume();
    spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'a');
    expect(spyFcn).toHaveBeenCalled();
  });

  const shouldIgnoreOnInputTest = (directiveExtras?: string) => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<div [hotkeys]="'a'" ${directiveExtras ?? ''}><input></div>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('INPUT');
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a', spectator.element);
    spectator.fixture.detectChanges();
    expect(spyFcn).not.toHaveBeenCalled();
  };

  it('should ignore hotkey when typing in an input', () => {
    return shouldIgnoreOnInputTest();
  });

  it('should ignore global hotkey when typing in an input', () => {
    return shouldIgnoreOnInputTest('isGlobal');
  });

  it('should trigger hotkey when typing in an input', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<div [hotkeys]="'a'" [hotkeysOptions]="{allowIn: ['INPUT']}"><input></div>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('INPUT');
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a');
    spectator.fixture.detectChanges();
    expect(spyFcn).toHaveBeenCalled();
  });

  const shouldIgnoreOnContentEditableTest = (directiveExtras?: string) => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(
      `<div [hotkeys]="'a'"><div contenteditable="true" ${directiveExtras ?? ''}></div></div>`,
    );
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('DIV');
    spyOnProperty(document.activeElement as HTMLElement, 'isContentEditable', 'get').and.returnValue(true);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a');
    spectator.fixture.detectChanges();
    expect(spyFcn).not.toHaveBeenCalled();
  };

  it('should ignore hotkey when typing in a contentEditable element', () => {
    return shouldIgnoreOnContentEditableTest();
  });

  it('should ignore global hotkey when typing in a contentEditable element', () => {
    return shouldIgnoreOnContentEditableTest('isGlobal');
  });

  it('should trigger hotkey when typing in a contentEditable element', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(
      `<div [hotkeys]="'a'" [hotkeysOptions]="{allowIn: ['CONTENTEDITABLE']}"><div contenteditable="true"></div></div>`,
    );
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('DIV');
    spyOnProperty(document.activeElement as HTMLElement, 'isContentEditable', 'get').and.returnValue(true);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a');
    spectator.fixture.detectChanges();
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should trigger global hotkey when element is not active', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<button [hotkeys]="'a'" isGlobal></button>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spectator.dispatchKeyboardEvent(document.firstElementChild, 'keydown', 'a');
    spectator.fixture.detectChanges();
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should register hotkey', () => {
    spectator = createDirective(`<div [hotkeys]="'a'"></div>`);
    spectator.fixture.detectChanges();
    const hotkeysService = spectator.inject(HotkeysService);
    const hotkeys = hotkeysService.getHotkeys();
    expect(hotkeys.length).toBe(1);
  });

  it('should register proper key', () => {
    spectator = createDirective(`<div [hotkeys]="'a'"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.keys).toBe('a');
  });

  it('should register proper group', () => {
    spectator = createDirective(`<div [hotkeys]="'a'" [hotkeysGroup]="'test group'"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.group).toBe('test group');
  });

  it('should register proper description', () => {
    spectator = createDirective(`<div [hotkeys]="'a'" [hotkeysDescription]="'test description'"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.description).toBe('test description');
  });

  it('should register proper options', () => {
    spectator = createDirective(
      `<div [hotkeys]="'a'" [hotkeysOptions]="{trigger: 'keyup', showInHelpMenu: false, preventDefault: false}"></div>`,
    );
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.preventDefault).toBe(false);
    expect(hotkey.trigger).toBe('keyup');
    expect(hotkey.showInHelpMenu).toBe(false);
  });

  it('should register proper with partial options', () => {
    spectator = createDirective(`<div [hotkeys]="'a'" [hotkeysOptions]="{trigger: 'keyup'}"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.trigger).toBe('keyup');
  });

  it('should register proper global hotkey', () => {
    spectator = createDirective(`<div [hotkeys]="'a'" isGlobal></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.global).toBe(true);
  });
});

describe('Directive: Sequence Hotkeys', () => {
  let spectator: SpectatorDirective<HotkeysDirective>;
  const createDirective = createDirectiveFactory(HotkeysDirective);

  it('should trigger hotkey', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      spectator = createDirective(`<div [hotkeys]="'g>m'" [isSequence]="true"></div>`);
      spectator.output('hotkey').subscribe((e: KeyboardEvent) => {
        expect(e).toBeTruthy();
      });
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'm');
      await sleep(250);
      spectator.fixture.detectChanges();
    };

    return run();
  });

  it('should not trigger sequence hotkey if hotkeys are paused, should trigger again when resumed', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator = createDirective(`<div [hotkeys]="'g>m'" [isSequence]="true"></div>`);
      const hotkeysService = spectator.inject(HotkeysService);

      hotkeysService.pause();
      spectator.output('hotkey').subscribe(spyFcn);
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'm');
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).not.toHaveBeenCalled();

      hotkeysService.resume();
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(spectator.element, 'keydown', 'm');
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should not trigger global sequence hotkey if hotkeys are paused, should trigger again when resumed', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator = createDirective(`<div [hotkeys]="'g>m'" [isSequence]="true" isGlobal></div>`);
      const hotkeysService = spectator.inject(HotkeysService);

      hotkeysService.pause();
      spectator.output('hotkey').subscribe(spyFcn);
      spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'm');
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).not.toHaveBeenCalled();

      hotkeysService.resume();
      spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(document.documentElement, 'keydown', 'm');
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  const shouldIgnoreOnInputTest = async (directiveExtras?: string) => {
    // * Need to space out time to prevent other test keystrokes from interfering with sequence
    await sleep(250);
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<div [hotkeys]="'g>n'" [isSequence]="true" ${directiveExtras ?? ''}><input></div>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('INPUT');
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'g', spectator.element);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'n', spectator.element);
    await sleep(250);
    spectator.fixture.detectChanges();
    expect(spyFcn).not.toHaveBeenCalled();
  };

  it('should ignore hotkey when typing in an input', () => {
    return shouldIgnoreOnInputTest();
  });

  it('should ignore global sequence hotkey when typing in an input', () => {
    return shouldIgnoreOnInputTest('isGlobal');
  });

  it('should trigger hotkey when typing in an input', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator = createDirective(
        `<div [hotkeys]="'g>o'" [isSequence]="true" [hotkeysOptions]="{allowIn: ['INPUT']}"><input></div>`,
      );
      spectator.output('hotkey').subscribe(spyFcn);
      spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('INPUT');
      spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'g');
      spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'n');
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).not.toHaveBeenCalled();
    };

    return run();
  });

  const shouldIgnoreOnContentEditableTest = async (directiveExtras?: string) => {
    // * Need to space out time to prevent other test keystrokes from interfering with sequence
    await sleep(250);
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(
      `<div [hotkeys]="'g>n'" [isSequence]="true" ${directiveExtras ?? ''}><div contenteditable="true"></div>`,
    );
    spectator.output('hotkey').subscribe(spyFcn);
    spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('DIV');
    spyOnProperty(document.activeElement as HTMLElement, 'isContentEditable', 'get').and.returnValue(true);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'g', spectator.element);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'n', spectator.element);
    await sleep(250);
    spectator.fixture.detectChanges();
    expect(spyFcn).not.toHaveBeenCalled();
  };

  it('should ignore hotkey when typing in a contentEditable element', () => {
    return shouldIgnoreOnContentEditableTest();
  });

  it('should ignore global hotkey when typing in a contentEditable element', () => {
    return shouldIgnoreOnContentEditableTest('isGlobal');
  });

  it('should trigger hotkey when typing in a contentEditable element', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator = createDirective(
        `<div [hotkeys]="'g>n'" [isSequence]="true" [hotkeysOptions]="{allowIn: ['CONTENTEDITABLE']}"><div contenteditable="true"></div>`,
      );
      spectator.output('hotkey').subscribe(spyFcn);
      spyOnProperty(document.activeElement, 'nodeName', 'get').and.returnValue('DIV');
      spyOnProperty(document.activeElement as HTMLElement, 'isContentEditable', 'get').and.returnValue(true);
      spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'g', spectator.element);
      spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'n', spectator.element);
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should trigger global sequence hotkey when element is not active', () => {
    const run = async () => {
      // * Need to space out time to prevent other test keystrokes from interfering with sequence
      await sleep(250);
      const spyFcn = createSpy('subscribe', (...args) => {});
      spectator = createDirective(`<button [hotkeys]="'g>n'" isSequence isGlobal></button>`);
      spectator.output('hotkey').subscribe(spyFcn);
      spectator.dispatchKeyboardEvent(document.firstElementChild, 'keydown', 'g', document.firstElementChild);
      spectator.dispatchKeyboardEvent(document.firstElementChild, 'keydown', 'n', document.firstElementChild);
      await sleep(250);
      spectator.fixture.detectChanges();
      expect(spyFcn).toHaveBeenCalled();
    };

    return run();
  });

  it('should register hotkey', () => {
    spectator = createDirective(`<div [hotkeys]="'g>p'" [isSequence]="true"></div>`);
    spectator.fixture.detectChanges();
    const hotkeysService = spectator.inject(HotkeysService);
    const hotkeys = hotkeysService.getHotkeys();
    expect(hotkeys.length).toBe(1);
  });

  it('should register proper key', () => {
    spectator = createDirective(`<div [hotkeys]="'g>q'" [isSequence]="true"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.keys).toBe('g>q');
  });

  it('should register proper group', () => {
    spectator = createDirective(`<div [hotkeys]="'g>r'" [isSequence]="true" [hotkeysGroup]="'test group'"></div>`);
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.group).toBe('test group');
  });

  it('should register proper description', () => {
    spectator = createDirective(
      `<div [hotkeys]="'g>s'" [isSequence]="true" [hotkeysDescription]="'test description'"></div>`,
    );
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.description).toBe('test description');
  });

  it('should register proper options', () => {
    spectator = createDirective(
      `<div [hotkeys]="'g>t'" [isSequence]="true" [hotkeysOptions]="{trigger: 'keyup', showInHelpMenu: false, preventDefault: false}"></div>`,
    );
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.preventDefault).toBe(false);
    expect(hotkey.trigger).toBe('keyup');
    expect(hotkey.showInHelpMenu).toBe(false);
  });

  it('should register proper with partial options', () => {
    spectator = createDirective(
      `<div [hotkeys]="'g>t'" [isSequence]="true" [hotkeysOptions]="{trigger: 'keyup'}"></div>`,
    );
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.trigger).toBe('keyup');
  });

  it('should register proper global sequence hotkey', () => {
    spectator = createDirective(
      `<div [hotkeys]="'g>t'" isSequence isGlobal [hotkeysOptions]="{trigger: 'keyup'}"></div>`,
    );
    spectator.fixture.detectChanges();
    const provider = TestBed.inject(HotkeysService);
    const hotkey = provider.getHotkeys()[0];
    expect(hotkey.global).toBe(true);
  });
});

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
