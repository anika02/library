import { LightningElement, track, wire } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import { refreshApex } from "@salesforce/apex";

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import { STATUS_CANCELED } from 'c/utils';

import { helper } from './helper';

import addToFavourite from '@salesforce/apex/FavouriteController.addToFavourite';
import addToWishList from '@salesforce/apex/WishListController.addToWishList';
import getBooks from '@salesforce/apex/BookController.getOtherUserBooks';
import removeFromFavourite from '@salesforce/apex/FavouriteController.removeFromFavourite';
import removeFromWishList from '@salesforce/apex/WishListController.removeFromWishList';
import updateReservationStatus from '@salesforce/apex/ReservationController.updateReservationStatus';
import upsertReservation from '@salesforce/apex/ReservationController.upsertReservation';

export default class SearchMain extends LightningElement {

  userId = userId;

  @track records = [];

  @track messengerIsOpen = false;
  @track messengerRecord;

  @track overviewIsOpen = false;
  @track overviewRecord;

  @track reservationIsOpen = false;
  @track reservationConfirmIsOpen = false;
  @track reservationRecord;

  @track filteredItems = {};
  @track searchTerm = '';

  canceledStatus = STATUS_CANCELED;
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

  handleOpenMessenger(event) {
    this.messengerRecord = this.records
      .find(item => item.Reservations__r && item.Reservations__r[0].Id === event.detail.reservationId);
    this.messengerIsOpen = true;
  }

  handleCloseMessenger() {
    this.messengerIsOpen = false;
  }

  handleOpenOverview(event) {
    this.overviewRecord = event.detail.record;
    this.overviewIsOpen = true;
  }

  handleCloseOverview() {
    this.overviewIsOpen = false;
  }

  handleOpenReservationModal(event) {
    this.reservationRecord = this.records.find(item => item.Id === event.detail.recordId);
    this.reservationIsOpen = true;
  }

  async handleOkReservationModal(event) {
    this.isLoading = true;
    this.handleCloseReservationModal();

    await upsertReservation({ jsonString: JSON.stringify(event.detail.reservation) });
    await this.refreshRecords(event.detail.reservation.Book__c);
    this.isLoading = false;
  }

  handleCloseReservationModal() {
    this.reservationIsOpen = false;
    this.reservationRecord = {};
  }

  handleOpenCancelReservationModal(event) {
    this.reservationRecord = event.detail.record;
    this.reservationConfirmIsOpen = true;
  }

  async handleOkReservationConfirmModal(event) {
    this.isLoading = true;
    this.reservationConfirmIsOpen = false;

    await updateReservationStatus(event.detail);
    await this.refreshRecords(this.reservationRecord.Id);

    this.reservationRecord = {};
  }

  handleCloseReservationConfirmModal() {
    this.reservationConfirmIsOpen = false;
    this.reservationRecord = {};
  }

  handleFilter(event) {
    this.filteredItems = event.detail.selected;
  }

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }

  async handleFavourite(event) {
    this.isLoading = true;
    const eventRecordId = event.detail.recordId;
    const record = this.records.find(item => item.Id === eventRecordId);

    if (record.Favourites__r) {
      await removeFromFavourite({ favouriteId: record.Favourites__r[0].Id });
    } else {
      await addToFavourite({ bookId: record.Id });
    }

    this.refreshRecords(eventRecordId);
    this.isLoading = false;
  }

  async handleWishList(event) {
    this.isLoading = true;
    const eventRecordId = event.detail.recordId;
    const record = this.records.find(item => item.Id === eventRecordId);

    if (record.Wish_Lists__r) {
      await removeFromWishList({ wishListId: record.Wish_Lists__r[0].Id });
    } else {
      await addToWishList({ bookId: record.Id });
    }

    await this.refreshRecords(eventRecordId);
    this.isLoading = false;
  }

  async refreshRecords(recordId) {
    await refreshApex(this.wiredResponse);

    if (this.overviewIsOpen) {
      this.overviewRecord = this.records.find(item => item.Id === recordId);
    }
  }
}