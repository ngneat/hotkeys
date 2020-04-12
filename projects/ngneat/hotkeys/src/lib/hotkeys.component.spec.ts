import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { HotkeysComponent } from './hotkeys.component';

describe('HotkeysComponent', () => {
  let spectator: Spectator<HotkeysComponent>;
  const createComponent = createComponentFactory(HotkeysComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
