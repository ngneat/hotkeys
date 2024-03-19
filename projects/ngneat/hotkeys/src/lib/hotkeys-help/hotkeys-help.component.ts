import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { HotkeysService } from '../hotkeys.service';
import { HotkeysShortcutPipe } from '../hotkeys-shortcut.pipe';

@Component({
  standalone: true,
  imports: [HotkeysShortcutPipe],
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.scss'],
})
export class HotkeysHelpComponent {
  private hotkeysService = inject(HotkeysService);
  @Input() title = 'Available Shortcuts';
  @Output() readonly dismiss = new EventEmitter();
  hotkeys = this.hotkeysService.getShortcuts();

  handleDismiss() {
    this.dismiss.emit();
  }
}
