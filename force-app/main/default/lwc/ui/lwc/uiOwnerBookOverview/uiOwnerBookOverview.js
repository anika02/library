import {LightningElement, api, track, wire} from 'lwc';

import getUserInfoById from '@salesforce/apex/UserController.getUserInfoById';

export default class UiOwnerBookOverview extends LightningElement {
  @api isOpen;
  @api ownerId;
  @api record;

  @track owner = null;
  @track _contacts;

  @wire(getUserInfoById, { userId: '$ownerId' })
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
    return this.owner?.contacts ? this.owner.contacts : [];
  }

  handleOverlayClick(event) {
    if (event.target.dataset.id === 'backdrop') {
      this.dispatchEvent(new CustomEvent('close'));
    }
  }
}