import { LightningElement, api, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';
import selectRecordsByDistance from '@salesforce/apex/RecordObject.selectRecordsByDistance';
import icons from '@salesforce/resourceUrl/icons'

import { publish, MessageContext } from 'lightning/messageService';
import IMAGE_URL_UPDATE_MESSAGE from '@salesforce/messageChannel/ImageURL__c';
import Id from '@salesforce/user/Id';
import { GPS } from 'c/gps';
import updateGeolocation from '@salesforce/apex/UserObject.updateGeolocation';
import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';

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
  positioning = true;

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

      this.radius = localStorage.getItem("myphotos:radius") || 2.0;  // 2.0km default

      this.gps.getGeoLocation((position, address) => {
        this.positioning = false;
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
    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;

    geolocationToAddress({ latitude: latitude, longitude: longitude })
      .then(jsonData => {
        this.address = JSON.parse(jsonData).display_name.replace(/ /g, '').split(',').reverse().slice(2).join(' ');
        console.log('Address: ' + this.address);
        console.log('UserId: ' + this.userId);
        updateGeolocation({ userId: this.userId, latitude: latitude, longitude: longitude });
      })

    selectRecordsByDistance({ latitude: latitude, longitude: longitude, radius: this.radius })
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

        records.forEach(r => {
          //console.log(record);
          const marker = L.marker([r.Geolocation__Latitude__s, r.Geolocation__Longitude__s])
            .addTo(this.map)
            .on('click', this.onMarkerClick)
            .bindTooltip(r.Name + ',' + r.ImageURL__c, { opacity: 0 })
            .bindPopup(
              '<div>[' + r.Name + ']</div><div>' +
              toLocalTime(r.Timestamp__c) + '</div><div>' +
              r.Memo__c + '</div>' +
              r.Image__c
            );
          console.log(r.Image__c);
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

  onMarkerClick = (e) => {
    const popup = e.target.getTooltip();
    const content = popup.getContent().split(',');
    publish(this.messageContext, IMAGE_URL_UPDATE_MESSAGE, { name: content[0], imageURL: content[1] });
  }

  handleRefresh = () => window.location.reload();

}