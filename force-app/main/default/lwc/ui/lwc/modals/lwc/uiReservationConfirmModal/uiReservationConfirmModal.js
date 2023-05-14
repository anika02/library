import { LightningElement, api } from 'lwc';

import {
  STATUS_CANCELED,
  STATUS_CONFIRMED,
  STATUS_REJECTED
} from 'c/utils';

export default class UiReservationConfirmModal extends LightningElement {

  @api isOpen = false;
  @api record = null;

  _status;
  statuses = new Set([ STATUS_CANCELED, STATUS_CONFIRMED, STATUS_REJECTED ]);

  mapStatusToAction = {
    [ STATUS_CANCELED ]: 'cancel',
    [ STATUS_CONFIRMED ]: 'confirm',
    [ STATUS_REJECTED ]: 'reject',
  }

  @api set status(value) {
    if (!this.statuses.has(value)) {
      throw Error(`Incorrect status value '${value}'`);
    }

    this._status = value;
  }

  get status() {
    return this._status;
  }

  get action() {
    return this.mapStatusToAction[this.status];
  }

  get bookReader() {
    return this.status === STATUS_CANCELED
      ? 'your'
      : `the ${this.record?.Reservations__r[0].CreatedBy.Name}`;
  }

  handleModalClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    this.dispatchEvent(new CustomEvent('modal_ok', {
      detail: {
        reservationId: this.record.Reservations__r[0].Id,
        status: this.status,
      },
    }));
  }
}