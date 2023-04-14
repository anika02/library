import { LightningElement, api } from 'lwc';

export default class UiReaderBookOverview extends LightningElement {
    @api isOpen;
    @api record;

    get favouriteIcon() {
        return this.record.Favourites__r ? 'favourite-black' : 'favourite';
    }

    get wishListIcon() {
        return this.record.Wish_Lists__r ? 'bookmark-black' : 'bookmark';
    }

    handleOverlayClick() {
        this.dispatchEvent(new CustomEvent('close'));
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