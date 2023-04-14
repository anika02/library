import { LightningElement, track, wire } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import getOtherUserBooks from '@salesforce/apex/BookController.getOtherUserBooks';
import addToFavourite from '@salesforce/apex/FavouriteController.addToFavourite';
import removeFromFavourite from '@salesforce/apex/FavouriteController.removeFromFavourite';
import addToWishList from '@salesforce/apex/WishListController.addToWishList';
import removeFromWishList from '@salesforce/apex/WishListController.removeFromWishList';
import { helper } from './helper';
import {refreshApex} from "@salesforce/apex";

export default class SearchMain extends LightningElement {
  userId = userId;

  @track overviewIsOpen = false;
  @track overviewRecord;

  @track searchTerm = '';
  @track filteredItems = [];

  records = [];
  isLoading = true;

  wiredBooks;
  @wire(getOtherUserBooks, {
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

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }

  handleFilter(event) {
    this.isLoading = true;
    this.filteredItems = event.detail.selected;
  }

  handleFavourite(event) {
    this.isLoading = true;
    const favouriteRecord = event.detail.record;

    if (favouriteRecord.Favourites__r) {
      removeFromFavourite({ favouriteId: favouriteRecord.Favourites__r[0].Id })
        .then(() => { this.refreshPage(event.detail.record.Id); })
        .catch((error) => {
          console.log(error);
        });
    } else {
      addToFavourite({ bookId: favouriteRecord.Id })
        .then(() => { this.refreshPage(event.detail.record.Id); })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleWishList(event) {
    this.isLoading = true;
    const wishRecord = event.detail.record;

    if (wishRecord.Wish_Lists__r) {
      removeFromWishList({ wishListId: wishRecord.Wish_Lists__r[0].Id })
        .then(() => { this.refreshPage(event.detail.record.Id); })
        .catch((error) => {
          console.log(error);
        });
    } else {
      addToWishList({ bookId: wishRecord.Id })
        .then(() => { this.refreshPage(event.detail.record.Id); })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  refreshPage(recordId) {
    refreshApex(this.wiredBooks).then(() => {
      if (this.overviewIsOpen) {
        this.overviewRecord = this.records.filter(item => item.Id === recordId)[0];
      }
      this.isLoading = false;
    });
  }
}