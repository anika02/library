import {LightningElement, track, wire} from 'lwc';
import {loadStyle} from "lightning/platformResourceLoader";

import styles from "@salesforce/resourceUrl/lib";

import getBooksByOwnerId from '@salesforce/apex/BookController.getBooksByOwnerId';
import { helper } from './helper';


export default class MyLibrary extends LightningElement {
  recordId='0037Q00000fSXR6QAO';

  @track bookOverviewIsOpen = false;
  @track selectedBook = null;
  records = [];


  @wire(getBooksByOwnerId, { ownerId: '$recordId' })
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

  handleOpenOverview(event) {
    this.selectedBook = event.detail.book;
    this.bookOverviewIsOpen = true;
  }

  handleCloseOverview() {
    this.bookOverviewIsOpen = false;
  }

  get hasRecords() {
    return this.records?.length > 0;
  }
}