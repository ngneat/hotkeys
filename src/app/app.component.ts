import { AfterViewChecked, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotkeysService, InlineHotkey } from '@ngneat/hotkeys';
import { HotkeysHelpComponent } from 'projects/ngneat/hotkeys/src/lib/hotkeys-help/hotkeys-help.component';

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

  constructor(private hotkeys: HotkeysService, private dialog: MatDialog) {
    /*     fromEvent(document, 'keydown').subscribe(e => console.log(e)); */
  }

  ngAfterViewChecked() {
    console.log('change detection cycle', Date.now());
  }

  ngAfterViewInit(): void {
    this.hotkeys
      .addShortcut({
        keys: 'backspace',
        trigger: 'keyup',
        description: 'copy content'
      })
      .subscribe(e => console.log('Hotkey', e));

    this.hotkeys
      .addShortcut({
        keys: 'meta.h',
        trigger: 'keydown',
        element: this.container.nativeElement,
        description: 'help',
        group: 'Basic'
      })
      .subscribe(e => this.dialog.open(HotkeysHelpComponent, { width: '500px' }));

    this.hotkeys
      .addShortcut({
        keys: 'escape',
        trigger: 'keydown',
        element: this.container.nativeElement,
        description: 'cancel',
        group: 'Basic'
      })
      .subscribe(e => console.log('Hotkey', e));
  }

  handleHotkey(e: KeyboardEvent) {
    console.log('Inline hotkey', e);
  }
}
