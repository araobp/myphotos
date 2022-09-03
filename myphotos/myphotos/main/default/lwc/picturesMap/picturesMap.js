import { LightningElement, api, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';
import selectRecordsByDistance from '@salesforce/apex/SelectRecords.selectRecordsByDistance';
import icons from '@salesforce/resourceUrl/icons'

import { publish, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';
import Id from '@salesforce/user/Id';
import { GPS } from 'c/gps';

const LOCALE = 'ja-JP';
const toLocalTime = (utcWithoutTZ) => {
  const date = new Date(utcWithoutTZ);
  return date.toLocaleString(LOCALE);
}

export default class PicturesMap extends LightningElement {
  @api height = 500;
  userId = Id;
  recordId = null;
  position = [0, 0];

  radius;
  show = false;
  map;
  centerIcon;
  centerMarker = null;
  featureGroup;
  markers = [];
  circle;

  @wire(MessageContext)
  messageContext;

  watching = false;
  watchId = null;
  address = '<unknown>';

  autoupdate = false;

  gps;

  constructor() {
    super();
    this.gps = new GPS();
    this.position = this.gps.position;
    this.address = this.gps.address;
  }

  renderedCallback() {
    this.template.querySelector('[data-element="map"]').style.height = `${this.height}px`;

    if (this.show) {
      if (this.radius !== null) {
        this.template.querySelector('[data-element="radius"]').value = this.radius;
      }
    }
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, LEAFLET + '/leaflet.css'),
      loadScript(this, LEAFLET + '/leaflet.js'),
    ]).then(() => {
      this.centerIcon = L.icon({
        iconUrl: icons + '/center.png',
        iconSize: [24, 24]
      });

      this.radius = localStorage.getItem("myphotos:radius") || 3.0;

      console.log('userId: ' + this.userId);
      this.gps.startWatchingLocation(false, (position, address) => {
        this.position = position;
        this.address = address;
        this.draw();
      });
    });
  }

  draw() {
    if (this.map == null) {
      const container = this.template.querySelector('[data-element="map"]');
      container.style.height = `${this.height}px`;
      this.map = L.map(container, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.map.on('click', this.onclick);
    }

    this.map.setView(this.position, 15);

    if (this.centerMarker != null) {
      this.map.removeLayer(this.centerMarker);
    }
    this.centerMarker = L.marker(this.position, { icon: this.centerIcon }).addTo(this.map);
  }

  onclick = (e) => {
    selectRecordsByDistance({ latitude: e.latlng.lat, longitude: e.latlng.lng, radius: this.radius })
      .then(records => {

        // Clear all existing markers
        this.markers.forEach(marker => {
          this.map.removeLayer(marker);
        });
        this.markers.length = 0;
        if (this.circle != null) {
          this.map.removeLayer(this.circle);
        }
        if (this.centerMarker != null) {
          this.map.removeLayer(this.centerMarker);
        }

        records.forEach(record => {
          //console.log(record);
          const marker = L.marker([record.Geolocation__Latitude__s, record.Geolocation__Longitude__s])
            .addTo(this.map)
            .on('click', this.onClick)
            .bindTooltip(record.Id, { opacity: 0 })
            .bindPopup('<div>[' + record.Name + ']</div><div>' + toLocalTime(record.Timestamp__c) + '</div><div>' + record.Memo__c + '</div>');
          this.markers.push(marker);
        });
        this.featureGroup = L.featureGroup(this.markers).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds());
        this.circle = L.circle(e.latlng, {
          radius: this.radius * 1000,  // in meters
          color: '#FF8888',
          fillColor: '#FFFFFF',
          fillOpacity: 0
        }).addTo(this.map);
        this.centerMarker = L.marker(e.latlng, { icon: this.centerIcon }).addTo(this.map);
      });
  }

  showSettings() {
    this.show = !this.show;
  }

  handleRadiusChange = () => {
    const input = this.template.querySelector('[data-element="radius"]');
    const text = input.value;
    this.radius = Number(text) || this.radius;
    localStorage.setItem("myphotos:radius", this.radius);
    input.blur();
  }

  onClick = (e) => {
    const popup = e.target.getTooltip();
    const recordId = popup.getContent();
    const message = {
      recordId: recordId
    };
    publish(this.messageContext, RECORD_ID_UPDATE_MESSAGE, message);
  }

}