import { LightningElement, api, track } from 'lwc';

const MAX_SHOW_TEXT = 250;

export default class MyLibraryBookListItem extends LightningElement {

  @track owner;

  _record;
  description = {};
  descIsExpand = false;

  @api set record(value) {
    this._record = value;
    this.generateDescription();
  };

  get record() {
    return this._record;
  }

  get address() {
    return this._record ? `${this._record.Owner.City}, ${this._record.Owner.Country}` : '';
  }

  get showedDescription() {
    return this.descIsExpand
      ? this.description.fullDescription
      : this.description.shortDescription;
  }

  handleOpenOverview() {
    this.dispatchEvent(new CustomEvent('open_overview', {
      detail: {
        book: this.record,
      },
    }));
  }

  handleDescription() {
    this.descIsExpand = !this.descIsExpand;
  }

  generateDescription() {
    this.description.fullDescription = this._record.Description__c;
    this.description.shortDescription =
      (this.description.fullDescription && this.description.fullDescription.length > MAX_SHOW_TEXT)
        ? `${this.description.fullDescription.substring(0, MAX_SHOW_TEXT)}...`
        : this.description.fullDescription;
  }
}