import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HotkeysService } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.scss']
})
export class HotkeysHelpComponent {
  @Input() title = 'Shortcuts';
  @Input() headerVisible = true;
  @Output() dimiss = new EventEmitter();
  hotkeys = this.hotkeysService.getShortcuts();

  constructor(private hotkeysService: HotkeysService) {}

  handleDismiss() {
    this.dimiss.next();
  }
}
