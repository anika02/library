import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from "@salesforce/apex";

import userId from '@salesforce/user/Id';

import { formatDate } from 'c/utils';

import getMessages from '@salesforce/apex/MessageController.getMessagesByReservationId';
import insertMessage from '@salesforce/apex/MessageController.insertMessage';

export default class UiMessenger extends LightningElement {

  @api isOpen;

  @track messagesGroups = [];

  @track shareContactsIsOpen = false;

  _record;
  isLoading = true;
  isScrollDown = true;

  renderedCallback() {
    if (this.isScrollDown) {
      this.scrollDown();
      this.isScrollDown = false;
    }
  }

  @wire(getMessages, {
    reservationId: '$reservationId'
  })
  wiredMessages(response) {
    this.isLoading = true;
    const { data, error } = this.wiredResponse = response;

    if (data) {
      this.groupMessagesByDates(data);
      this.isLoading = false;
      this.isScrollDown = true;

    } else if (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  @api set record(v) {
    this._record = { ...v };
    this.shareContactsIsOpen = false;
  }

  get record() {
    return this._record;
  }

  get reservation() {
    return this.record?.Reservations__r[0];
  }

  get reservationId() {
    return this.reservation.Id;
  }

  get interlocutor() {
    return this.record.OwnerId === userId
      ? `${this.reservation.CreatedBy.Name} (Reader)`
      : `${this.record.Owner.Name} (Book Owner)`;
  }

  get reservationPeriod() {
    return this.reservation
      ? `${formatDate(this.reservation.Start_Date__c)} - ${formatDate(this.reservation.End_Date__c)}`
      : '';
  }

  handleClose() {
      this.dispatchEvent(new CustomEvent('close'));
  }

  async handleSendMessage(event) {
    await insertMessage({ reservationId: this.reservationId, text: event.detail.value });
    await refreshApex(this.wiredResponse);
  }

  handleOpenShareContactsModal() {
    this.shareContactsIsOpen = true;
    this.isScrollDown = true;
  }

  async handleOkShareContacts(event) {
    this.isLoading = true;
    this.handleCloseShareContacts();
    const text = event.detail.contacts
      .map(contact => `${contact.label}: ${contact.value}`)
      .join(',<br>');

    await insertMessage({ reservationId: this.reservationId, text: text });
    await refreshApex(this.wiredResponse);
  }

  handleCloseShareContacts() {
    this.shareContactsIsOpen = false;
  }

  handleShareContactsLoaded() {
    this.scrollDown();
  }

  groupMessagesByDates(data) {
    const messagesGroups = {};
    data
      .forEach(message => {
        const date = formatDate(message.Time__c);

        if (!messagesGroups[date]) {
          messagesGroups[date] = {
            date: date,
            items: [],
          }
        }

        messagesGroups[date].items.push(message);
      });

    this.messagesGroups = Object.keys(messagesGroups).map(key => messagesGroups[key]);
  }

  scrollDown() {
    const messagesElm = this.template.querySelector('.messages');
    messagesElm.scrollTop = messagesElm.scrollHeight;
  }
}