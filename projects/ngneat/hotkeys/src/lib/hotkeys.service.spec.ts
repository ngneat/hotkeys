import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { HotkeysService } from './hotkeys.service';

describe('HotkeysService', () => {
  let spectator: SpectatorService<HotkeysService>;
  const createService = createServiceFactory(HotkeysService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
