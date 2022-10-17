const app = new Vue({
  el: '#app',
  data: {
    connected: false,
    record__c: null,
    place__c: null,
    task: null,
    position: [35.54236976, 139.64190659]
  },
  mounted: () => {
  }
});

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

    app.connected = true;

    getCurrentPosition();

    conn.query("SELECT Id, Name, Memo__c, Timestamp__c FROM Record__c LIMIT 100", (err, result) => {
      if (err) { return console.error(err); }
      console.log("The size of records : " + result.totalSize);
      console.log("The length of records : " + result.records.length);
      // console.log(result.records);
      app.record__c = result.records;
      
      conn.query("SELECT Id, Name FROM Place__c LIMIT 100", (err, result) => {
        if (err) { return console.error(err); }
        console.log("The size of places : " + result.totalSize);
        console.log("The length of places : " + result.records.length);
        app.place__c = result.records;
        
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
      app.position = [latitude, longitude];
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

const findTasksNearby = () => {
  const recordId = app.place__c[0].Id;
  conn.apex.get(`/task/${recordId}`, null, function (err, res) {
    if (err) { return console.error(err); }
    console.log(res);
    app.task = res;
  });
}
