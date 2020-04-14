import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { HotkeyShortcutPipe } from './hotkey-shortcut.pipe';
import { HotkeysHelpComponent } from './hotkeys-help/hotkeys-help.component';
import { HotkeysDirective } from './hotkeys.directive';

@NgModule({
  declarations: [HotkeysDirective, HotkeysHelpComponent, HotkeyShortcutPipe],
  entryComponents: [HotkeysHelpComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [HotkeysDirective, HotkeysHelpComponent, HotkeyShortcutPipe]
})
export class HotkeysModule {}
