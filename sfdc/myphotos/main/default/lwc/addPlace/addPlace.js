import { LightningElement, api, wire } from 'lwc';
import addPlace from '@salesforce/apex/RecordObject.addPlace';
import isAlreadyRegistered from '@salesforce/apex/RecordObject.isAlreadyRegistered';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_ADDRESS_FIELD from '@salesforce/schema/Record__c.Address__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const recordFields = [RECORD_NAME_FIELD, RECORD_ADDRESS_FIELD];

export default class AddPlace extends LightningElement {

  @api recordId;

  name = null;
  address;
  already = false;

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, RECORD_NAME_FIELD);
      this.address = getFieldValue(data, RECORD_ADDRESS_FIELD);
    }
  }

  connectedCallback() {
    isAlreadyRegistered({ recordId: this.recordId })
      .then(already => this.already = already);
  }

  handleAddPlace() {
    addPlace({ recordId: this.recordId })
      .then(success => {
        this.template.querySelector('lightning-button').blur();
        if (success) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Success',
              message: 'Place added',
              variant: 'success'
            })
          );
        } else {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Duplicated',
              message: 'Place not added',
              variant: 'warning'
            })
          );
        }
      });
  }
}