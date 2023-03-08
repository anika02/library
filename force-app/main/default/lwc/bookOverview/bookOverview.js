import {api, LightningElement} from 'lwc';

export default class BookOverview extends LightningElement {
    @api record;
    @api isOpen;

    handleOverlayClick(event) {
        if (event.target.dataset.id === 'backdrop') {
            this.dispatchEvent(new CustomEvent('close'));
        }
    }
}