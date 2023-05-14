import { LightningElement, api, track } from 'lwc';

import { clearInput } from 'c/utils';

const ENTER_KEY_CODE = 13;

export default class UiInputMessage extends LightningElement {
  @api placeholder = 'Message';

  @track value;

  get searchQueryElm() {
    return this.template.querySelector('textarea');
  }

  handleChange(event) {
    this.value = this.clearValue(event.target.value);
  }

  handleKeyUp(event) {
    if (this.isEnterKey(event.keyCode)) {
      this.value = this.clearValue(event.target.value);
      this.handleSendMessage();
    }
  }

  clearValue(value) {
    return value.trim();
  }

  handleSendMessage() {
    if (this.value) {
      this.dispatchEvent(new CustomEvent('send_message', {
        detail: {
          value: clearInput(this.value),
        },
      }));
      this.searchQueryElm.value = '';
      this.value = '';
    }
  }

  isEnterKey(keyCode) {
    return keyCode === ENTER_KEY_CODE;
  }
}