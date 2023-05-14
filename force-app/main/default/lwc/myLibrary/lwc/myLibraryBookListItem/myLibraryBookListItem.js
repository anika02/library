import { LightningElement, api } from 'lwc';

export default class MyLibraryBookListItem extends LightningElement {

  @api record;

  handleOpenBookHistory() {
    this.dispatchEvent(new CustomEvent('open_book_history', {
      detail: {
        searchTerm: this.record.Name,
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

  handleOpenEditionModal() {
    this.dispatchEvent(new CustomEvent('open_edition', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenOverview(event) {
    this.dispatchEvent(new CustomEvent('open_overview', { detail: event.detail }));
  }
}