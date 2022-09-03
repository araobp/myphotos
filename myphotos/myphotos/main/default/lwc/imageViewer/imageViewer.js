import { LightningElement, api, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';
import getImageURL from '@salesforce/apex/ImageURL.getImageURL';

export default class PhotoViewer extends LightningElement {
  @api recordId;
  showModal = false;
  imageURL = null;

  subscription = null;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      RECORD_ID_UPDATE_MESSAGE,
      (message) => {
        this.recordId = message.recordId;
        this.loadImage();
      }
    );
    this.loadImage();
  }

  disconnectedCallback() {
    if (this.subscription != null) {
      unsubscribe(this.subscription);
      this.subscription = null;
    }
  }

  loadImage() {
    console.log('recordId: ' + this.recordId);
    getImageURL({ recordId: this.recordId, thumbnail: false })
      .then(url => {
        console.log(`found: ${url.found}, title: ${url.title}, url: ${url.url}`);
        if (url.found) {
          this.imageURL = url.url;
        }
      });
  }

  enableModal() {
    this.showModal = true;
  }

  disableModal() {
    this.showModal = false;
  }
}