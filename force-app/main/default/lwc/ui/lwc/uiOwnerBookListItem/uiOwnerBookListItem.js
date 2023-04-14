import {api, LightningElement} from 'lwc';


export default class UiOwnerBookListItem extends LightningElement {
  @api record;

  handleOpenOverview() {
    this.dispatchEvent(new CustomEvent('open_overview', {
      detail: {
        record: this.record,
      },
    }));
  }
}