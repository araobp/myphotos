import { LightningElement, api } from 'lwc';
import findTasksNearby from '@salesforce/apex/RecordObject.findTasksNearby';
import makeTasksCompleted from '@salesforce/apex/RecordObject.makeTasksCompleted';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskHere extends LightningElement {

  @api recordId

  showTasks = false;

  tasks;

  connectedCallback() {
    findTasksNearby({ recordId: this.recordId }).
      then(tasks => {
        this.tasks = tasks;
        console.log(tasks);
        if (this.tasks.length > 0) {
          this.showTasks = true;
        }
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
          findTasksNearby({ recordId: this.recordId }).
            then(tasks => {
              this.tasks = tasks;
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

  handleRefresh() {
    setTimeout(
      () => {
        window.location.reload();
        this.template.querySelector('[data-element="refresh"]').blur();
      },
      500);
  }
}