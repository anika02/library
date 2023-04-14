import { LightningElement, api } from 'lwc';

export default class SearchBookListItem extends LightningElement {
  @api record;

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
        record: this.record
      }
    }));
  }

  handleWishList() {
    this.dispatchEvent(new CustomEvent('wish_list', {
      detail: {
        record: this.record
      }
    }));
  }
}