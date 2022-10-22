const IMAGE_SIZE = 432;

const app = {
  data() {
    return {
      connected: false,
      position: [35.54236976, 139.64190659],
      imageURL: null,
      imageURL_base64: null
    }
  },
  methods: {
    handleCapture(e) {
      const f = e.target.files[0];
      const reader = new FileReader();
      console.log(e);
      reader.onload = () => {
        const imageURL = reader.result;
        resizeImage(imageURL, IMAGE_SIZE, resizedImageURL => {
          vm.imageURL = resizedImageURL;
          vm.imageURL_base64 = resizedImageURL.split(',')[1];
          console.log(resizedImageURL);
        });
      };
      reader.readAsDataURL(f);
    }
  }

}
const vm = Vue.createApp(app).mount('#app');

const conn = new jsforce.Connection({
  loginUrl: 'https://login.salesforce.com'
});

const handleLogin = () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  console.log(username + ':' + password);
  conn.login(username, password, (err, userInfo) => {
    if (err) { return console.error(err); }
    console.log('accessToken: ' + conn.accessToken);
    console.log('instanceUrl: ' + conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);

    vm.connected = true;

    getCurrentPosition();

    conn.query("SELECT Id, Name, Memo__c, Timestamp__c FROM Record__c LIMIT 100", (err, result) => {
      if (err) { return console.error(err); }
      console.log("The size of records : " + result.totalSize);
      console.log("The length of records : " + result.records.length);
      // console.log(result.records);
      vm.record__c = result.records;
      
      conn.query("SELECT Id, Name FROM Place__c LIMIT 100", (err, result) => {
        if (err) { return console.error(err); }
        console.log("The size of places : " + result.totalSize);
        console.log("The length of places : " + result.records.length);
        vm.place__c = result.records;
        
        findTasksNearby();

      });
    });
  });
}

const getCurrentPosition = () => {
  if(!("geolocation" in navigator)) {
    console.log('geolocation unavailable');
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude }  = position.coords;
      vm.position = [latitude, longitude];
      console.log(this.position);
    },
      err => {
        console.error(err);
      }
      ,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
  }
}

const resizeImage = (imageURL, targetWidth, callback) => {
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
