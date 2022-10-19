import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';
import Id from '@salesforce/user/Id';

import updateGeolocation from '@salesforce/apex/UserData.updateGeolocation';
import { nominatimResultToAddress } from 'c/util';

export class GPS {

  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  address = '<unknown>';

  userId = Id;

  getGeoLocation = (callback) => {
    const id = navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.position = [parseFloat(latitude), parseFloat(longitude)];
      console.log(this.position);
      geolocationToAddress({ latitude: latitude, longitude: longitude })
        .then(jsonData => {
          this.address = nominatimResultToAddress(jsonData);
          console.log('Address: ' + this.address);
          console.log('UserId: ' + this.userId);
          updateGeolocation({ userId: this.userId, latitude: this.position[0], longitude: this.position[1] });
          callback(this.position, this.address);
        })
    },
      () => {
        console.log('Watching geolocation failed');
        callback(this.position, this.address);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    )
  }
}