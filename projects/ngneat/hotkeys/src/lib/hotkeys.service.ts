import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { EMPTY, fromEvent, Observable, of, Subject, Subscriber, Subscription } from 'rxjs';
import { debounceTime, filter, finalize, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { coerceArray } from './utils/array';
import { hostPlatform, normalizeKeys } from './utils/platform';

export type AllowInElement = 'INPUT' | 'TEXTAREA' | 'SELECT' | 'CONTENTEDITABLE';
export type Options = {
  group: string;
  element: HTMLElement;
  trigger: 'keydown' | 'keyup';
  allowIn: AllowInElement[];
  description: string;
  showInHelpMenu: boolean;
  preventDefault: boolean;
  global?: boolean;
};

export interface HotkeyGroup {
  group: string;
  hotkeys: { keys: string; description: string }[];
}

export type Hotkey = Partial<Options> & { keys: string };
export type HotkeyCallback = (event: KeyboardEvent | Hotkey, keys: string, target: HTMLElement) => void;

interface HotkeySummary {
  hotkey: Hotkey;
  subject: Subject<Hotkey>;
}

interface SequenceSummary {
  subscription: Subscription;
  observer: Observable<Hotkey>;
  hotkeyMap: Map<string, HotkeySummary>;
}

@Injectable({ providedIn: 'root' })
export class HotkeysService {
  private readonly hotkeys = new Map<string, Hotkey>();
  private readonly dispose = new Subject<string>();
  private readonly defaults: Options = {
    trigger: 'keydown',
    allowIn: [],
    element: this.document.documentElement,
    group: undefined,
    description: undefined,
    showInHelpMenu: true,
    preventDefault: true,
  };
  private callbacks: HotkeyCallback[] = [];
  private sequenceMaps = new Map<HTMLElement, SequenceSummary>();
  private sequenceDebounce: number = 250;

  constructor(
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  getHotkeys(): Hotkey[] {
    const sequenceKeys = Array.from(this.sequenceMaps.values())
      .map((s) => [s.hotkeyMap].reduce((_acc, val) => [...val.values()], []))
      .reduce((_x, y) => y, [])
      .map((h) => h.hotkey);

    return Array.from(this.hotkeys.values()).concat(sequenceKeys);
  }

  getShortcuts(): HotkeyGroup[] {
    const hotkeys = this.getHotkeys();
    const groups: HotkeyGroup[] = [];

    for (const hotkey of hotkeys) {
      if (!hotkey.showInHelpMenu) {
        continue;
      }

      let group = groups.find((g) => g.group === hotkey.group);
      if (!group) {
        group = { group: hotkey.group, hotkeys: [] };
        groups.push(group);
      }

      const normalizedKeys = normalizeKeys(hotkey.keys, hostPlatform());
      group.hotkeys.push({ keys: normalizedKeys, description: hotkey.description });
    }

    return groups;
  }

  addSequenceShortcut(options: Hotkey): Observable<Hotkey> {
    const getSequenceObserver = (element: HTMLElement, eventName: string) => {
      let sequence = '';
      return fromEvent<KeyboardEvent>(element, eventName).pipe(
        tap(
          (e) =>
            (sequence = `${sequence}${sequence ? '>' : ''}${e.ctrlKey ? 'control.' : ''}${e.altKey ? 'alt.' : ''}${
              e.shiftKey ? 'shift.' : ''
            }${e.key}`),
        ),
        debounceTime(this.sequenceDebounce),
        mergeMap(() => {
          const resultSequence = sequence;
          sequence = '';
          const summary = this.sequenceMaps.get(element);
          if (summary.hotkeyMap.has(resultSequence)) {
            const hotkeySummary = summary.hotkeyMap.get(resultSequence);
            hotkeySummary.subject.next(hotkeySummary.hotkey);
            return of(hotkeySummary.hotkey);
          } else {
            return EMPTY;
          }
        }),
      );
    };

    const mergedOptions = { ...this.defaults, ...options };
    let normalizedKeys = normalizeKeys(mergedOptions.keys, hostPlatform());

    const getSequenceCompleteObserver = (): Observable<Hotkey> => {
      const hotkeySummary = {
        subject: new Subject<Hotkey>(),
        hotkey: mergedOptions,
      };

      const hotkeyElement = mergedOptions.global ? this.document.documentElement : mergedOptions.element;

      if (this.sequenceMaps.has(hotkeyElement)) {
        const sequenceSummary = this.sequenceMaps.get(hotkeyElement);

        if (sequenceSummary.hotkeyMap.has(normalizedKeys)) {
          console.error('Duplicated shortcut');
          return of(null);
        }

        sequenceSummary.hotkeyMap.set(normalizedKeys, hotkeySummary);
      } else {
        const observer = getSequenceObserver(hotkeyElement, mergedOptions.trigger);
        const subscription = observer.subscribe();

        const hotkeyMap = new Map<string, HotkeySummary>([[normalizedKeys, hotkeySummary]]);
        const sequenceSummary = { subscription, observer, hotkeyMap };
        this.sequenceMaps.set(hotkeyElement, sequenceSummary);
      }

      return hotkeySummary.subject.asObservable();
    };

    return getSequenceCompleteObserver().pipe(
      takeUntil<Hotkey>(this.dispose.pipe(filter((v) => v === normalizedKeys))),
      filter((hotkey) => !this.targetIsExcluded(hotkey.allowIn)),
      tap((hotkey) => this.callbacks.forEach((cb) => cb(hotkey, normalizedKeys, hotkey.element))),
      finalize(() => this.removeShortcuts(normalizedKeys)),
    );
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

    return new Observable((observer) => {
      const handler = (e: KeyboardEvent) => {
        const hotkey = this.hotkeys.get(normalizedKeys);
        const skipShortcutTrigger = this.targetIsExcluded(hotkey.allowIn);

        if (skipShortcutTrigger) {
          return;
        }

        if (mergedOptions.preventDefault) {
          e.preventDefault();
        }

        this.callbacks.forEach((cb) => cb(e, normalizedKeys, hotkey.element));
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(
        mergedOptions.global ? this.document.documentElement : mergedOptions.element,
        event,
        handler,
      );

      return () => {
        this.hotkeys.delete(normalizedKeys);
        dispose();
      };
    }).pipe(takeUntil<KeyboardEvent>(this.dispose.pipe(filter((v) => v === normalizedKeys))));
  }

  removeShortcuts(hotkeys: string | string[]): void {
    const coercedHotkeys = coerceArray(hotkeys).map((hotkey) => normalizeKeys(hotkey, hostPlatform()));
    coercedHotkeys.forEach((hotkey) => {
      this.hotkeys.delete(hotkey);
      this.dispose.next(hotkey);

      this.sequenceMaps.forEach((v, k) => {
        const summary = v.hotkeyMap.get(hotkey);
        if (summary) {
          summary.subject.observers
            .filter((o: Subscriber<Hotkey>) => !o.closed)
            .forEach((o: Subscriber<Hotkey>) => o.unsubscribe());

          v.hotkeyMap.delete(hotkey);
        }
        if (v.hotkeyMap.size === 0) {
          v.subscription.unsubscribe();
          this.sequenceMaps.delete(k);
        }
      });
    });
  }

  setSequenceDebounce(debounce: number): void {
    this.sequenceDebounce = debounce;
  }

  onShortcut(callback: HotkeyCallback): () => void {
    this.callbacks.push(callback);

    return () => (this.callbacks = this.callbacks.filter((cb) => cb !== callback));
  }

  registerHelpModal(openHelpModalFn: () => void, helpShortcut: string = '') {
    this.addShortcut({ keys: helpShortcut || 'shift.?', showInHelpMenu: false, preventDefault: false }).subscribe(
      (e) => {
        const skipMenu =
          /^(input|textarea|select)$/i.test(document.activeElement.nodeName) ||
          (e.target as HTMLElement).isContentEditable;

        if (!skipMenu && this.hotkeys.size) {
          openHelpModalFn();
        }
      },
    );
  }

  private targetIsExcluded(allowIn?: AllowInElement[]) {
    const activeElement = this.document.activeElement;
    const elementName = activeElement.nodeName;
    const elementIsContentEditable = (activeElement as HTMLElement).isContentEditable;
    let isExcluded = ['INPUT', 'SELECT', 'TEXTAREA'].includes(elementName) || elementIsContentEditable;

    if (isExcluded && allowIn?.length) {
      for (let t of allowIn) {
        if (activeElement.nodeName === t || (t === 'CONTENTEDITABLE' && elementIsContentEditable)) {
          isExcluded = false;
          break;
        }
      }
    }

    return isExcluded;
  }
}
