import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HotkeysShortcutPipe } from './hotkeys-shortcut.pipe';
import { HotkeysHelpComponent } from './hotkeys-help/hotkeys-help.component';
import { HotkeysDirective } from './hotkeys.directive';

@NgModule({
  declarations: [HotkeysDirective, HotkeysHelpComponent, HotkeysShortcutPipe],
  entryComponents: [HotkeysHelpComponent],
  imports: [CommonModule],
  exports: [HotkeysDirective, HotkeysHelpComponent, HotkeysShortcutPipe]
})
export class HotkeysModule {}
