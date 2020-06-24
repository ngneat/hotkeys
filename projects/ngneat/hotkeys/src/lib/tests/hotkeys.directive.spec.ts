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

  it('should ignore hotkey when typing in an input', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<div [hotkeys]="'a'"><input></div>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a');
    spectator.fixture.detectChanges();
    expect(spyFcn).not.toHaveBeenCalled();
  });

  it('should trigger hotkey when typing in an input', () => {
    const spyFcn = createSpy('subscribe', (...args) => {});
    spectator = createDirective(`<div [hotkeys]="'a'" [hotkeysOptions]="{allowIn: ['INPUT']}"><input></div>`);
    spectator.output('hotkey').subscribe(spyFcn);
    spectator.dispatchKeyboardEvent(spectator.element.firstElementChild, 'keydown', 'a');
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
      `<div [hotkeys]="'a'" [hotkeysOptions]="{trigger: 'keyup', showInHelpMenu: false, preventDefault: false}"></div>`
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
});
