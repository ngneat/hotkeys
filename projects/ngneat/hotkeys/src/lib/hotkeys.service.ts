import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';

interface Options {
  element: HTMLElement;
  trigger: 'keydown' | 'keyup';
  description: string;
  showInHelp: boolean;
  group: string;
}

export type Hotkey = Partial<Options> & { keys: string };

@Injectable({
  providedIn: 'root'
})
export class HotkeysService {
  private readonly hotkeys = new Map();
  private readonly defaults: Options = {
    trigger: 'keydown',
    element: this.document.documentElement,
    description: '',
    group: '',
    showInHelp: true
  };

  constructor(private eventManager: EventManager, @Inject(DOCUMENT) private document: Document) {}

  getShortcutsGroups(): string[] {
    // map to get group name and remove duplicates
    return Array.from(this.hotkeys)
      .map(m => m[1])
      .map(h => h.group)
      .filter((el, idx, array) => array.indexOf(el) === idx);
  }

  getShortcutsByGroup(group: string): Hotkey[] {
    // filter by group
    return Array.from(this.hotkeys)
      .map(m => m[1])
      .filter(h => h.group === group)
      .filter((el, idx, array) => array.indexOf(el) === idx);
  }

  getShortcuts(): Hotkey[] {
    return Array.from(this.hotkeys).map(m => m[1]);
  }

  addShortcut(options: Hotkey): Observable<KeyboardEvent> {
    const merged = { ...this.defaults, ...options };

    if (this.hotkeys.has(merged.keys)) {
      console.error(`hotkey already registered for shortcut ${merged.keys}`);
      return null;
    }
    this.hotkeys.set(merged.keys, merged);
    const event = `${merged.trigger}.${merged.keys}`;
    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        e.preventDefault();
        observer.next(e);
      };
      const dispose = this.eventManager.addEventListener(merged.element, event, handler);
      // teardown logic
      return () => {
        this.hotkeys.delete(merged.keys);
        dispose();
      };
    });
  }
}
