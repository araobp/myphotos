import { LightningElement, api, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';
import getImageURLs from '@salesforce/apex/ImageURL.getImageURLs';

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
    getImageURLs({recordId: this.recordId})
    .then(urlMap => {
      for (let [title, url] of Object.entries(urlMap)) {
        if (title.endsWith('_small') || title.endsWith('_small.jpeg')) {
          console.log(`<small> title: ${title}, imageURL: ${url}`);
        } else {
          console.log(`<large> title: ${title}, imageURL: ${url}`);
          this.imageURL = url;
        }
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