import { Component } from '@angular/core';

import { HotkeysService } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.css']
})
export class HotkeysHelpComponent {
  hotkeys: { group: string; keys: { desc: string; keys: string }[] }[] = [];

  constructor(private hotkeysService: HotkeysService) {
    const groups = this.hotkeysService.getShortcutsGroups();
    this.hotkeys = groups
      .map(g => ({
        group: g,
        keys: this.hotkeysService
          .getShortcutsByGroup(g)
          .filter(s => s.showInHelp)
          .map(s => ({ desc: s.description, keys: s.keys }))
      }))
      .filter(g => g.keys.length > 0);
  }
}
