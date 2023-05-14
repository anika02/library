import { LightningElement, api, track, wire } from 'lwc';

import getCommentsByBookId from '@salesforce/apex/CommentOnBookController.getCommentsByBookId';

import { formatDate } from 'c/utils';

export default class UiBookOverview extends LightningElement {
  @api isOpen;

  @track comments = [];

  _record;
  @api set record(v) {
    this._record = { ...v };
  }

  get record() {
    return this._record;
  }

  @wire(getCommentsByBookId, { bookId: '$record.Id' })
  wireContact({ error, data }) {
    if (data) {
      this.comments = data.map(item => ({
        ...item,
        dateTime: formatDate(item.Time__c)
      }));
    } else if (error) {
      console.log(error);
    }
  }

  get ownerName() {
    return this.record?.Owner.Name;
  }

  get address() {
    return this.record ? `${this.record.Owner.City}, ${this.record.Owner.Country}` : '';
  }

  get hasComments() {
    return this.comments?.length > 0;
  }

  handleOverlayClick(event) {
    if (event.target.dataset.id === 'backdrop') {
      this.dispatchEvent(new CustomEvent('close'));
    }
  }
}