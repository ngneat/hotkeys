import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { HOTKEYS_CONFIG, HotkeysConfig } from './hotkeys-config.service';
import { HotkeysHelpComponent } from './hotkeys-help/hotkeys-help.component';

interface Options {
  element: HTMLElement;
  trigger: 'keydown' | 'keyup';
  description: string;
  showInHelp: boolean;
}

export type Hotkey = Partial<Options> & { keys: string };

@Injectable({
  providedIn: 'root'
})
export class HotkeysService implements OnDestroy {
  private readonly hotkeys = new Map();
  private readonly defaults: Options = {
    trigger: 'keydown',
    element: this.document.documentElement,
    description: '',
    showInHelp: true
  };
  private readonly configDefaults: HotkeysConfig = {
    helpShortcut: 'meta./'
  };
  private destroyed = false;

  constructor(
    private eventManager: EventManager,
    private dialog: MatDialog,
    @Inject(HOTKEYS_CONFIG) private config: HotkeysConfig,
    @Inject(DOCUMENT) private document: Document
  ) {
    const mergedConfig = { ...this.configDefaults, ...config };
    this.applyConfig(mergedConfig);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  addShortcut(options: Hotkey): Observable<KeyboardEvent> {
    const merged = { ...this.defaults, ...options };

    if (this.hotkeys.has(merged.keys)) {
      console.error(`hotkey already registered for shortcut ${merged.keys}`);
      return null;
    }
    this.hotkeys.set(merged.keys, merged);
    const event = `${merged.trigger}.${merged.keys}`;
    const observable: Observable<KeyboardEvent> = new Observable(observer => {
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
    return observable.pipe(takeWhile(() => !this.destroyed));
  }

  private applyConfig(config: HotkeysConfig) {
    this.addShortcut({
      keys: config.helpShortcut,
      showInHelp: false
    }).subscribe(e => this.displayCheatsheet());
  }

  private displayCheatsheet() {
    this.dialog.open(HotkeysHelpComponent, {
      width: '500px',
      data: this.hotkeys
    });
  }
}
