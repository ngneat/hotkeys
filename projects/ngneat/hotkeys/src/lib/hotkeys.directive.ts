import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { HotkeysService } from './hotkeys.service';

interface Options {
  trigger: 'keydown' | 'keyup';
  description: string;
  showInHelp: boolean;
}

export type InlineHotkey = Partial<Options> & { keys: string };

@Directive({
  selector: '[hotkeys]'
})
export class HotkeysDirective implements OnDestroy {
  private subscription: Subscription;

  constructor(private hotkeysService: HotkeysService, private elementRef: ElementRef) {}

  @Input()
  set hotkeys(options: InlineHotkey[]) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = merge(
      options.map(o => this.hotkeysService.addShortcut({ ...o, element: this.elementRef.nativeElement }))
    )
      .pipe(mergeAll())
      .subscribe(e => this.hotkey.next(e));
  }

  @Output()
  hotkey: EventEmitter<KeyboardEvent> = new EventEmitter();

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
