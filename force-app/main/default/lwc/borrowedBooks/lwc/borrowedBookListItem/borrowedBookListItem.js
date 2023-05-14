import { LightningElement, api } from 'lwc';

import {
  STATUS_CREATED,
  STATUS_CONFIRMED,
  STATUS_FINISHED_BY_OWNER,
  getStatusLabel,
  formatDate
} from 'c/utils';

export default class BorrowedBookListItem extends LightningElement {
  @api record;

  finishedAllowedStatuses = [ STATUS_CONFIRMED, STATUS_FINISHED_BY_OWNER ];

  get reservation() {
    return this.record?.Reservations__r ? this.record?.Reservations__r[0] : null;
  }

  get status() {
    return getStatusLabel(this.reservation?.Status__c);
  }

  get reservationPeriod() {
    return this.reservation
      ? `${formatDate(this.reservation.Start_Date__c)} - ${formatDate(this.reservation.End_Date__c)}`
      : '';
  }

  get isStatusCreated() {
    return this.reservation?.Status__c === STATUS_CREATED;
  }

  get isFinishedAllowed() {
    return this.finishedAllowedStatuses.includes(this.reservation?.Status__c);
  }

  get favouriteIcon() {
    return this.record.Favourites__r ? 'favourite-black' : 'favourite';
  }

  get wishListIcon() {
    return this.record.Wish_Lists__r ? 'bookmark-black' : 'bookmark';
  }

  handleOpenOverview(event) {
    this.dispatchEvent(new CustomEvent('open_overview', { detail: event.detail }));
  }

  handleOpenMessenger() {
    this.dispatchEvent(new CustomEvent('open_messenger', {
      detail: {
        reservationId: this.reservation.Id,
      },
    }));
  }

  handleFavourite() {
    this.dispatchEvent(new CustomEvent('favourite', {
      detail: {
        recordId: this.record.Id
      }
    }));
  }

  handleWishList() {
    this.dispatchEvent(new CustomEvent('wish_list', {
      detail: {
        recordId: this.record.Id
      }
    }));
  }

  handleOpenEditReservationModal() {
    this.dispatchEvent(new CustomEvent('open_edit_reservation', {
      detail: {
        recordId: this.record.Id,
      },
    }));
  }

  handleOpenCancelReservationModal() {
    this.dispatchEvent(new CustomEvent('open_cancel_reservation', {
      detail: {
        record: this.record,
      },
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