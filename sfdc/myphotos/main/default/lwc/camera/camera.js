import { LightningElement, wire } from 'lwc';
import findPlace from '@salesforce/apex/PlaceObject.findPlace';
import createRecord from '@salesforce/apex/RecordObject.createRecord';

import { GPS } from 'c/gps';
import { uuidv4 } from 'c/util';

const IMAGE_SIZE = 432;

export default class camera extends LightningElement {

  webcam = null;
  imageURL = null;
  imageURL_small = null;
  imageURL_base64 = null;
  position = [0, 0];
  address = '';
  uploading = false;
  positioning = true;

  constructor() {
    super();
    this.gps = new GPS();
    this.position = this.gps.position;
    this.address = this.gps.address;
    try {
      this.uuid = crypto.randomUUID();
    } catch (e) {
      this.uuid = uuidv4();
    }
    this.datetime = this.datetimeGmt();
  }

  datetimeGmt = _ => new Date().toISOString().replace('T', ' ').substring(0, 19);

  connectedCallback() {
    this.gps.getGeoLocation((position, address) => {
      this.positioning = false;
      this.position = position;
      this.address = address;
      findPlace()
        .then(name => {
          this.template.querySelector('[data-element="name"]').value = name;
        })
    });
  }

  handleUpload() {
    this.uploading = true;

    const name = this.template.querySelector('[data-element="name"]').value;
    const memo = this.template.querySelector('[data-element="memo"]').value;
    this.datetime = this.datetimeGmt();

    try {
      this.uuid = crypto.randomUUID();
    } catch (e) {  // Some browsers do not support crypto.randomUUID();
      this.uudid = uuidv4();
    }

    try {
      createRecord({
        'name': name,
        'memo': memo,
        'address': this.address,
        'timestampGmt': this.datetime,
        'latitude': this.position[0],
        'longitude': this.position[1],
        'uuid': this.uuid,
        'base64': this.imageURL_base64
      })
        .then(id => {
          console.log('New record: ' + id);
          this.uploading = false;
          this.template.querySelector('[data-element="upload"]').blur();
        });
    } catch (e) {
      console.log(e);
      this.uploading = false;
      this.template.querySelector('[data-element="upload"]').blur();
    }
  }

  handleCapture = e => {
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = _ => {
      const imageURL = reader.result;
      this.resizeImage(imageURL, IMAGE_SIZE, resizedImageURL => {
        this.imageURL = resizedImageURL;
        this.imageURL_base64 = resizedImageURL.split(',')[1];
      });
    };
    reader.readAsDataURL(f);
  }

  dataURItoBlob = async dataURI => {
    return await fetch(dataURI).then(r => r.blob());
  }

  resizeImage = (imageURL, targetWidth, callback) => {
    const img = document.createElement('img');
    img.addEventListener('load', function () {
      const width = img.width;
      const height = img.height;
      console.log('width: ' + width + ', height: ' + height);

      const canvas = document.createElement('canvas');

      if (height > width) {
        canvas.width = targetWidth;
        canvas.height = height * targetWidth / width;
      } else {
        canvas.height = targetWidth;
        canvas.width = width * targetWidth / height;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const resizedImageURL = canvas.toDataURL('image/jpeg');
      callback(resizedImageURL);
    });
    img.src = imageURL;
  }

}