import { LightningElement, wire } from 'lwc';
import { GPS } from 'c/gps';
import findTasksNearby from '@salesforce/apex/RecordObject.findTasksNearby';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';

export default class TaskHere extends LightningElement {

  positioning = true;

  place;
  tasks;
  
  gps;

  @wire(MessageContext)
  messageContext;

  constructor() {
    super();
    this.gps = new GPS();
  }

  connectedCallback() {
    this.gps.getGeoLocation(() => {  // Just for updating my current location
      this.positioning = false;
      findTasksNearby().
      then(nearby => {
        console.log(nearby);
        this.place = nearby.place;
        this.tasks = nearby.tasks;
        console.log({recordId: this.place.Id});
        publish(this.messageContext, RECORD_ID_UPDATE_MESSAGE, { recordId: this.place.Id });
      });
    });
  }
}