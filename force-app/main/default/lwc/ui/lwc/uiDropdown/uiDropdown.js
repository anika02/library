import { LightningElement, api } from 'lwc';

export default class UiDropdown extends LightningElement {

  @api disabled = false;
  @api options;

  _size = 'large';
  sizes = new Set([
    'large',
    'medium'
  ]);

  isShowOptions = false;

  _value;
  @api set value(v) {
    this._value = this.options.find(option => option.value === v).label;
  };

  get value() {
    return this._value;
  }

  @api set size(value) {
    if (!this.sizes.has(value)) {
      throw Error(`Incorrect variant option '${value}'`);
    }

    this._size = value;
  }

  get size() {
    return this._size;
  }

  get textClasses() {
    return this.size === 'large'
      ? 'ui-title-2'
      : 'ui-body-1';
  }

  get paddingClasses() {
    return this.size === 'large'
      ? 'py-1 px-2'
      : 'p-2';
  }

  get mainButtonClass() {
    return `slds-grid ${this.textClasses} ${this.paddingClasses} \
      ${this.disabled ? '' : 'pointer'} \
      ${this.isShowOptions ? 'bg-primary-100 ui-rounded-1' : ''}`;
  }

  get optionsClass() {
    return `slds-is-absolute ui-rounded-1 box-shadow bg-neutral-0 pointer min-width_max-content options-without-selected z-110 \
      ${this.textClasses}`;
  }

  get optionsWithoutSelected() {
    if (!this.options || !this.value) {
      return [];
    }

    return this.options.filter(option => option.label !== this.value);
  }

  handleMainButtonClick() {
    if (!this.disabled) {
      this.isShowOptions = !this.isShowOptions;
    }
  }

  handleOptionClick(event) {
    this.isShowOptions = false;
    const { value } = event.target.dataset;

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value,
      },
    }));
  }
}