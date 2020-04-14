import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { normalizeKeys } from './utils/platform';

interface Options {
  group: string;
  element: HTMLElement;
  trigger: 'keydown' | 'keyup';
  description: string;
  showInHelpMenu: boolean;
  preventDefault: boolean;
}

export type HotkeyGroup = { group: string; hotkeys: { keys: string; description: string }[] };
export type Hotkey = Partial<Options> & { keys: string };
export type HotkeyCallback = (event: KeyboardEvent, keys: string, target: HTMLElement) => any;

@Injectable({
  providedIn: 'root'
})
export class HotkeysService {
  private readonly hotkeys = new Map<number, Hotkey>();
  private readonly defaults: Options = {
    group: '',
    trigger: 'keydown',
    element: this.document.documentElement,
    description: '',
    showInHelpMenu: true,
    preventDefault: true
  };
  // keeps count of the number of hotkeys
  private hotkeyNumber = 0;
  private callbacks: HotkeyCallback[] = [];

  constructor(private eventManager: EventManager, @Inject(DOCUMENT) private document: Document) {}

  getShortcuts(): HotkeyGroup[] {
    const hotkeys = Array.from(this.hotkeys.values());
    const groups: HotkeyGroup[] = [];
    for (const hotkey of hotkeys) {
      let group = groups.find(g => g.group === hotkey.group);
      if (!group) {
        group = { group: hotkey.group, hotkeys: [] };
        groups.push(group);
      }
      const normalizedKeys = normalizeKeys(hotkey.keys);
      group.hotkeys.push({ keys: normalizedKeys, description: hotkey.description });
    }
    return groups;
  }

  addShortcut(options: Hotkey): Observable<KeyboardEvent> {
    const mergedOptions = { ...this.defaults, ...options };
    // use the hotkey count as id to unregister shortcut when tearing down
    // the subscription. This allows adding duplicate keys/groups.
    const hotkeyId = this.hotkeyNumber++;
    const normalizedKeys = normalizeKeys(mergedOptions.keys);

    this.hotkeys.set(hotkeyId, mergedOptions);
    const event = `${mergedOptions.trigger}.${normalizedKeys}`;

    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        if (mergedOptions.preventDefault) {
          e.preventDefault();
        }
        const hotkey = this.hotkeys.get(hotkeyId);
        this.callbacks.forEach(cb => cb(e, normalizedKeys, hotkey.element));
        observer.next(e);
      };
      const dispose = this.eventManager.addEventListener(mergedOptions.element, event, handler);
      // teardown logic
      return () => {
        this.hotkeys.delete(hotkeyId);
        dispose();
      };
    });
  }

  onShortcut(callback: HotkeyCallback): () => void {
    this.callbacks.push(callback);
    return () => (this.callbacks = this.callbacks.filter(cb => cb !== callback));
  }

  registerHelpModal(openHelpModalFn: () => void, helpShortcut: string = '') {
    this.addShortcut({ keys: helpShortcut || 'shift.?', showInHelpMenu: false, preventDefault: false }).subscribe(e => {
      const skipMenu =
        /^(input|textarea)$/i.test(document.activeElement.nodeName) || (e.target as HTMLElement).isContentEditable;

      if (!skipMenu) {
        this.hotkeys.size && openHelpModalFn();
      }
    });
  }
}
