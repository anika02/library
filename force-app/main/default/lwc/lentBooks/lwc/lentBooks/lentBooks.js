import { LightningElement, track, wire} from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';

import userId from '@salesforce/user/Id';
import styles from "@salesforce/resourceUrl/lib";

import { helper } from './helper';

import deleteBook from '@salesforce/apex/BookController.deleteBook';
import finishReservation from '@salesforce/apex/ReservationController.finishReservationByOwner';
import getBooks from '@salesforce/apex/BookController.getLentBookReservationsByOwnerId';
import updateReservationStatus from '@salesforce/apex/ReservationController.updateReservationStatus';
import upsertBook from '@salesforce/apex/BookController.upsertBook';

export default class LentBooks extends LightningElement {

  userId = userId;

  @track records = [];

  @track deletionIsOpen = false;
  @track deletedRecord;

  @track editionIsOpen = false;
  @track editedRecord = {};

  @track messengerIsOpen = false;
  @track messengerRecord;

  @track overviewIsOpen = false;
  @track overviewRecord;

  @track reservationConfirmIsOpen = false;
  @track reservationFinishIsOpen = false;
  @track reservationRecord;
  @track reservationConfirmNewStatus = null;

  @track filteredItems = {};
  @track searchTerm = '';
  @track currentPageReference;

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

  @wire(CurrentPageReference)
  wiresCurrentPageReference(data) {
    this.currentPageReference = data;
    const searchTerm = this.currentPageReference.state.c__searchTerm;
    if (searchTerm) {
      this.searchTerm = searchTerm;
    }
  }

  get hasRecords() {
    return !this.isLoading && this.records?.length > 0;
  }

  get isEmptyPage() {
    return !this.isLoading && this.records?.length === 0;
  }

  handleOpenBookHistory(event) {
    if (this.overviewIsOpen) {
      this.handleCloseOverview();
    }

    this.searchTerm = event.detail.searchTerm;
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

  handleOpenEditionModal(event) {
    this.editedRecord = event.detail.record;
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

  handleOpenReservationConfirmModal(event) {
    this.reservationRecord = event.detail.record;
    this.reservationConfirmNewStatus = event.detail.status;
    this.reservationConfirmIsOpen = true;
  }

  async handleOkReservationConfirmModal(event) {
    this.handleCloseReservationConfirmModal();

    await updateReservationStatus(event.detail);
    await refreshApex(this.wiredResponse);
  }

  handleCloseReservationConfirmModal() {
    this.reservationConfirmIsOpen = false;
    this.reservationRecord = {};
    this.reservationConfirmNewStatus = null;
  }

  handleOpenReservationFinishModal(event) {
    this.reservationRecord = event.detail.record;
    this.reservationFinishIsOpen = true;
  }

  async handleOkReservationFinishModal(event) {
    this.handleCloseReservationFinishModal();

    await finishReservation(event.detail);
    await refreshApex(this.wiredResponse);
  }

  handleCloseReservationFinishModal() {
    this.reservationFinishIsOpen = false;
    this.reservationRecord = {};
  }

  handleFilter(event) {
    this.filteredItems = event.detail.selected;
  }

  handleSearch(event) {
    this.searchTerm = event.detail.value;
  }
}