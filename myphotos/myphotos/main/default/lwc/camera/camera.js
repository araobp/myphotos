import { LightningElement } from 'lwc';
import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';
import { GPS } from 'c/gps';

export default class camera extends LightningElement {

  webcam = null;
  imageURL = null;
  position = [0, 0];
  address = '';

  constructor() {
    super();
    this.gps = new GPS();
    this.position = this.gps.position;
    this.address = this.gps.address;
  }

  connectedCallback() {
    this.gps.startWatchingLocation((position, address) => {
      this.position = position;
      this.address = address;
    });
  }

  disconnectedCallback() {
    this.gps.stopWatchingLocation();
  }

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
    img.addEventListener('load', function () {
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

  startWatchingLocation = () => {
    if ('geolocation' in navigator && this.watchId == null) {
      const id = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        this.position = [latitude, longitude];
        console.log(this.position);
        this.watching = true;
        geolocationToAddress({ latitude: latitude, longitude: longitude })
          .then(jsonData => {
            this.address = JSON.parse(jsonData).display_name.replace(/ /g, '').split(',').reverse().slice(2).join(' ');
            console.log('Address: ' + this.address);
          });
        this.draw();
      },
        () => { console.log('Watching geolocation failed') },
        {
          enableHighAccuracy: true
        }
      );
      this.watchId = id;
    }
  };

  stopWatchingLocation = () => {
    if (this.watchId != null) {
      this.watchId && navigator.geolocation.clearWatch(this.watchId);
      this.watching = false;
      this.watchId = null;
    }
  };

}
