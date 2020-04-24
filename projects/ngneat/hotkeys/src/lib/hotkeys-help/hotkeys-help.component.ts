import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HotkeyGroup, HotkeysService } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.css']
})
export class HotkeysHelpComponent {
  @Input() title = 'Shortcuts';
  @Input() headerVisible = true;
  @Output() dimiss = new EventEmitter();
  hotkeys: HotkeyGroup[];

  constructor(private hotkeysService: HotkeysService) {
    this.hotkeys = this.hotkeysService.getShortcuts();
  }

  handleDismiss() {
    this.dimiss.next();
  }
}
