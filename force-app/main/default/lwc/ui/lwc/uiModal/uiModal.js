import { LightningElement, api } from 'lwc';

export default class UiModal extends LightningElement {
  @api isOpen = false;

  @api titleIcon;
  @api title;
  @api subtitle;

  @api buttonCancelDisabled = false;
  @api buttonCancelHide = false;
  @api buttonCancelValue = 'Cancel';

  @api buttonDoneDisabled = false;
  @api buttonDoneHide = false;
  @api buttonDoneValue = 'Done';

  get showClass() {
    return this.isOpen ? 'slds-is-active' : 'slds-hide';
  }

  get headerClasses() {
    return 'slds-modal__header slds-grid';
  }

  get showTitle() {
    return !!this.title;
  }

  get hasActions() {
    return !(this.buttonCancelHide && this.buttonDoneHide);
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleOk() {
    this.dispatchEvent(new CustomEvent('modal_ok'));
  }
}