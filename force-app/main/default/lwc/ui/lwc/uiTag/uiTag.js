import { LightningElement, api } from 'lwc';

import {
  variants,
  sizes,
  mapIconClassesToSizes,
  mapSizeToClasses,
  mapTextClassesToSizes
} from './helper';

export default class UiTag extends LightningElement {
  @api name;
  @api label;
  @api value;
  @api isDeletable;

  _variant = 'primary';
  _size = 'medium';

  defaultBodyClasses = [ 'slds-grid slds-grow ui-rounded-2 width_max-content' ];

  @api set variant(value) {
    if (!variants.has(value)) {
      throw Error(`Incorrect variant option '${value}'`);
    }

    this._variant = value;
  }

  get variant() {
    return this._variant;
  }

  @api set size(value) {
    if (!sizes.has(value)) {
      throw Error(`Incorrect size option '${value}'`);
    }

    this._size = value;
  }

  get size() {
    return this._size;
  }

  get labelOrValue() {
    return this.label || this.value;
  }

  get iconClassName() {
    return mapIconClassesToSizes[this.size];
  }

  get textClassName() {
    return mapTextClassesToSizes[this.size];
  }

  get bodyClasses() {
    const classes = [
      ...this.defaultBodyClasses,
      this.textClassName,
      `ui-tag_${this.variant}`,
      mapSizeToClasses[this.size],
    ];

    return classes.join(' ');
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close', {
      detail: {
        name: this.name,
        value: this.value,
      },
    }));
  }
}