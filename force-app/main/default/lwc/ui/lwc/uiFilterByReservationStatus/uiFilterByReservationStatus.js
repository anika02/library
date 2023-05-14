import { LightningElement, api } from 'lwc';

import { STATUS_OPTIONS } from 'c/utils';

export default class UiFilterByReservationStatus extends LightningElement {

  @api isOpen = false;

  _selected = [];
  statuses = STATUS_OPTIONS;

  @api set selected(values) {
    this._selected = values ? values.map(item => item.value) : [];
  }

  get selected() {
    return this._selected;
  }

  handleChange(event) {
    this._selected = event.detail.value;
  }

  handleModalClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    this.dispatchEvent(new CustomEvent('modal_ok', {
      detail: {
        name: 'reservationStatuses',
        selected: this.statuses.filter(item => this.selected.includes(item.value)),
      },
    }));
  }
}