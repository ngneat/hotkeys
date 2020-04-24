import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotkeysHelpComponent, HotkeysService } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container') container;

  constructor(private hotkeys: HotkeysService, private dialog: MatDialog) {
    /*     fromEvent(document, 'keydown').subscribe(e => console.log(e)); */
  }

  ngAfterViewInit(): void {

    const unsubscribe = this.hotkeys.onShortcut((e, k, t) => console.log('callback', k));
    // unsubscribe();

    const helpFcn: () => void = () => {
      this.dialog.open(HotkeysHelpComponent, { width: '500px' });
    };

    this.hotkeys.registerHelpModal(helpFcn);

    this.hotkeys
      .addShortcut({
        keys: 'escape',
        trigger: 'keydown',
        element: this.container.nativeElement,
        description: 'Quit document',
        group: 'File'
      })
      .subscribe(e => console.log('Quit hotkey', e));

    this.hotkeys
      .addShortcut({
        keys: 'ctrl.f',
        element: this.container.nativeElement,
        description: 'Find element',
        group: 'Edit'
      })
      .subscribe(e => console.log('Find hotkey', e));

    this.hotkeys
      .addShortcut({
        keys: 'ctrl.r',
        element: this.container.nativeElement,
        description: 'Replace element',
        group: 'Edit'
      })
      .subscribe(e => console.log('Replace hotkey', e));

    this.hotkeys
      .addShortcut({
        keys: 'backspace',
        trigger: 'keyup',
        description: 'Copy'
      })
      .subscribe(e => console.log('Copy hotkey', e));
  }

  handleHotkey(e: KeyboardEvent) {
    console.log('New document hotkey', e);
  }
}
