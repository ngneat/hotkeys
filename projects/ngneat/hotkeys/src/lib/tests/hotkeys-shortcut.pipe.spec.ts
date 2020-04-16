import { fakeAsync } from '@angular/core/testing';
import { HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';


describe('Directive: Hotkeys', () => {
  let spectator: SpectatorPipe<HotkeysShortcutPipe>;
  const createPipe = createPipeFactory(HotkeysShortcutPipe);

  beforeEach(() => {
  });

  it('should format hotkey', fakeAsync(() => {
    spectator = createPipe(`{{ 'meta.a' | hotkeysShortcut }}`);
    expect(spectator.element).toHaveText('&#8984; a');
  }));
});

