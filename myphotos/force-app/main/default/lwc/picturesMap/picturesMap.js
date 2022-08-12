import { LightningElement, api, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';
import selectRecordsByDistance from '@salesforce/apex/SelectRecords.selectRecordsByDistance';
import icons from '@salesforce/resourceUrl/icons'

import { publish, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';


const LOCALE = 'ja-JP';
const toLocalTime = (utcWithoutTZ) => {
    const date = new Date(utcWithoutTZ);
    return date.toLocaleString(LOCALE);
}

export default class PicturesMap extends LightningElement {
  @api height = 500;
  recordId = null;
  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  
  radius;
  show = false;
  map;
  centerIcon;
  centerMarker;
  featureGroup;
  markers = [];
  circle;

  @wire(MessageContext)
  messageContext;

  renderedCallback() {
    this.template.querySelector('[data-id="map"]').style.height = `${this.height}px`;

    if (this.show) {
      if (this.radius !== null) {
        this.template.querySelector('input[data-name="radius"]').value = this.radius;
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
      this.draw();
    });

    this.radius = localStorage.getItem("myphotos:radius") || 3.0;
  }

  draw() {
    const container = this.template.querySelector('[data-id="map"]');
    container.style.height = `${this.height}px`;
    this.map = L.map(container, { scrollWheelZoom: false }).setView(this.position, 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.centerMarker = L.marker(this.position, {icon: this.centerIcon}).addTo(this.map);

    this.map.on('click', this.onclick);
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
            .bindTooltip(record.Id, {opacity: 0})
            .bindPopup('<div>[' + record.Name +']</div><div>' + toLocalTime(record.Timestamp__c) + '</div><div>' + record.Memo__c +'</div>');
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
        this.centerMarker = L.marker(e.latlng, {icon: this.centerIcon}).addTo(this.map);
      });
  }

  showSettings() {
    this.show = !this.show;
  }

  onChange = () => {
    const text = this.template.querySelector('input[data-name="radius"]').value;
    this.radius = Number(text) || this.radius;
    localStorage.setItem("myphotos:radius", this.radius);
    this.show = false;
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
