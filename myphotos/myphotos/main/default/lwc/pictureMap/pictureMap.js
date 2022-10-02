import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import RECORD_ID_FIELD from "@salesforce/schema/Record__c.Id";
import RECORD_NAME_FIELD from '@salesforce/schema/Record__c.Name';
import RECORD_ADDRESS_FIELD from '@salesforce/schema/Record__c.Address__c';
import PLACE_ID_FIELD from "@salesforce/schema/Place__c.Id";
import PLACE_NAME_FIELD from '@salesforce/schema/Place__c.Name';
import PLACE_ADDRESS_FIELD from '@salesforce/schema/Place__c.Address__c';

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';

import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';
import { nominatimResultToAddress } from 'c/util';

import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';

const RECORD_GEOLOCATION_LATITUDE_FIELD = 'Record__c.Geolocation__Latitude__s';
const RECORD_GEOLOCATION_LONGITUDE_FIELD = 'Record__c.Geolocation__Longitude__s';
const PLACE_GEOLOCATION_LATITUDE_FIELD = 'Place__c.Geolocation__Latitude__s';
const PLACE_GEOLOCATION_LONGITUDE_FIELD = 'Place__c.Geolocation__Longitude__s';

export default class PictureMap extends LightningElement {
  @api targetObject;
  @api recordId;
  @api height = 400;
  alreadyWired = false;
  name = null;

  // Default: Apita Yokohama Tsunashima
  latitude = 35.54236976;
  longitude = 139.64190659;
  clicked = false;
  latitudeClicked = 35.54236976;
  longitudeClicked = 139.64190659;

  address = "<Unknown>";
  addressClicked = "<Unknown>";

  subscription = null;

  @wire(MessageContext)
  messageContext;

  renderedCallback() {
    this.template.querySelector('[data-id="map"]').style.height = `${this.height}px`;
  }

  connectedCallback() {
    console.log("connectedCallback firing");
    if (this.targetObject === 'Record__c') {
      this.ID_FIELD = RECORD_ID_FIELD;
      this.NAME_FIELD = RECORD_NAME_FIELD;
      this.ADDRESS_FIELD = RECORD_ADDRESS_FIELD;
      this.GEOLOCATION_LATITUDE_FIELD = RECORD_GEOLOCATION_LATITUDE_FIELD;
      this.GEOLOCATION_LONGITUDE_FIELD = RECORD_GEOLOCATION_LONGITUDE_FIELD;
    } else if (this.targetObject === 'Place__c') {
      this.ID_FIELD = PLACE_ID_FIELD;
      this.NAME_FIELD = PLACE_NAME_FIELD;
      this.ADDRESS_FIELD = PLACE_ADDRESS_FIELD;
      this.GEOLOCATION_LATITUDE_FIELD = PLACE_GEOLOCATION_LATITUDE_FIELD;
      this.GEOLOCATION_LONGITUDE_FIELD = PLACE_GEOLOCATION_LONGITUDE_FIELD;
    }
    this.fields = [
      this.NAME_FIELD,
      this.ADDRESS_FIELD,
      this.GEOLOCATION_LATITUDE_FIELD,
      this.GEOLOCATION_LONGITUDE_FIELD
    ];
    console.log(this.fields);

    this.subscription = subscribe(
      this.messageContext,
      RECORD_ID_UPDATE_MESSAGE,
      (message) => {
        console.log(message);
        this.recordId = message.recordId;
      }
    );

    Promise.all([
      loadStyle(this, LEAFLET + '/leaflet.css'),
      loadScript(this, LEAFLET + '/leaflet.js'),
    ]).then(() => {
      this.draw();
    });
  }

  disconnectedCallback() {
    if (this.subscription != null) {
      unsubscribe(this.subscription);
      this.subscription = null;
    }
  }

  draw() {
    setTimeout(() => {
      if (this.alreadyWired) {
        const container = this.template.querySelector('[data-id="map"]');
        container.style.height = `${this.height}px`;
        const position = [this.latitude, this.longitude];
        const map = L.map(container, { scrollWheelZoom: false }).setView(position, 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
        }).addTo(map);

        const marker = L.marker(position).addTo(map);
        //const featureGroup = L.featureGroup([marker]).addTo(map);
        //map.fitBounds(featureGroup.getBounds());

        map.on('click', this.onclick);
      } else {
        this.draw();
      }
    }, 500);
  }

  @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
  loadRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.name = getFieldValue(data, this.NAME_FIELD);
      this.address = getFieldValue(data, this.ADDRESS_FIELD);
      this.latitude = getFieldValue(data, this.GEOLOCATION_LATITUDE_FIELD);
      this.longitude = getFieldValue(data, this.GEOLOCATION_LONGITUDE_FIELD);
      console.log(data);
      this.alreadyWired = true;
    }
  }

  onclick = (e) => {
    this.latitudeClicked = e.latlng.lat.toFixed(8);
    this.longitudeClicked = e.latlng.wrap().lng.toFixed(8);
    this.clicked = true;
    geolocationToAddress({ latitude: this.latitudeClicked, longitude: this.longitudeClicked })
      .then(jsonData => {
        this.addressClicked = nominatimResultToAddress(jsonData)
      });
  }

  handleGeolocationUpdate = () => {
    const fields = {};

    fields[this.ID_FIELD.fieldApiName] = this.recordId;
    fields[this.ADDRESS_FIELD.fieldApiName] = this.addressClicked;
    fields.Geolocation__Latitude__s = this.latitudeClicked;
    fields.Geolocation__Longitude__s = this.longitudeClicked;

    const recordInput = {
      fields: fields
    };

    updateRecord(recordInput)
      .then(record => {
        console.log(record);
        this.template.querySelector('[data-name="update"]').blur();
      });
  }
}