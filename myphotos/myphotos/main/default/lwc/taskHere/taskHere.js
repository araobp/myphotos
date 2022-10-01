import { LightningElement } from 'lwc';
import { GPS } from 'c/gps';

export default class TaskHere extends LightningElement {

  positioning;

  recordIds;
  
  gps;
  position;
  address;
  datetime;

  constructor() {
    super();
    this.gps = new GPS();
    this.position = this.gps.position;
    this.address = this.gps.address;
    this.datetime = this.datetimeGmt();
  }

  connectedCallback() {
    this.gps.getGeoLocation((position, address) => {
      this.positioning = false;
      this.position = position;
      this.address = address;
    });
  }


}