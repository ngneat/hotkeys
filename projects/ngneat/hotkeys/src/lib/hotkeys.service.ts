import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { hostPlatform, normalizeKeys } from './utils/platform';
import { coerceArray } from './utils/array';

interface Options {
  group: string;
  element: HTMLElement;
  trigger: 'keydown' | 'keyup';
  allowIn: string[];
  description: string;
  showInHelpMenu: boolean;
  preventDefault: boolean;
}

export interface HotkeyGroup {
  group: string;
  hotkeys: { keys: string; description: string }[];
}

export type Hotkey = Partial<Options> & { keys: string };
export type HotkeyCallback = (event: KeyboardEvent, keys: string, target: HTMLElement) => void;

@Injectable({ providedIn: 'root' })
export class HotkeysService {
  private readonly hotkeys = new Map<string, Hotkey>();
  private readonly defaults: Options = {
    trigger: 'keydown',
    allowIn: [],
    element: this.document.documentElement,
    group: undefined,
    description: undefined,
    showInHelpMenu: true,
    preventDefault: true
  };
  private callbacks: HotkeyCallback[] = [];

  constructor(private eventManager: EventManager, @Inject(DOCUMENT) private document) {}

  getHotkeys(): Hotkey[] {
    return Array.from(this.hotkeys.values()).map(h => ({ ...h }));
  }

  getShortcuts(): HotkeyGroup[] {
    const hotkeys = Array.from(this.hotkeys.values());
    const groups: HotkeyGroup[] = [];

    for (const hotkey of hotkeys) {
      if (!hotkey.showInHelpMenu) {
        continue;
      }

      let group = groups.find(g => g.group === hotkey.group);
      if (!group) {
        group = { group: hotkey.group, hotkeys: [] };
        groups.push(group);
      }

      const normalizedKeys = normalizeKeys(hotkey.keys, hostPlatform());
      group.hotkeys.push({ keys: normalizedKeys, description: hotkey.description });
    }

    return groups;
  }

  addShortcut(options: Hotkey): Observable<KeyboardEvent> {
    const mergedOptions = { ...this.defaults, ...options };
    const normalizedKeys = normalizeKeys(mergedOptions.keys, hostPlatform());

    if (this.hotkeys.has(normalizedKeys)) {
      console.error('Duplicated shortcut');
      return of(null);
    }

    this.hotkeys.set(normalizedKeys, mergedOptions);
    const event = `${mergedOptions.trigger}.${normalizedKeys}`;

    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        const hotkey = this.hotkeys.get(normalizedKeys);
        const excludedTargets = this.getExcludedTargets(hotkey.allowIn);
        const excludedTargetsRegex = new RegExp(`^(${excludedTargets.join('|')})$`);

        // Added srcElement as a fallback when target is not present, i.e. during testing.
        const skipShortcutTrigger =
          excludedTargets && excludedTargetsRegex.test(((e.target || e.srcElement) as HTMLElement).nodeName);

        if (skipShortcutTrigger) {
          return;
        }

        if (mergedOptions.preventDefault) {
          e.preventDefault();
        }

        this.callbacks.forEach(cb => cb(e, normalizedKeys, hotkey.element));
        observer.next(e);
      };
      const dispose = this.eventManager.addEventListener(mergedOptions.element, event, handler);

      return () => {
        this.hotkeys.delete(normalizedKeys);
        dispose();
      };
    });
  }

  removeShortcuts(hotkeys: string | string[]): void {
    const coercedHotkeys = coerceArray(hotkeys).map(hotkey => normalizeKeys(hotkey, hostPlatform()));
    coercedHotkeys.forEach(hotkey => {
      if (!this.hotkeys.has(hotkey)) {
        console.warn(`Hotkey ${hotkey} not found`);
        return;
      }
      this.hotkeys.delete(hotkey);
    });
  }

  onShortcut(callback: HotkeyCallback): () => void {
    this.callbacks.push(callback);

    return () => (this.callbacks = this.callbacks.filter(cb => cb !== callback));
  }

  registerHelpModal(openHelpModalFn: () => void, helpShortcut: string = '') {
    this.addShortcut({ keys: helpShortcut || 'shift.?', showInHelpMenu: false, preventDefault: false }).subscribe(e => {
      const skipMenu =
        /^(input|textarea|select)$/i.test(document.activeElement.nodeName) ||
        (e.target as HTMLElement).isContentEditable;

      if (!skipMenu && this.hotkeys.size) {
        openHelpModalFn();
      }
    });
  }

  private getExcludedTargets(allowIn: string[]) {
    const upperCaseAllowIn = (allowIn || []).map(t => t.toUpperCase());
    return ['INPUT', 'SELECT', 'TEXTAREA'].filter(t => !upperCaseAllowIn.includes(t));
  }
}
