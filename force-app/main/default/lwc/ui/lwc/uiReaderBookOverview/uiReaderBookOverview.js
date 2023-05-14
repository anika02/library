import { LightningElement, api } from 'lwc';

import {
  STATUS_CREATED,
  STATUS_CONFIRMED,
  STATUS_FINISHED_BY_OWNER
} from 'c/utils';

export default class UiReaderBookOverview extends LightningElement {
  @api isOpen;
  @api record;

  finishedAllowedStatuses = [ STATUS_CONFIRMED, STATUS_FINISHED_BY_OWNER ];

  get reservation() {
    return this.record?.Reservations__r ? this.record?.Reservations__r[0] : null;
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

  handleOpenMessenger() {
    this.dispatchEvent(new CustomEvent('open_messenger', {
      detail: {
        reservationId: this.reservation.Id,
      },
    }));
  }

  handleOverlayClick() {
    this.dispatchEvent(new CustomEvent('close'));
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

  handleOpenReservationModal() {
    this.dispatchEvent(new CustomEvent('open_reservation', {
      detail: {
        recordId: this.record.Id,
      },
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