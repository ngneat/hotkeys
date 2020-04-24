import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { Hotkey, HotkeysService } from './hotkeys.service';
import { coerceArray } from './utils/array';

interface Options {
  trigger: 'keydown' | 'keyup';
  showInHelpMenu: boolean;
  preventDefault: boolean;
}

@Directive({
  selector: '[hotkeys]'
})
export class HotkeysDirective implements OnChanges, OnDestroy {
  private subscription: Subscription;

  constructor(private hotkeysService: HotkeysService, private elementRef: ElementRef) {}

  @Input() hotkeys: string;
  @Input() hotkeysGroup: string;
  @Input() hotkeysOptions: Partial<Options>;
  @Input() hotkeysDescription: string;

  @Output()
  hotkey = new EventEmitter<KeyboardEvent>();

  ngOnChanges(changes: SimpleChanges): void {
     this.deleteHotkeys();
     if (!this.hotkeys) { return; }
     const hotkey: Hotkey = {
       keys: this.hotkeys,
       group: this.hotkeysGroup || '',
       description: this.hotkeysDescription || '',
       ...(this.hotkeysOptions || {})
     };
     this.setHotkeys(hotkey);
  }

  ngOnDestroy(): void {
   this.deleteHotkeys();
  }

  private deleteHotkeys() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  private setHotkeys(hotkeys: Hotkey | Hotkey[]) {
    const coercedHotkeys = coerceArray(hotkeys);
    this.subscription = merge(
      coercedHotkeys.map(o => this.hotkeysService.addShortcut({ ...o, element: this.elementRef.nativeElement }))
    )
      .pipe(mergeAll())
      .subscribe(e => this.hotkey.next(e));
  }
}
