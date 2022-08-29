import { LightningElement } from 'lwc';

export default class WebCam extends LightningElement {

  webcam = null;
  imageURL = null;

  /*
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
  }*/

  handleCapture = e => {
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = _ => {
        this.imageURL = reader.result;
    };
    reader.readAsDataURL(f);
  }
}
