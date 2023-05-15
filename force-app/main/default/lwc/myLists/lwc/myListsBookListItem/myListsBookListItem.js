import { LightningElement, api } from 'lwc';
import { getStatusLabel } from 'c/utils';

export default class MyListsBookListItem extends LightningElement {
  _record;

  @api set record(v) {
    this._record = { ...v };
  }

  get record() {
    return this._record;
  }

  get reservation() {
    return this.record?.Reservations__r ? this.record?.Reservations__r[0] : null;
  }

  get status() {
    return getStatusLabel(this.reservation?.Status__c);
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
}