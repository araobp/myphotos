import { LightningElement, api, wire } from 'lwc';
import addPlace from '@salesforce/apex/PlaceObject.addPlace';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_ADDRESS_FIELD from '@salesforce/schema/Record__c.Address__c';

const recordFields = [ RECORD_NAME_FIELD, RECORD_ADDRESS_FIELD ];

export default class PlaceQuickAction extends LightningElement {
  @api recordId;

  name;
  address;
  result;

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, RECORD_NAME_FIELD);
      this.address = getFieldValue(data, RECORD_ADDRESS_FIELD);
    }
  }

  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  handleAdd() {
    addPlace({ recordId: this.recordId })
      .then(success => {
        //this.dispatchEvent(new CloseActionScreenEvent());
        if (success) {
          this.result = 'New place added!';
        } else {
          this.result = 'Place duplicated!';
        }
        this.template.querySelector('[data-element="add"]').blur();
      });
  }
}