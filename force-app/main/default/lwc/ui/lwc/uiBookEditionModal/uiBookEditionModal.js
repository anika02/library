import { LightningElement, api, track, wire } from 'lwc';

import getAllCategories from '@salesforce/apex/BookController.getAllCategories';
import getFileIdByDocumentId from '@salesforce/apex/FileController.getFileIdByDocumentId';
import deleteDocumentById from '@salesforce/apex/FileController.deleteDocumentById';
import deleteDocumentByVersionId from '@salesforce/apex/FileController.deleteDocumentByVersionId';
import { refreshApex } from "@salesforce/apex";

export default class UiBookEditionModal extends LightningElement {
  @api isOpen = false;
  @api isEditionForm = false;

  @track documentId;
  @track photoError = false;
  photoId;

  _record = {};

  categories = [];
  values = {};
  hasChanges = false;

  @wire(getAllCategories)
  wireBooks({ error, data }) {
    if (data) {
      this.categories = data;
    } else if (error) {
      console.log(error);
    }
  }

  wiredFile;
  @wire(getFileIdByDocumentId, { documentId: '$documentId' })
  setFile(response) {
    this.wiredFile = response;
    const { error, data } = response;

    if (data) {
      this.photoId = data;
      console.log('photoId', JSON.stringify(this.photoId));
    } else if (error) {
      console.log(error);
    }
  }

  @api set record(v) {
    this._record = { ...v };
    if (this._record.Id) {
      this.values.Id = this._record.Id;
      this.photoId = this._record.Photo_Id__c;
    }
  }

  get record() {
    return this._record;
  }

  get title() {
    return this.isEditionForm ? 'Book Edition Form' : 'Book Creation Form';
  }

  get subtitle() {
    return this.record.Id ? `${this.record.Author__c}: "${this.record.Name}"`: '';
  }

  get acceptedFormats() {
    return [".png", ".jpg", ".jpeg"];
  }

  get inputFieldElms() {
    return this.template.querySelectorAll('lightning-input, lightning-dual-listbox, lightning-textarea');
  }

  get photoURL() {
    return `/sfc/servlet.shepherd/version/download/${this.photoId}`;
  }

  handleChange(event) {
    this.hasChanges = true;
    this.values[event.target.name] = event.target.value.trim();
  }

  handleChangeList(event) {
    this.hasChanges = true;
    this.values[event.target.name] = event.target.value.join(';');
  }

  handleModalClose() {
    this.isOpen = false;
    if (this.documentId) {
      deleteDocumentById({ documentId: this.documentId });
      this.documentId = null;
    }
    this.dispatchEvent(new CustomEvent('modal_close'));
  }

  handleModalOk() {
    if (!this.photoId) {
      this.photoError = true;
    }

    const allValid = [
      ...this.inputFieldElms,
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);
    console.log('photoId before', this.photoId, !this.photoId);

    if (allValid && !this.photoError) {
      this.isOpen = false;
      if (this.hasChanges) {
        this.dispatchEvent(new CustomEvent('modal_ok', {
          detail: {
            updatedValues: this.values,
            documentId: this.documentId,
          },
        }));
        if (this.documentId) {
          deleteDocumentByVersionId({ versionId: this.record.Photo_Id__c }).then(() => {
            this.documentId = null;
          });
        }
      }
    }
  }

  handleUploadFinished(event) {
    this.hasChanges = true;
    this.photoError = false;

    if (this.documentId) {
      deleteDocumentById({ documentId: this.documentId });
    }

    this.documentId = event.detail.files[0].documentId;
    refreshApex(this.wiredFile);
  }
}