import { LightningElement, api } from 'lwc';

export default class UiOwnerBookOverview extends LightningElement {
  @api isOpen;
  @api record;

  handleOverlayClick() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  handleOpenBookHistory() {
    this.dispatchEvent(new CustomEvent('open_book_history', {
      detail: {
        searchTerm: this.record?.Name,
      },
    }));
  }

  handleOpenEditionModal() {
    this.dispatchEvent(new CustomEvent('open_edition', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenDeletionModal() {
    this.dispatchEvent(new CustomEvent('open_deletion', {
      detail: {
        record: this.record,
      },
    }));
  }
}