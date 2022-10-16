import { LightningElement, api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import deleteFile from '@salesforce/apex/FileUploader.deleteFile';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class FileQuickAction extends LightningElement {
  @api recordId;
  result;

  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  handleDelete() {
    deleteFile({ recordId: this.recordId })
      .then(success => {
        //this.dispatchEvent(new CloseActionScreenEvent());
        if (success) {
          deleteRecord(this.recordId)
            .then(_ => {
              this.result = 'Deleted';
              this.template.querySelector('[data-element="delete"]').blur();
            });
        } else {
          this.result = 'Delete failed!';
          this.template.querySelector('[data-element="delete"]').blur();
        }
      });
  }
}