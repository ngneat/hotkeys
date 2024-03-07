import { HotkeyGroup, HotkeysHelpComponent, HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

class HotkeysServiceMock {
  getShortcuts(): HotkeyGroup[] {
    const groups: HotkeyGroup[] = [];
    groups.push({
      group: '',
      hotkeys: [{ keys: 'a', description: 'shortcut for action A' }],
    });
    groups.push({
      group: 'Group 1',
      hotkeys: [{ keys: 'meta.b', description: 'shortcut for action B' }],
    });

    return groups;
  }
}

class MockNgbActiveModal {
  close(): void {}
  dismiss(): void {}
}

describe('Component: Hotkeys Help', () => {
  let spectator: Spectator<HotkeysHelpComponent>;
  let ngbModal: NgbModal;

  const createComponent = createComponentFactory({
    component: HotkeysHelpComponent,
    imports: [NgbModalModule, HotkeysShortcutPipe],
    providers: [
      { provide: HotkeysService, useValue: new HotkeysServiceMock() },
      { provide: NgbActiveModal, useClass: MockNgbActiveModal },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    ngbModal = spectator.inject(NgbModal);
  });

  it('should have two tables', () => {
    const query = spectator.queryAll('.hotkeys-table-help');
    expect(query.length).toBe(2);
  });

  it('should have one table with a header', () => {
    const query = spectator.queryAll('thead');
    expect(query.length).toBe(1);
  });

  it('should have a title', () => {
    const query = spectator.query('.hotkeys-help-header-title');
    expect(query).toBeTruthy();
    expect(query.textContent).toBe('Available Shortcuts');
  });

  it('should show a custom title', () => {
    spectator.setInput({ title: 'Test title' });
    const query = spectator.query('.hotkeys-help-header-title');
    expect(query).toBeTruthy();
    expect(query.textContent).toBe('Test title');
  });

  it('should have a dismiss button', () => {
    const query = spectator.query('.hotkeys-help-header-dismiss-button');
    expect(query).toBeTruthy();
  });
});
