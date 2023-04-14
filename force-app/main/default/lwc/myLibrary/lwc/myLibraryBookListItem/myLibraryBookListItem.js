import { LightningElement, api } from 'lwc';

export default class MyLibraryBookListItem extends LightningElement {
  @api record;

  handleOpenOverview(event) {
    this.dispatchEvent(new CustomEvent('open_overview', { detail: event.detail }));
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