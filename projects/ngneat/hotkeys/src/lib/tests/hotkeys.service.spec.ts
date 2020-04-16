/* tslint:disable:no-unused-variable */

import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { HotkeysService } from '@ngneat/hotkeys';
import { DOCUMENT } from '@angular/common';

describe('Service: Hotkeys', () => {
  let hotkeys;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotkeysService]
    });
    hotkeys = TestBed.inject(HotkeysService);
  });

  it('should run', inject([HotkeysService], (service: HotkeysService) => {
    expect(service).toBeTruthy();
  }));

  it('should add shortcut', () => {
    hotkeys.addShortcut({keys: 'a'}).subscribe();
    expect(hotkeys.getShortcuts().length).toBe(1);
  });

  it('should listen to keydown', fakeAsync(() => {
    let event: KeyboardEvent = null;
    hotkeys.addShortcut({keys: 'a'}).subscribe((e) => {
      event = e;
    });
    fakeKeyboardPress('a');
    tick(500);
    expect(event).toBeTruthy();
    expect(event.key).toBe('a');
  }));

  it('should call callback', fakeAsync(() => {
    let event;
    hotkeys.addShortcut({keys: 'a'}).subscribe();
    hotkeys.onShortcut(((e, keys, target) => {
      event  = e;
    }));
    fakeKeyboardPress('a');
    tick(500);
    expect(event).toBeTruthy();
    expect(event.key).toBe('a');
  }));
});


function fakeKeyboardPress(key: string) {
  const html = TestBed.inject(DOCUMENT).documentElement;
  html.dispatchEvent(new KeyboardEvent('keydown', {key}));
}

















