import { LightningElement, api, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import IMAGE_URL_UPDATE_MESSAGE from '@salesforce/messageChannel/ImageURL__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import RECORD_NAME_FIELD from '@salesforce/schema/Record__c/Name';
import IMAGE_URL_FIELD from '@salesforce/schema/Record__c/ImageURL__c';

export default class PhotoViewer extends LightningElement {
  @api recordId;
  showModal = false;
  imageURL = null;
  name

  subscription = null;

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, RECORD_NAME_FIELD);
      this.imageURL = getFieldValue(data, IMAGE_URL_FIELD);
    }
  }

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      IMAGE_URL_UPDATE_MESSAGE,
      (message) => {
        this.name = message.name;
        this.imageURL = message.imageURL;
      }
    );
  }

  disconnectedCallback() {
    if (this.subscription != null) {
      unsubscribe(this.subscription);
      this.subscription = null;
    }
  }

  enableModal() {
    this.showModal = true;
  }

  disableModal() {
    this.showModal = false;
  }
}