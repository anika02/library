import {api, LightningElement} from 'lwc';


export default class myLibraryBookListItem extends LightningElement {
  @api record;

  handleOpenOverview() {
    this.dispatchEvent(new CustomEvent('open_overview', {
      detail: {
        book: this.record,
      },
    }));
  }
}