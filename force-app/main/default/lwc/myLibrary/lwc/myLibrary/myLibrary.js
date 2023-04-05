import {LightningElement, track, wire} from 'lwc';
import {loadStyle} from "lightning/platformResourceLoader";

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import getBooksByOwnerId from '@salesforce/apex/BookController.getBooksByOwnerId';
import { helper } from './helper';


export default class MyLibrary extends LightningElement {
  userId = userId;

  @track bookOverviewIsOpen = false;
  @track selectedBook = null;
  @track selectedBookOwnerId = null;

  @track searchTerm = '';

  records = [];

  @wire(getBooksByOwnerId, { ownerId: '$userId', searchTerm: '$searchTerm' })
  wireBooks({ error, data }) {
    if (data) {
      this.records = helper.mapData(data);
    } else if (error) {
      console.log(error);
    }
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
    this.selectedBook = event.detail.book;
    this.selectedBookOwnerId = event.detail.book.OwnerId;
    this.bookOverviewIsOpen = true;
  }

  handleCloseOverview() {
    this.bookOverviewIsOpen = false;
  }

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }
}