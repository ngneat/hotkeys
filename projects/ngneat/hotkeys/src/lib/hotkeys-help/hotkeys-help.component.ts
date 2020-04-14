import { Component } from '@angular/core';

import { HotkeyGroup, HotkeysService } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.css']
})
export class HotkeysHelpComponent {
  hotkeys: HotkeyGroup[];

  constructor(private hotkeysService: HotkeysService) {
    this.hotkeys = this.hotkeysService.getShortcuts();
  }
}
