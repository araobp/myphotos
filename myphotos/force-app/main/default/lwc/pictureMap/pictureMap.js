import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';

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

  draw() {
    let container = this.template.querySelector('div');
    let position = [35.54236976, 139.64190659];
    let map = L.map(container, { scrollWheelZoom: false }).setView(position, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="<https://www.openstreetmap.org/copyright>">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker = L.marker(position).addTo(map);
    let featureGroup = L.featureGroup([marker]).addTo(map);
    map.fitBounds(featureGroup.getBounds());
  }
}
