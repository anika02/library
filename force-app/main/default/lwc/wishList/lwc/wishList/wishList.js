import {LightningElement, track} from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader';

import styles from '@salesforce/resourceUrl/lib';
import { defaultRecords } from './helper';

export default class WishList extends LightningElement {
    @track bookOverviewIsOpen = false;
    @track selectedBook = null;

    connectedCallback() {
        Promise.all([
            loadStyle(this, styles + `/styles/styles.css`),
        ]);
    }

    handleOpenOverview(event) {
        this.selectedBook = event.detail.record;
        this.bookOverviewIsOpen = true;
    }

    handleCloseOverview() {
        this.bookOverviewIsOpen = false;
    }

    get records() {
        return defaultRecords;
    }
}