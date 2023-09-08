import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HotkeysService } from '../hotkeys.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './hotkeys-help.component.html',
  styleUrls: ['./hotkeys-help.component.scss'],
})
export class HotkeysHelpComponent {
  @Input() title = 'Available Shortcuts';
  @Output() readonly dismiss = new EventEmitter();
  hotkeys = this.hotkeysService.getShortcuts();

  constructor(
    private hotkeysService: HotkeysService,
    public activeModal: NgbActiveModal,
  ) {}

  handleDismiss() {
    this.dismiss.next(null);
  }
}
