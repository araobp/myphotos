import { LightningElement } from 'lwc';

export default class PhotoViewer extends LightningElement {
    uuid = null;
    onUuidChanged(event) {
      this.uuid = event.target.value;
    }
}