import { LightningElement } from 'lwc';

export default class WebCam extends LightningElement {

  webcam = null;

  renderedCallback() {
    this.webcam = this.template.querySelector('video');

    const constraints = {
      audio: false,
      video: {
        width: 480, height: 640
      }
    };

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          this.webcam.srcObject = stream;
          this.webcam.play();
        })
        .catch(error => {
          console.log(error.name + ': ' + error.message);
        });
    }
  }
}
