import { LightningElement, api } from 'lwc';

export default class UiSearchTools extends LightningElement {
  @api pageName;

  handleSearch(event) {
    this.dispatchEvent(new CustomEvent('search', { detail: event.detail }));
  }
}