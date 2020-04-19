/* tslint:disable:no-unused-variable */

import { HotkeyGroup, HotkeysHelpComponent, HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

class HotkeysServiceMock {
  getShortcuts(): HotkeyGroup[] {
    const groups: HotkeyGroup[] = [];
    groups.push({
      group: '',
      hotkeys: [
        {keys: 'a', description: 'shortcut for action A'}
      ]
    });
    groups.push({
      group: 'Group 1',
      hotkeys: [
        {keys: 'meta.b', description: 'shortcut for action B'}
      ]
    });

    return groups;
  }
}

describe('Component: Hotkeys Help', () => {
  let spectator: Spectator<HotkeysHelpComponent>;
  const createComponent = createComponentFactory({
    component: HotkeysHelpComponent,
    declarations: [HotkeysShortcutPipe],
    providers: [{provide: HotkeysService, useValue: new HotkeysServiceMock() }]
  });

  beforeEach(() => spectator = createComponent());

  it('should have two tables', () => {
    spectator.fixture.whenStable().then();
    const query = spectator.queryAll('.hotkeys-help');
    expect(query.length).toBe(2);
  });

  it('should have one header', () => {
    spectator.fixture.whenStable().then();
    const query = spectator.queryAll('thead');
    expect(query.length).toBe(1);
  });

});














