import { LightningElement, api } from 'lwc';

export default class UiBookDeletionModal extends LightningElement {

  @api isOpen = false;
  @api record = null;

  handleModalClose() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal_ok'));
  }
}