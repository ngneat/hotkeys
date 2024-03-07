import { DestroyRef, Directive, effect, ElementRef, EventEmitter, inject, input, Output } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { AllowInElement, Hotkey, HotkeysService } from './hotkeys.service';
import { coerceArray } from './utils/array';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Options {
  trigger: 'keydown' | 'keyup';
  allowIn: AllowInElement[];
  showInHelpMenu: boolean;
  preventDefault: boolean;
}

@Directive({
  standalone: true,
  selector: '[hotkeys]',
})
export class HotkeysDirective {
  private destroyRef = inject(DestroyRef);
  private hotkeysService = inject(HotkeysService);
  private elementRef = inject(ElementRef);
  private subscription: Subscription;

  hotkeys = input<string>();
  isSequence = input(false);
  hotkeysGroup = input<string>();
  hotkeysOptions = input<Partial<Options>>({});
  hotkeysDescription = input<string>();
  @Output() hotkey = new EventEmitter<KeyboardEvent | Hotkey>();

  constructor() {
    effect(() => {
      if (this.subscription) this.subscription.unsubscribe();
      this.subscription = null;
      if (!this.hotkeys()) return;

      const hotkey: Hotkey = {
        keys: this.hotkeys(),
        group: this.hotkeysGroup(),
        description: this.hotkeysDescription(),
        ...this.hotkeysOptions(),
      };

      const coercedHotkeys = coerceArray(hotkey);
      this.subscription = merge(
        coercedHotkeys.map((hotkey) => {
          return this.isSequence()
            ? this.hotkeysService.addSequenceShortcut({ ...hotkey, element: this.elementRef.nativeElement })
            : this.hotkeysService.addShortcut({ ...hotkey, element: this.elementRef.nativeElement });
        }),
      )
        .pipe(mergeAll(), takeUntilDestroyed(this.destroyRef))
        .subscribe((e) => this.hotkey.next(e));
    });
  }
}
