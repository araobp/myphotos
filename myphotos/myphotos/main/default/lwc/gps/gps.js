import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';
import Id from '@salesforce/user/Id';

import updateGeolocation from '@salesforce/apex/UserData.updateGeolocation';

export class GPS {

  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  address = '<unknown>';
  watchId = null;

  userId = Id;

  startWatchingLocation = (continuousMode, callback) => {
    if ('geolocation' in navigator && this.watchId == null) {
      const id = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        this.position = [latitude, longitude];
        console.log(this.position);
        geolocationToAddress({ latitude: latitude, longitude: longitude })
          .then(jsonData => {
            this.address = JSON.parse(jsonData).display_name.replace(/ /g, '').split(',').reverse().slice(2).join(' ');
            console.log('Address: ' + this.address);
            console.log('UserId: ' + this.userId);
            updateGeolocation({userId: this.userId, latitude: this.position[0], longitude: this.position[1]});
            callback(this.position, this.address);
            if (!continuousMode) this.stopWatchingLocation();
          })
      },
        () => { console.log('Watching geolocation failed') },
        {
          enableHighAccuracy: true
        }
      );
      this.watchId = id;
    } else {
      callback([0,0], 'GPS error...');
    }
  };

  stopWatchingLocation = () => {
    if (this.watchId != null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  };

}