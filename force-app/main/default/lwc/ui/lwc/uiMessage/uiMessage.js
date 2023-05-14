import { LightningElement, api } from 'lwc';

import userId from '@salesforce/user/Id';

import { formatTime } from 'c/utils';

export default class UiMessage extends LightningElement {

  _message;
  sender = 'current';

  defaultMessageContainerClasses = [ 'bg-neutral-0 p-2 ui-border ui-rounded-2 ui-border-secondary-200 ui-message-container' ];

  @api set message(value) {
    this._message = value;
    this.sender = value.Sender__c === userId ? 'current' : 'other';
  }

  get message() {
    return this._message;
  }

  get time() {
    return formatTime(this.message.Time__c);
  }



  get timeClasses() {
    return `ui-body-2 ui-message-time_${this.sender}`;
  }

  get messageContainerClasses() {
    const classes = [
      ...this.defaultMessageContainerClasses,
      `ui-message-container_${this.sender}`
    ];

    return classes.join(' ');
  }
}