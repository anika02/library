import {api, LightningElement} from 'lwc';

export default class BookOverview extends LightningElement {
    @api record;
    @api isOpen;

    contactFields = ['phone', 'email', 'telegram', 'viber', 'instagram'];

    get contacts() {
        let contacts = [];
        for (const [key, value] of Object.entries(this.record)) {
            console.log(key, value, this.contactFields.includes(key));
            if (this.contactFields.includes(key)) {
                console.log(key, value);
                console.log(JSON.stringify({key: key, value: value}));
                contacts.push({key: key, value: value});
                console.log(JSON.stringify(contacts));
            }
        }
        console.log(contacts);
        return contacts;
    }

    handleOverlayClick(event) {
        if (event.target.dataset.id === 'backdrop') {
            this.dispatchEvent(new CustomEvent('close'));
        }
    }
}