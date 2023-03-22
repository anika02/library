import {api, LightningElement} from 'lwc';


export default class UiOwnerBookListItem extends LightningElement {
    @api record;

    handleOpenOverview() {
        this.dispatchEvent(new CustomEvent('open_overview', {
            detail: {
                book: this.record,
            },
        }));
    }

    get hasStatus() {
        return !!this.record.status;
    }

    get date() {
        return this.hasStatus ? `, ${this.record.date}` : '';
    }
}