/* tslint:disable:no-unused-variable */
import { HotkeyGroup, HotkeysHelpComponent, HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import createSpy = jasmine.createSpy

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
    const query = spectator.queryAll('.hotkeys-table-help');
    expect(query.length).toBe(2);
  });

  it('should have one table with header', () => {
    spectator.fixture.whenStable().then();
    const query = spectator.queryAll('thead');
    expect(query.length).toBe(1);
  });

  it('should have title', () => {
    spectator.fixture.whenStable().then();
    const query = spectator.query('.hotkeys-help-header-title');
    expect(query.innerHTML).toBe('Shortcuts');
  });

  it('should show custom title', () => {
    spectator.fixture.whenStable().then();
    spectator.setInput({title: 'Test title'});
    spectator.fixture.whenStable().then();
    const query = spectator.query('.hotkeys-help-header-title');
    expect(query.innerHTML).toBe('Test title');
  });

  it('should have dismiss button', () => {
    spectator.fixture.whenStable().then();
    const query = spectator.query('.hotkeys-help-header-dismiss-button');
    expect(query).not.toBeNull();
  });

  it('should trigger dismiss event', () => {
    spectator.fixture.whenStable().then();
    const spyFcn = createSpy('subscribe', (e) => {});
    spectator.output('dimiss').subscribe(spyFcn);
    const query = spectator.query('.hotkeys-help-header-dismiss-button');
    spectator.click(query);
    spectator.fixture.whenStable().then();
    expect(spyFcn).toHaveBeenCalled();
  });

  it('should hide header', () => {
    spectator.fixture.whenStable().then();
    spectator.setInput({headerVisible: false});
    spectator.fixture.whenStable().then();
    const query = spectator.query('.hotkeys-help-header');
    expect(query).toBeNull();
  });
});
