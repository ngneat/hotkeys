import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysHelpComponent, HotkeysService } from '@ngneat/hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('input') input: ElementRef<HTMLElement>;
  @ViewChild('input2') input2: ElementRef<HTMLElement>;
  @ViewChild('container') container: ElementRef<HTMLElement>;

  constructor(
    private hotkeys: HotkeysService,
    private modalService: NgbModal,
  ) {}

  ngAfterViewInit(): void {
    const unsubscribe = this.hotkeys.onShortcut((event, keys, t) => console.log(keys));

    const helpFcn: () => void = () => {
      const ref = this.modalService.open(HotkeysHelpComponent, { size: 'lg' });
      ref.componentInstance.title = 'Custom Shortcuts Title';
    };

    this.hotkeys.registerHelpModal(helpFcn);

    this.hotkeys
      .addSequenceShortcut({
        keys: 'g>t',
        description: 'In Code Test',
        preventDefault: false,
        group: 'Sequencing',
      })
      .subscribe((e) => {
        console.log('Test Sequence:', e);
      });

    this.hotkeys
      .addSequenceShortcut({
        keys: 'control.b>control.,',
        description: 'Expand All',
        preventDefault: false,
        group: 'Sequencing',
      })
      .subscribe((e) => {
        console.log('Test Sequence:', e);
      });

    this.hotkeys
      .addSequenceShortcut({
        keys: 'r>s',
        description: 'Remove this sequence',
        preventDefault: false,
        group: 'Sequencing',
      })
      .subscribe(() => {
        this.hotkeys.removeShortcuts('r>s');
      });

    this.hotkeys
      .addShortcut({
        keys: 'meta.g',
        element: this.input.nativeElement,
        description: 'Go to Code',
        allowIn: ['INPUT'],
        preventDefault: false,
        group: 'Repositories',
      })
      .subscribe((e) => console.log('Go to Code', e));

    this.hotkeys
      .addShortcut({
        keys: 'control.f',
        element: this.input2.nativeElement,
        description: 'Go to Issues',
        group: 'Repositories',
      })
      .subscribe((e) => console.log('Go to Issues', e));

    this.hotkeys
      .addShortcut({
        keys: 'shift.r',
        description: 'Jump to line',
        group: 'Source code browsing',
      })
      .subscribe((e) => console.log('Source code browsing', e));

    this.hotkeys
      .addShortcut({
        keys: 'meta.k',
        description: 'Go to notifications',
        group: 'Site-wide shortcuts',
      })
      .subscribe((e) => console.log('Go to notifications', e));
  }

  handleHotkey(e: KeyboardEvent) {
    console.log('New document hotkey', e);
  }
}
