import { LightningElement, api, track } from 'lwc';

const ENTER_KEY_CODE = 13;

export default class UiInputSearch extends LightningElement {
  @api placeholder = 'Search';

  @track _value;

  @api set value(value) {
    this._value = value || '';
  }

  get value() {
    return this._value;
  }

  get searchQueryElm() {
    return this.template.querySelector('input');
  }

  handleChange(event) {
    this.value = this.clearValue(event.target.value);
    this.searchQueryElm.value = this.value;
  }

  handleKeyUp(event) {
    if (this.isEnterKey(event.keyCode)) {
      this.sendSearchEvent();
    }
  }

  clearValue(value) {
    return value.trim();
  }

  sendSearchEvent() {
    this.dispatchEvent(new CustomEvent('search', {
      detail: {
        value: this.value
      },
    }));
  }

  isEnterKey(keyCode) {
    return keyCode === ENTER_KEY_CODE;
  }
}