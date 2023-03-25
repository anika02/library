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

  /**
   * @param {boolean} value
   */
  @api set disabled(value) {
    this._disabled = value;
    this.setAttribute('disabled', value);
  }

  /**
   * @return {boolean}
   */
  get disabled() {
    return this._disabled;
  }

  /**
   * @param {string} value
   */
  @api set variant(value) {
    if (!variants.has(value)) {
      throw Error(`Incorrect variant option '${value}'`);
    }

    this._variant = value;
  }

  /**
   * @return {string}
   */
  get variant() {
    return this._variant;
  }

  /**
   * @param {string} value
   */
  @api set size(value) {
    if (!sizes.has(value)) {
      throw Error(`Incorrect size option '${value}'`);
    }

    this._size = value;
  }

  /**
   * @return {string}
   */
  get size() {
    return this._size;
  }

  /**
   * @param {string} value
   */
  @api set iconClassName(value) {
    this._iconClassName = value;
  }

  /**
   * @return {string}
   */
  get iconClassName() {
    return this._iconClassName || (mapIconClassesToSizes[this.size]);
  }

  /**
   * @param {string} value
   */
  @api set textClassName(value) {
    this._textClassName = value;
  }

  /**
   * @return {string}
   */
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