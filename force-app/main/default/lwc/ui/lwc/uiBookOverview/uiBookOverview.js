import { LightningElement, api, track, wire } from 'lwc';

import getUserInfoById from '@salesforce/apex/UserController.getUserInfoById';

export default class UiBookOverview extends LightningElement {
  @api isOpen;

  @track owner;
  @track _contacts;

  _record;
  @api set record(v) {
    this._record = v;
  }

  get record() {
    return this._record;
  }

  @wire(getUserInfoById, { userId: '$record.OwnerId' })
  wireContact({ error, data }) {
    if (data) {
      this.owner = data;
    } else if (error) {
      console.log(error);
    }
  }

  get ownerName() {
    return this.owner?.name;
  }

  get address() {
    return this.owner ? `${this.owner.city}, ${this.owner.country}` : '';
  }

  get contacts() {
    return this.owner ? this.owner.contacts : [];
  }

  handleOverlayClick(event) {
    if (event.target.dataset.id === 'backdrop') {
      this.dispatchEvent(new CustomEvent('close'));
    }
  }
}