import { LightningElement, wire } from 'lwc';
import { GPS } from 'c/gps';
import findTasksNearby from '@salesforce/apex/RecordObject.findTasksNearby';
import makeTasksCompleted from '@salesforce/apex/RecordObject.makeTasksCompleted';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_ID_UPDATE_MESSAGE from '@salesforce/messageChannel/RecordId__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskHere extends LightningElement {

  positioning = true;
  showTasks = false;

  place = "<Unknown>"
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
          console.log({ recordId: this.place.Id });
          publish(this.messageContext, RECORD_ID_UPDATE_MESSAGE, { recordId: this.place.Id });
          if (this.tasks.length > 0) {
            this.showTasks = true;
          }
        });
    });
  }

  handleMakeComplete() {
    const inputs = this.template.querySelectorAll('lightning-input');
    const recordIds = [];
    inputs.forEach(input => {
      if (input.checked) {
        const recordId = input.getAttribute('data-id');
        recordIds.push(recordId);
      }
    });
    console.log(recordIds);
    if (recordIds.length > 0) {
      makeTasksCompleted({ recordIds })
        .then(() => {
          findTasksNearby().
            then(nearby => {
              console.log(nearby);
              this.place = nearby.place;
              this.tasks = nearby.tasks;
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Success',
                  message: 'Task completed',
                  variant: 'success'
                })
              );
            });
        });
    }
    this.template.querySelector('[data-element="makeComplete"]').blur();
  }
}