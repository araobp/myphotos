import { LightningElement } from 'lwc';

export default class WebCam extends LightningElement {

  webcam = null;

  renderedCallback() {
    this.webcam = this.template.querySelector('[data-element="webcam"]');
    const constraints = {
      audio: false,
      video: {
        width: 600, height: 800
      }
    };

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          this.webcam.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }
}
