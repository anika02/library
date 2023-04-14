import {LightningElement, api, wire} from 'lwc';

import getAllCategories from '@salesforce/apex/BookController.getAllCategories';

export default class UiFilterByCategories extends LightningElement {
  @api isOpen = false;

  categories = [];

  _selected = [];

  @wire(getAllCategories)
  wireBooks({ error, data }) {
    if (data) {
      this.categories = data;
    } else if (error) {
      console.log(error);
    }
  }

  @api set selected(values) {
    return this._selected = values;
  }

  get selected() {
    return this._selected;
  }

  handleChange(event) {
    this.selected = [...event.detail.value];
  }

  handleModalClose() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal_ok', {
      detail: {
        selected: this.selected,
      },
    }));
  }
}