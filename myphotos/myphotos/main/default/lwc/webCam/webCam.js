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
      const imageURL = reader.result;
      console.log(imageURL);
      this.resizeImage(imageURL, 128, resizedImageURL => {
        console.log(resizedImageURL);
        this.imageURL = resizedImageURL;  
      });
    };
    reader.readAsDataURL(f);
  }

  dataURItoBlob = async dataURI => {
    return await fetch(dataURI).then(r => r.blob());
  }

  resizeImage = (imageURL, targetWidth, callback) => {
    const img = document.createElement('img');
    img.addEventListener('load', function() {
      const width = img.width;
      const height = img.height;
      console.log('width: ' + width + ', height: ' + height);

      const canvas = document.createElement('canvas');

      if (height > width) {
        canvas.width = targetWidth;
        canvas.height = height * targetWidth / width;  
      } else {
        canvas.height = targetWidth;
        canvas.width = width * targetWidth / height;  
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const resizedImageURL = canvas.toDataURL('image/jpeg');
      callback(resizedImageURL);
    });
    img.src = imageURL;
  }
}
