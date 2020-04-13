import { AfterViewChecked, AfterViewInit, Component, ViewChild } from '@angular/core';
import { HotkeysService, InlineHotkey } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('container') container;
  inlineHotkeys: InlineHotkey[] = [
    { keys: 'q', description: 'quit action' },
    { keys: 'w', description: 'duplicate' }
  ];

  constructor(private hotkeys: HotkeysService) {}

  ngAfterViewChecked() {
    console.log('change detection cycle', Date.now());
  }

  ngAfterViewInit(): void {
    this.hotkeys
      .addShortcut({
        keys: 'b',
        trigger: 'keyup',
        description: 'copy content'
      })
      .subscribe(e => console.log('Hotkey', e));

    this.hotkeys
      .addShortcut({
        keys: 'meta.v',
        trigger: 'keydown',
        element: this.container.nativeElement,
        description: 'paste content'
      })
      .subscribe(e => console.log('Hotkey', e));
  }

  handleHotkey(e: KeyboardEvent) {
    console.log('Inline hotkey', e);
  }
}
