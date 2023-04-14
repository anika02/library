import { LightningElement, api } from 'lwc';

import { variants } from './helper';

export default class UiTag extends LightningElement {
  @api value;
  @api isDeletable;

  _variant = 'primary';

  defaultBodyClasses = [ 'slds-grid slds-grow px-3 py-1 ui-body-2 ui-rounded-2' ];

  @api set variant(value) {
    if (!variants.has(value)) {
      throw Error(`Incorrect variant option '${value}'`);
    }

    this._variant = value;
  }

  get variant() {
    return this._variant;
  }

  get bodyClasses() {
    const classes = [
      ...this.defaultBodyClasses,
      `ui-tag_${this.variant}`
    ];

    return classes.join(' ');
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close', {
      detail: {
        value: this.value,
      },
    }));
  }
}