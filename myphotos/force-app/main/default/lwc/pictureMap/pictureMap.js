import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_ADDRESS_FIELD from '@salesforce/schema/Record__c.Address__c';

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';

const RECORD_GEOLOCATION_LATITUDE_FIELD = 'Record__c.Geolocation__Latitude__s';
const RECORD_GEOLOCATION_LONGITUDE_FIELD = 'Record__c.Geolocation__Longitude__s';

const recordFields = [
  RECORD_NAME_FIELD,
  RECORD_ADDRESS_FIELD,
  RECORD_GEOLOCATION_LATITUDE_FIELD,
  RECORD_GEOLOCATION_LONGITUDE_FIELD
];

export default class PictureMap extends LightningElement {
  @api recordId;
  @api height = 400;
  name;
  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  address = "<Unknown>";

  renderedCallback() {
    this.template.querySelector('[data-id="map"]').style.height = `${this.height}px`;
    console.log(RECORD_GEOLOCATION_LONGITUDE_FIELD);
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, LEAFLET + '/leaflet.css'),
      loadScript(this, LEAFLET + '/leaflet.js'),
    ]).then(() => {
      this.draw();
    });
  }

  draw() {
    const container = this.template.querySelector('[data-id="map"]');
    const map = L.map(container, { scrollWheelZoom: false }).setView(this.position, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(this.position).addTo(map);
    const featureGroup = L.featureGroup([marker]).addTo(map);
    map.fitBounds(featureGroup.getBounds());
  }

  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      console.log(data);
      this.name = getFieldValue(data, RECORD_NAME_FIELD);
      this.address = getFieldValue(data, RECORD_ADDRESS_FIELD);
      console.log(this.address);
      const latitude = getFieldValue(data, RECORD_GEOLOCATION_LATITUDE_FIELD);
      const longitude = getFieldValue(data, RECORD_GEOLOCATION_LONGITUDE_FIELD);
      this.position = [latitude, longitude];
      console.log(this.position);
    }

  }

}
