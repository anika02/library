import { LightningElement, api, wire } from 'lwc';

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
    this._selected = values ? values.map(item => item.value) : [];
  }

  get selected() {
    return this._selected;
  }

  handleChange(event) {
    this._selected = event.detail.value;
  }

  handleModalClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    this.dispatchEvent(new CustomEvent('modal_ok', {
      detail: {
        name: 'categories',
        selected: this.categories.filter(item => this.selected.includes(item.value)),
      },
    }));
  }
}