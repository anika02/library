import { LightningElement, api } from 'lwc';

export default class UiReaderReservationFinishModal extends LightningElement {
  @api isOpen = false;

  @api record = {};
  values = {};

  get subtitle() {
    return this.record.Id
      ? `${this.record.Author__c}: "${this.record.Name}"`
      : '';
  }

  get inputFieldElms() {
    return this.template.querySelectorAll('lightning-textarea');
  }

  handleChange(event) {
    this.values[event.target.name] = event.target.value.trim();
  }

  async handleModalClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  async handleModalOk() {
    const allValid = [
      ...this.inputFieldElms,
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);

    if (allValid) {
      if (this.values) {
        this.dispatchEvent(new CustomEvent('modal_ok', {
          detail: {
            reservationId: this.record?.Reservations__r[0].Id,
            comments: this.values,
          },
        }));
      }
    }
  }
}