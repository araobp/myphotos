import { LightningElement, api } from 'lwc';

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';

import selectRecordsByDistance from '@salesforce/apex/SelectRecords.selectRecordsByDistance';

const RADIUS = 3.0;

export default class PicturesMap extends LightningElement {
  @api height = 600;
  name = null;
  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  address = "<Unknown>";

  renderedCallback() {
    this.template.querySelector('[data-id="map"]').style.height = `${this.height}px`;
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, LEAFLET + '/leaflet.css'),
      loadScript(this, LEAFLET + '/leaflet.js'),
    ]).then(() => {
      this.draw();
    });
  }

  map;

  draw() {
    const container = this.template.querySelector('[data-id="map"]');
    container.style.height = `${this.height}px`;
    this.map = L.map(container, { scrollWheelZoom: false }).setView(this.position, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', this.onclick);

    //const marker = L.marker(this.position).addTo(map);
    //const featureGroup = L.featureGroup([marker]).addTo(map);
    //map.fitBounds(featureGroup.getBounds());

  }

  featureGroup;
  markers = [];

  onclick = (e) => {
    selectRecordsByDistance({ latitude: e.latlng.lat, longitude: e.latlng.lng, radius: RADIUS })
      .then(records => {
        this.markers.forEach( marker => {
          this.map.removeLayer(marker);
        });
        this.markers.length = 0;
        records.forEach(record => {
          console.log(record);
          const marker = L.marker([record.Geolocation__Latitude__s, record.Geolocation__Longitude__s]).addTo(this.map);
          this.markers.push(marker);
        });
        this.featureGroup = L.featureGroup(this.markers).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds()); 
      });
  }

}
