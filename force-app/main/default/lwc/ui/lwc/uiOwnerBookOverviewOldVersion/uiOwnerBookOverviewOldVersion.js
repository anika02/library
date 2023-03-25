import {api, LightningElement} from 'lwc';

export default class UiOwnerBookOverviewOldVersion extends LightningElement {
    @api record;
    @api isOpen;

    contactFields = ['phone', 'email', 'telegram', 'viber', 'instagram'];

    get contacts() {
        let contacts = [];
        for (const [key, value] of Object.entries(this.record)) {
            if (this.contactFields.includes(key)) {
                contacts.push({key: key, value: value});
            }
        }
        return contacts;
    }

    get hasStatus() {
        return !!this.record.status;
    }

    handleOverlayClick(event) {
        if (event.target.dataset.id === 'backdrop') {
            this.dispatchEvent(new CustomEvent('close'));
        }
    }
}