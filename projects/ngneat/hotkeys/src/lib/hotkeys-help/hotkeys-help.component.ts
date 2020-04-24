import { Component } from '@angular/core';
import { HotkeysService } from '../hotkeys.service';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.scss']
})
export class HotkeysHelpComponent {
  hotkeys = this.hotkeysService.getShortcuts();

  constructor(private hotkeysService: HotkeysService) {}
}
