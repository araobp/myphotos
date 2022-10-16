import { LightningElement, api } from 'lwc';
import deleteRecord from '@salesforce/apex/RecordObject.deleteRecord';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class FileQuickAction extends LightningElement {
  @api recordId;
  result;

  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  handleDelete() {
    deleteRecord({ recordId: this.recordId })
      .then(success => {
        if (success) {
          this.result = 'Deleted';
        } else {
          this.result = 'Delete failed!'
        }
        this.template.querySelector('[data-element="delete"]').blur();
      });
  }
}