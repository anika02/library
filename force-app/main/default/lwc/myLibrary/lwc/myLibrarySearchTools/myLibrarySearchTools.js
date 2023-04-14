import { LightningElement, api, track } from 'lwc';

export default class MyLibrarySearchTools extends LightningElement {
  @api pageName;

  @track isFilterOpen = false;
  @track selectedCategories = [];

  get hasSelectedCategories() {
    return this.selectedCategories.length > 0;
  }

  handleSearch(event) {
    this.dispatchEvent(new CustomEvent('search', { detail: event.detail }));
  }

  handleFilter() {
    this.selectedCategories = [ ...this.selectedCategories ];
    this.isFilterOpen = true;
  }

  handleCloseFilter() {
    this.isFilterOpen = false;
  }

  handleOkFilter(event) {
    this.isFilterOpen = false;
    this.selectedCategories = event.detail.selected;
    this.dispatchEvent(new CustomEvent('filter', { detail: event.detail }));
  }

  handleOpenCreationForm() {
    this.dispatchEvent(new CustomEvent('open_creation'));
  }

  handleCloseTag(event) {
    this.selectedCategories = this.selectedCategories.filter(item => item !== event.detail.value);
    this.dispatchEvent(new CustomEvent('filter', {
      detail: {
        selected: this.selectedCategories,
      },
    }));
  }
}