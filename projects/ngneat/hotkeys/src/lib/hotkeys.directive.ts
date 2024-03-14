import {
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { Hotkey, HotkeysService, Options as ServiceOptions } from './hotkeys.service';
import { coerceArray } from './utils/array';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Options = Omit<ServiceOptions, 'group' | 'element' | 'description'>;

@Directive({
  standalone: true,
  selector: '[hotkeys]',
})
export class HotkeysDirective implements OnChanges {
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

  private _hotkey = computed(() => ({
    keys: this.hotkeys(),
    group: this.hotkeysGroup(),
    description: this.hotkeysDescription(),
    ...this.hotkeysOptions(),
  }));

  ngOnChanges(changes: SimpleChanges): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;

    if (!this.hotkeys) {
      return;
    }

    this.setHotkeys(this._hotkey());
  }

  private setHotkeys(hotkeys: Hotkey | Hotkey[]) {
    const coercedHotkeys = coerceArray(hotkeys);
    this.subscription = merge(
      coercedHotkeys.map((hotkey) => {
        return this.isSequence()
          ? this.hotkeysService.addSequenceShortcut({ ...hotkey, element: this.elementRef.nativeElement })
          : this.hotkeysService.addShortcut({ ...hotkey, element: this.elementRef.nativeElement });
      }),
    )
      .pipe(takeUntilDestroyed(this.destroyRef), mergeAll())
      .subscribe((e) => this.hotkey.next(e));
  }
}
