import geolocationToAddress from '@salesforce/apex/NominatimCallout.geolocationToAddress';

export class GPS {

  position = [35.54236976, 139.64190659];  // Default: Apita Yokohama Tsunashima
  watching = false;
  address = '<unknown>';
  watchId = null;

  startWatchingLocation = callback => {
    console.log('TEST');
    if ('geolocation' in navigator && this.watchId == null) {
      console.log('TEST2');
      const id = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        this.position = [latitude, longitude];
        console.log(this.position);
        this.watching = true;
        geolocationToAddress({ latitude: latitude, longitude: longitude })
          .then(jsonData => {
            this.address = JSON.parse(jsonData).display_name.replace(/ /g, '').split(',').reverse().slice(2).join(' ');
            console.log('Address: ' + this.address);
            callback(this.position, this.address);
          })
      },
        () => { console.log('Watching geolocation failed') },
        {
          enableHighAccuracy: true
        }
      );
      this.watchId = id;
    } else {
      callback(false);
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