import { LightningElement, wire, track } from 'lwc';

import userId from '@salesforce/user/Id';

import getUserInfoById from '@salesforce/apex/UserController.getUserInfoById';

export default class UiMessageShareContacts extends LightningElement {

  userId = userId;

  @track owner = {};

  height = 0;

  renderedCallback() {
    if (this.height < this.messageContainerElm.scrollHeight) {
      this.height = this.messageContainerElm.scrollHeight;
      this.dispatchEvent(new CustomEvent('data_loaded'));
    }
  }

  @wire(getUserInfoById, { userId: '$userId' })
  wireContact({ error, data }) {
    if (data) {
      this.owner = data;
      this.owner = {
        ...this.owner,
        contacts: this.owner.contacts.map(item => ({
          ...item,
          labelAndValue: `${item.label} (${item.value})`
        }))
      };

    } else if (error) {
      console.log(error);
    }
  }

  get contacts() {
    return this.owner ? this.owner.contacts : [];
  }

  get inputFieldElms() {
    return this.template.querySelectorAll('lightning-input');
  }

  get messageContainerElm() {
    return this.template.querySelector('.ui-message-container');
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  async handleShare() {
    const selected =  [ ...this.inputFieldElms ]
      .filter(element => element.checked)
      .map(element => element.label);

    if (selected.length > 0) {
      this.dispatchEvent(new CustomEvent('modal_ok', {
        detail: {
          contacts: this.contacts.filter(item => selected.includes(item.labelAndValue))
        },
      }));
    } else {
      this.handleCancel();
    }
  }
}