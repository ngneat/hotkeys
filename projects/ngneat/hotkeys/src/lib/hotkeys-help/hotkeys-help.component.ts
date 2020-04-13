import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Hotkey } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.css']
})
export class HotkeysHelpComponent {
  hotkeys: { desc: string; keys: string }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: Map<string, Hotkey>) {
    this.hotkeys = Array.from(data)
      .filter(d => d[1].showInHelp === true)
      .map(d => ({ desc: d[1].description, keys: d[0] }));
  }
}
