import { LightningElement, track, wire } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import { refreshApex } from '@salesforce/apex';

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import getBooksByOwnerId from '@salesforce/apex/BookController.getBooksByOwnerId';
import upsertBook from '@salesforce/apex/BookController.upsertBook';
import deleteBook from '@salesforce/apex/BookController.deleteBook';
import { helper } from './helper';


export default class MyLibrary extends LightningElement {
  userId = userId;

  @track overviewIsOpen = false;
  @track overviewRecord;

  @track isEditionForm;
  @track editionIsOpen = false;
  @track editedRecord = {};

  @track deletionIsOpen = false;
  @track deletedRecord;

  @track searchTerm = '';
  @track filteredItems = [];

  records = [];
  isLoading = true;

  wiredBooks;
  @wire(getBooksByOwnerId, {
    ownerId: '$userId',
    searchTerm: '$searchTerm',
    categories: '$filteredItems'
  })
  setBooks(response) {
    this.wiredBooks = response;
    const { error, data } = response;

    if (data) {
      this.records = helper.mapData(data);
    } else if (error) {
      console.log(error);
    }

    this.isLoading = false;
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, styles + `/styles/styles.css`),
    ]);
  }

  get hasRecords() {
    return this.records?.length > 0;
  }

  handleOpenOverview(event) {
    this.overviewRecord = event.detail.record;
    this.overviewIsOpen = true;
  }

  handleCloseOverview() {
    this.overviewIsOpen = false;
  }

  handleOpenEditionForm(event) {
    this.editedRecord = event.detail.record;
    this.isEditionForm = true;
    this.editionIsOpen = true;
  }

  handleOpenCreationForm() {
    this.isEditionForm = false;
    this.editionIsOpen = true;
  }

  async handleOkEditionForm(event) {
    this.isLoading = true;
    this.editionIsOpen = false;
    this.editedRecord = {};

    upsertBook({
      jsonString: JSON.stringify(event.detail.updatedValues),
      documentId: event.detail.documentId
    })
      .then(() => {
        refreshApex(this.wiredBooks).then(() => {
          if (this.overviewIsOpen) {
            this.overviewRecord = this.records.filter(item => item.Id === event.detail.updatedValues.Id)[0];
          }
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleCloseEditionForm() {
    this.editionIsOpen = false;
    this.editedRecord = {};
  }

  handleOpenDeletionForm(event) {
    this.deletedRecord = event.detail.record;
    this.deletionIsOpen = true;
  }

  handleOkDeletionForm() {
    this.isLoading = true;
    this.deletionIsOpen = false;
    this.handleCloseOverview();

    deleteBook({ bookId: this.deletedRecord.Id })
      .then(() => {
          refreshApex(this.wiredBooks).then(() => {
            this.isLoading = false;
          });
      })
      .catch((error) => {
        console.log(error);
      });

    this.deletedRecord = null;
  }

  handleCloseDeletionForm() {
    this.deletionIsOpen = false;
    this.deletedRecord = null;
  }

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }

  handleFilter(event) {
    this.isLoading = true;
    this.filteredItems = event.detail.selected;
  }
}