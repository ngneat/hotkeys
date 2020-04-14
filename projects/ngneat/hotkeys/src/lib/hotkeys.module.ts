import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { HotkeysShortcutPipe } from './hotkeys-shortcut.pipe';
import { HotkeysHelpComponent } from './hotkeys-help/hotkeys-help.component';
import { HotkeysDirective } from './hotkeys.directive';

@NgModule({
  declarations: [HotkeysDirective, HotkeysHelpComponent, HotkeysShortcutPipe],
  entryComponents: [HotkeysHelpComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [HotkeysDirective, HotkeysHelpComponent, HotkeysShortcutPipe]
})
export class HotkeysModule {}
