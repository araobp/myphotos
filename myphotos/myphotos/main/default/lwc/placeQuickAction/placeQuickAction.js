import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_ADDRESS_FIELD from '@salesforce/schema/Record__c.Address__c';
import addPlace from '@salesforce/apex/RecordObject.addPlace';
import { CloseActionScreenEvent } from 'lightning/actions';

const RECORD_GEOLOCATION_LATITUDE_FIELD = 'Record__c.Geolocation__Latitude__s';
const RECORD_GEOLOCATION_LONGITUDE_FIELD = 'Record__c.Geolocation__Longitude__s';

const recordFields = [
  RECORD_NAME_FIELD,
  RECORD_ADDRESS_FIELD,
  RECORD_GEOLOCATION_LATITUDE_FIELD,
  RECORD_GEOLOCATION_LONGITUDE_FIELD
];

export default class PlaceQuickAction extends LightningElement {
  @api recordId;

  name;
  address;
  latitude;
  longitude;
  result;

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    this.name = getFieldValue(data, RECORD_NAME_FIELD);
    this.address = getFieldValue(data, RECORD_ADDRESS_FIELD);
    this.latitude = getFieldValue(data, RECORD_GEOLOCATION_LATITUDE_FIELD);
    this.longitude = getFieldValue(data, RECORD_GEOLOCATION_LONGITUDE_FIELD);
  }

  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  handleAdd() {
    addPlace({ name: this.name, address: this.address, latitude: this.latitude, longitude: this.longitude })
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