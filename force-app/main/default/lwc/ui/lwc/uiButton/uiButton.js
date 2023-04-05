import { LightningElement, api, track } from "lwc";

import {
  sizes,
  variants,
  mapSizeToClasses,
  mapTextClassesToSizes,
  mapIconClassesToSizes,
} from './helper';

export default class UiButton extends LightningElement {

  @api value;
  @api iconName;

  @track _disabled = false;

  _variant = 'primary';
  _size = 'medium';

  _iconClassName;
  _textClassName;

  defaultBodyClasses = [ 'slds-grid_align-center ui-rounded ui-button w-full' ];

  @api set disabled(value) {
    this._disabled = value;
    this.setAttribute('disabled', value);
  }

  get disabled() {
    return this._disabled;
  }

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

  @api set iconClassName(value) {
    this._iconClassName = value;
  }

  get iconClassName() {
    return this._iconClassName || (mapIconClassesToSizes[this.size]);
  }

  @api set textClassName(value) {
    this._textClassName = value;
  }

  get textClassName() {
    return this._textClassName || (mapTextClassesToSizes[this.size]);
  }

  get bodyClasses() {

    const classes = [
      ...this.defaultBodyClasses,
      this.textClassName,
      `ui-button_${this.variant}`,
      `ui-button_${this.size}`,
      mapSizeToClasses[this.size],
      this.value ? '' : 'only-icon',
    ];

    return classes.join(' ');
  }
}