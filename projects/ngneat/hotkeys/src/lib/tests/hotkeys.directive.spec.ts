import { fakeAsync, tick } from '@angular/core/testing';
import { HotkeysDirective } from '@ngneat/hotkeys';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';


describe('Directive: Hotkeys', () => {
  let spectator: SpectatorDirective<HotkeysDirective>;
  const createDirective = createDirectiveFactory(HotkeysDirective);

  beforeEach(() => {
    spectator = createDirective(`<div [hotkeys]="'a'"></div>`);
  });

  it('should create an instance', () => {
    expect(spectator).toBeTruthy();
  });

  it('should trigger hotkey', fakeAsync(() => {
    const directive = spectator;
    let event;
    directive.output('hotkey').subscribe((e: KeyboardEvent) => {
      event = e;
    });
    directive.dispatchKeyboardEvent(directive.element, 'keydown', 'a');
    tick(500);
    expect(event).toBeTruthy();
  }));
});

