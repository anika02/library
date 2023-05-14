import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { loadStyle } from "lightning/platformResourceLoader";
import { refreshApex } from '@salesforce/apex';

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import { CORE_NAMESPACE, navigateToAppPage } from 'c/utils';

import { helper } from './helper';

import deleteBook from '@salesforce/apex/BookController.deleteBook';
import getBooks from '@salesforce/apex/BookController.getBooksByOwnerId';
import upsertBook from '@salesforce/apex/BookController.upsertBook';

export default class MyLibrary extends NavigationMixin(LightningElement) {

  userId = userId;

  @track records = [];

  @track deletionIsOpen = false;
  @track deletedRecord;

  @track editionIsOpen = false;
  @track editedRecord = {};
  @track isEditionModal;

  @track overviewIsOpen = false;
  @track overviewRecord;

  @track filteredItems = {};
  @track searchTerm = '';

  isLoading = true;

  connectedCallback() {
    Promise.all([
      loadStyle(this, styles + `/styles/styles.css`),
    ]);
  }

  @wire(getBooks, {
    ownerId: '$userId',
    searchTerm: '$searchTerm',
    filteredItems: '$filteredItems'
  })
  wiredBooks(response) {
    this.isLoading = true;
    const { data, error } = this.wiredResponse = response;

    if (data) {
      this.records = helper.mapData(data);
      this.isLoading = false;
    } else if (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  get hasRecords() {
    return !this.isLoading && this.records?.length > 0;
  }

  get isEmptyPage() {
    return !this.isLoading && this.records?.length === 0;
  }

  handleOpenBookHistory(event) {
    navigateToAppPage(this, `${CORE_NAMESPACE}Book_Requests`, { c__searchTerm: event.detail.searchTerm });
  }

  handleOpenDeletionModal(event) {
    this.deletedRecord = event.detail.record;
    this.deletionIsOpen = true;
  }

  async handleOkDeletionModal() {
    this.isLoading = true;
    this.deletionIsOpen = false;
    this.handleCloseOverview();

    await deleteBook({ bookId: this.deletedRecord.Id });
    await refreshApex(this.wiredResponse);

    this.deletedRecord = null;
    this.isLoading = false;
  }

  handleCloseDeletionModal() {
    this.deletionIsOpen = false;
    this.deletedRecord = null;
  }

  handleOpenCreationModal() {
    this.isEditionModal = false;
    this.editionIsOpen = true;
  }

  handleOpenEditionModal(event) {
    this.editedRecord = event.detail.record;
    this.isEditionModal = true;
    this.editionIsOpen = true;
  }

  async handleOkEditionModal(event) {
    this.isLoading = true;
    this.editionIsOpen = false;
    this.editedRecord = {};

    await upsertBook({
      jsonString: JSON.stringify(event.detail.updatedValues),
      documentId: event.detail.documentId
    });

    await refreshApex(this.wiredResponse);

    if (this.overviewIsOpen) {
      this.overviewRecord = this.records.find(item => item.Id === event.detail.updatedValues.Id);
    }

    this.isLoading = false;
  }

  handleCloseEditionModal() {
    this.editionIsOpen = false;
    this.editedRecord = {};
  }

  handleOpenOverview(event) {
    this.overviewRecord = event.detail.record;
    this.overviewIsOpen = true;
  }

  handleCloseOverview() {
    this.overviewIsOpen = false;
  }

  handleFilter(event) {
    this.filteredItems = event.detail.selected;
  }

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }
}