import { LightningElement, api, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LEAFLET from '@salesforce/resourceUrl/leaflet';

const NAME_FIELD = 'Record__c.Name';
const LOCATION_LATITUDE_FIELD = 'Record__c.Geolocation__Latitude__s';
const LOCATION_LONGITUDE_FIELD = 'Record__c.Geolocation__Longitude__s';
const recordFields = [
  NAME_FIELD,
  LOCATION_LATITUDE_FIELD,
  LOCATION_LONGITUDE_FIELD
];

export default class PictureMap extends LightningElement {
  @api recordId;
  @api height = 400;

  renderedCallback() {
    this.template.querySelector('div').style.height = `${this.height}px`;
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, LEAFLET + '/leaflet.css'),
      loadScript(this, LEAFLET + '/leaflet.js'),
    ]).then(() => {
      this.draw();
    });
  }

  position = [35.54236976, 139.64190659];

  draw() {
    const container = this.template.querySelector('div');
    const map = L.map(container, { scrollWheelZoom: false }).setView(this.position, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker = L.marker(this.position).addTo(map);
    let featureGroup = L.featureGroup([marker]).addTo(map);
    map.fitBounds(featureGroup.getBounds());
  }

  name;
  mapMarkers = [];
  @wire(getRecord, { recordId: '$recordId', fields: recordFields })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, NAME_FIELD);
      const latitude = getFieldValue(data, LOCATION_LATITUDE_FIELD);
      const longitude = getFieldValue(data, LOCATION_LONGITUDE_FIELD);
      this.position = [latitude, longitude];
    }

  }

}
