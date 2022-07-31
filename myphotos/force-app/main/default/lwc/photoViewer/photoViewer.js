import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getImage } from './myphotos';

import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_UUID_FIELD from '@salesforce/schema/Record__c.uuid__c';
import { loadScript } from 'lightning/platformResourceLoader';

const recordFields = [RECORD_NAME_FIELD, RECORD_UUID_FIELD];

export default class PhotoViewer extends LightningElement {
  @api recordId;
  name;
  uuid;
  show = false;
  imageURL = null;

  username;
  password;
  url;

  renderedCallback() {
    if (this.show) {
      if (this.username !== null) {
        this.template.querySelector('lightning-input[data-name="username"]').value = this.username;
      }
      if (this.password !== null) {
        this.template.querySelector('lightning-input[data-name="password"]').value = this.password;
      }
      if (this.url !== null) {
        this.template.querySelector('lightning-input[data-name="url"]').value = this.url;
      }
    }

    if (this.imageURL === null && this.username !== null && this.password !== null && this.url !== null && this.uuid != null) {
      getImage(this.url, this.username, this.password, this.uuid)
      .then(imageURL => this.imageURL = imageURL);
    }

  }

  connectedCallback() {
    this.username = localStorage.getItem("myphotos:username");
    this.password = localStorage.getItem("myphotos:password");
    this.url = localStorage.getItem("myphotos:url");
    console.log(this.username);
  }

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadUUID({ error, data }) {
    if (error) {
      console.log("***");
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, RECORD_NAME_FIELD);
      this.uuid = getFieldValue(data, RECORD_UUID_FIELD);
      this.loadImage();
    }
  }

  loadImage() {
    console.log(this.name + ',' + this.uuid);
  }

  onSave() {
    console.log("on click");
    this.username = this.template.querySelector('lightning-input[data-name="username"]').value;
    this.password = this.template.querySelector('lightning-input[data-name="password"]').value;
    this.url = this.template.querySelector('lightning-input[data-name="url"]').value;
    console.log(this.username);
    localStorage.setItem("myphotos:username", this.username);
    localStorage.setItem("myphotos:password", this.password);
    localStorage.setItem("myphotos:url", this.url);
    this.show = false;
  }

  onCancel() {
    this.show = false;
  }

  showSettings() {
    this.show = !this.show;
  }
}