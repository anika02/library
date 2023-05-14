import { LightningElement, api, track } from 'lwc';

export default class LentBooksSearchTools extends LightningElement {

  @api pageName;
  @api searchTerm = '';

  @track isFilterCategoriesOpen = false;
  @track isFilterReservationStatusesOpen = false;
  @track selectedFilters = {};

  get hasSelectedFilters() {
    return Object.keys(this.selectedFilters).length > 0;
  }

  get hasSelectedCategories() {
    return this.selectedFilters.categories?.length > 0;
  }

  get hasSelectedReservationStatuses() {
    return this.selectedFilters.reservationStatuses?.length > 0;
  }

  handleSearch(event) {
    this.dispatchEvent(new CustomEvent('search', { detail: event.detail }));
  }

  handleOpenFilterCategories() {
    this.selectedFilters = { ...this.selectedFilters };
    this.isFilterCategoriesOpen = true;
  }

  handleOpenFilterReservationStatuses() {
    this.selectedFilters = { ...this.selectedFilters };
    this.isFilterReservationStatusesOpen = true;
  }

  handleCloseFilter() {
    this.isFilterCategoriesOpen = false;
    this.isFilterReservationStatusesOpen = false;
  }

  handleOkFilter(event) {
    this.handleCloseFilter();
    this.selectedFilters = {
      ...this.selectedFilters,
      [event.detail.name]: event.detail.selected,
    };

    this.sendEvent();
  }

  handleCloseTag(event) {
    this.selectedFilters = {
      ...this.selectedFilters,
      [ event.detail.name ]: this.selectedFilters[event.detail.name].filter(item => item.value !== event.detail.value),
    };

    this.sendEvent();
  }

  sendEvent() {
    let selected = {};

    for (let [ key, values ] of Object.entries(this.selectedFilters)) {
      selected = {
        ...selected,
        [key]: values ? values.map(item => item.value) : [],
      }
    }

    this.dispatchEvent(new CustomEvent('filter', {
      detail: {
        selected: selected,
      }
    }));
  }
}