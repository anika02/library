import { LightningElement, api } from 'lwc';

import {
  STATUS_CREATED,
  STATUS_CONFIRMED,
  STATUS_REJECTED,
  STATUS_FINISHED_BY_READER,
  getStatusLabel,
  formatDate,
} from 'c/utils';

export default class LentBookListItem extends LightningElement {

  @api record;

  finishedAllowedStatuses = [ STATUS_CONFIRMED, STATUS_FINISHED_BY_READER ];

  get reservation() {
    return this.record?.Reservations__r[0];
  }

  get status() {
    return getStatusLabel(this.reservation?.Status__c).toUpperCase();
  }

  get isStatusCreated() {
    return this.reservation?.Status__c === STATUS_CREATED;
  }

  get isFinishedAllowed() {
    return this.finishedAllowedStatuses.includes(this.reservation?.Status__c);
  }

  get address() {
    return this.reservation ? `${this.reservation.CreatedBy.City}, ${this.reservation.CreatedBy.Country}` : '';
  }

  get reservationPeriod() {
    return this.reservation
      ? `${formatDate(this.reservation.Start_Date__c)} - ${formatDate(this.reservation.End_Date__c)}`
      : '';
  }

  get reader() {
    return this.reservation?.CreatedBy.Name;
  }

  handleOpenBookHistory() {
    this.dispatchEvent(new CustomEvent('open_book_history', {
      detail: {
        searchTerm: this.record.Name,
      },
    }));
  }

  handleOpenOverview() {
    this.dispatchEvent(new CustomEvent('open_overview', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenMessenger() {
    this.dispatchEvent(new CustomEvent('open_messenger', {
      detail: {
        reservationId: this.reservation.Id,
      },
    }));
  }

  handleOpenEditionModal() {
    this.dispatchEvent(new CustomEvent('open_edition', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenDeletionModal() {
    this.dispatchEvent(new CustomEvent('open_deletion', {
      detail: {
        record: this.record,
      },
    }));
  }

  handleOpenReservationConfirmModal() {
    this.dispatchEvent(new CustomEvent('change_status', {
      detail: {
        record: this.record,
        status: STATUS_CONFIRMED
      }
    }));
  }

  handleOpenRejectReservationModal() {
    this.dispatchEvent(new CustomEvent('change_status', {
      detail: {
        record: this.record,
        status: STATUS_REJECTED
      }
    }));
  }

  handleOpenReservationFinishModal() {
    this.dispatchEvent(new CustomEvent('finish', {
      detail: {
        record: this.record
      }
    }));
  }
}