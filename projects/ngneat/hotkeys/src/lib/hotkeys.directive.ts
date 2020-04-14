import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { HotkeysService } from './hotkeys.service';
import { coerceArray } from './utils/array';

interface Options {
  group: string;
  trigger: 'keydown' | 'keyup';
  description: string;
  showInHelpMenu: boolean;
  preventDefault: boolean;
}

export type InlineHotkey = Partial<Options> & { keys: string };

@Directive({
  selector: '[hotkeys]'
})
export class HotkeysDirective implements OnChanges, OnDestroy {
  private subscription: Subscription;

  constructor(private hotkeysService: HotkeysService, private elementRef: ElementRef) {}

  @Input()
  set keys(keys: string | string[]) {
    console.log('keys', keys);
    const coercedKeys = coerceArray(keys);
    this.setHotkeys(coercedKeys.map(k => ({ keys: k })));
  }

  @Input() hotkeys: InlineHotkey | InlineHotkey[];

  @Output()
  hotkey = new EventEmitter<KeyboardEvent>();

  ngOnChanges(changes: SimpleChanges): void {
    // FIXME: Angular initially sends an empty string even when 'hotkeys' is not being used as input
    if (changes.hotkeys.firstChange && !changes.hotkeys.currentValue) {
      return;
    }
    if (changes.hotkeys) {
      this.setHotkeys(coerceArray(changes.hotkeys.currentValue));
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private setHotkeys(options: InlineHotkey[]) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = merge(
      options.map(o => this.hotkeysService.addShortcut({ ...o, element: this.elementRef.nativeElement }))
    )
      .pipe(mergeAll())
      .subscribe(e => this.hotkey.next(e));
  }
}
