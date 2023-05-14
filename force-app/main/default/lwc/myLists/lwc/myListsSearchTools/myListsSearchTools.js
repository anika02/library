import { LightningElement, api, track } from 'lwc';

export default class MyListsSearchTools extends LightningElement {

  @api pageName;
  @api selectedListName;
  @api listNameOptions;

  @track isFilterOpen = false;
  @track selectedFilters = [];

  get hasSelectedCategories() {
    return this.selectedFilters?.length > 0;
  }

  handleSearch(event) {
    this.dispatchEvent(new CustomEvent('search', { detail: event.detail }));
  }

  handleFilter() {
    this.selectedFilters = [ ...this.selectedFilters ];
    this.isFilterOpen = true;
  }

  handleCloseFilter() {
    this.isFilterOpen = false;
  }

  handleOkFilter(event) {
    this.isFilterOpen = false;
    this.selectedFilters = event.detail.selected;

    this.sendEvent();
  }

  handleCloseTag(event) {
    this.selectedFilters = this.selectedFilters.filter(item => item.value !== event.detail.value);

    this.sendEvent();
  }

  handleChangeListName(event) {
    this.dispatchEvent(new CustomEvent('change_list', { detail: event.detail }));
  }

  sendEvent() {
    this.dispatchEvent(new CustomEvent('filter', {
      detail: {
        selected: {
          categories: this.selectedFilters?.map(item => item.value) || [],
        },
      }
    }));
  }
}