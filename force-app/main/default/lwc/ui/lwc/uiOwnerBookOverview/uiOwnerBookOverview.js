import { LightningElement, api } from 'lwc';

export default class UiOwnerBookOverview extends LightningElement {
  @api isOpen;
  @api record;

  handleOverlayClick() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  handleOpenEditionForm() {
    this.dispatchEvent(new CustomEvent('open_edition', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenDeletionForm() {
    this.dispatchEvent(new CustomEvent('open_deletion', {
      detail: {
        record: this.record,
      },
    }));
  }
}