import { LightningElement, api } from 'lwc';

const MAX_SHOW_TEXT = 250;

export default class UiBookListItem extends LightningElement {

  _record;
  _status;
  description = {};
  descIsExpand = false;

  @api set record(value) {
    this._record = value;
    this.generateDescription();
  };

  get record() {
    return this._record;
  }

  @api set status(value) {
    this._status = value?.toUpperCase();
  };

  get status() {
    return this._status;
  }

  get address() {
    return this.record ? `${this.record.Owner.City}, ${this.record.Owner.Country}` : '';
  }

  get shownDescription() {
    return this.descIsExpand
      ? this.description.fullDescription
      : this.description.shortDescription;
  }

  get isLongDescription() {
    return this.description.fullDescription.length > MAX_SHOW_TEXT;
  }

  handleOpenOverview() {
    this.dispatchEvent(new CustomEvent('open_overview', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleDescription() {
    this.descIsExpand = !this.descIsExpand;
  }

  generateDescription() {
    this.description.fullDescription = this.record.Description__c;
    this.description.shortDescription =
      (this.description.fullDescription && this.isLongDescription)
        ? `${this.description.fullDescription.substring(0, MAX_SHOW_TEXT)}...`
        : this.description.fullDescription;
  }
}