import {LightningElement, api, track, wire } from 'lwc';

import {
  formatDate,
  formatDateDefault
} from 'c/utils';

import getReservationDatesByBookId from '@salesforce/apex/ReservationController.getReservationDatesByBookId';

export default class UiReservationModal extends LightningElement {
  @api isOpen = false;

  _record = {};
  availableSlots;

  @track selectedReservationSlotValue;
  reservationSlotOptions = [];
  dropdownIsReady = false;

  @track reservation = {};

  @api set record(v) {
    this._record = { ...v };
    if (this._record.Reservations__r) {
      this.reservation = { ...this._record.Reservations__r[0] };
    }
  }

  get record() {
    return this._record;
  }

  wiredReservations;

  @wire(getReservationDatesByBookId, {
    bookId: '$record.Id'
  })
  setReservations(response) {
    this.wiredReservations = response;
    const {error, data} = response;

    if (data) {
      this.generateAvailableSlots(data);
    } else if (error) {
      console.log(error);
    }

    this.isLoading = false;
  }

  get subtitle() {
    return this.record.Id ? `${this.record.Author__c}: "${this.record.Name}"`: '';
  }

  get selectedReservationSlot() {
    return this.availableSlots.find(item => item.min === this.selectedReservationSlotValue);
  }

  get startMaxLimitValue() {
    return this.reservation.End_Date__c || this.selectedReservationSlot.max;
  }

  get endMinLimitValue() {
    return this.reservation.Start_Date__c || this.selectedReservationSlot.min;
  }

  get inputFieldElms() {
    return this.template.querySelectorAll('lightning-input');
  }

  handleReservationSlotChange(event) {
    this.reservation.Start_Date__c = null;
    this.reservation.End_Date__c = null;
    this.selectedReservationSlotValue = event.detail.value;
  }

  handleChange(event) {
    this.reservation[event.target.name] = event.target.value;
  }

  handleModalClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    const allValid = [
      ...this.inputFieldElms,
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);

    if (allValid) {
      this.dispatchEvent(new CustomEvent('modal_ok', {
        detail: {
          reservation: {
            ...this.reservation,
            Book__c: this.record.Id,
          },
        },
      }));
    }
  }

  generateAvailableSlots(data) {
    const startLimit = new Date();

    this.availableSlots = [{
      min: formatDateDefault(startLimit),
    }];

    for (const reservation of data) {
      if (reservation.Start_Date__c === this.availableSlots.at(-1).min) {
        this.availableSlots.at(-1).min = this.addDays(reservation.End_Date__c, 1);
      } else {
        this.availableSlots.at(-1).max = this.addDays(reservation.Start_Date__c, -1);
        this.availableSlots.push({ min: this.addDays(reservation.End_Date__c, 1) });
      }
    }

    this.availableSlots.at(-1).max = null;

    for (const slot of this.availableSlots) {
      this.reservationSlotOptions.push({
        label: slot.max ? `${formatDate(slot.min)} - ${formatDate(slot.max)}` : `from ${formatDate(slot.min)}`,
        value: slot.min,
      });
    }

    this.selectedReservationSlotValue = this.reservationSlotOptions[0].value;

    if (this.reservation.Id) {
      for (const slot of this.reservationSlotOptions.reverse()) {
        if (this.compareDates(this.reservation.Start_Date__c, slot.value)) {
          this.selectedReservationSlotValue = slot.value;
          break;
        }
      }
    }
    this.dropdownIsReady = true;
  }

  addDays(value, days) {
    let date = value instanceof Date ? value : new Date(value);
    date.setDate(date.getDate() + days);
    return formatDateDefault(date);
  }

  compareDates(date1, date2) {
    date1 = date1 instanceof Date ? date1 : new Date(date1);
    date2 = date2 instanceof Date ? date2 : new Date(date2);
    return date1 > date2;
  }
}