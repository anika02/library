import {api, LightningElement} from 'lwc';

export default class UiReaderBookListItem extends LightningElement {
    @api record;

    handleOpenOverview() {
        this.dispatchEvent(new CustomEvent('open_overview', {
            detail: {
                record: this.record,
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