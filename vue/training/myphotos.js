const app = new Vue({
  el: '#app',
  data: {
    connected: false,
    record__c: null,
    position: [35.54236976, 139.64190659]
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
    
    conn.query("SELECT Id, Name, Memo__c, Timestamp__c FROM Record__c LIMIT 100", (err, result) => {
      if (err) { return console.error(err); }
      console.log("total : " + result.totalSize);
      console.log("fetched : " + result.records.length);
      // console.log(result.records);
      app.record__c = result.records;
    });

    app.connected = true;
  });

  if (navigator.geolocation) {

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
  
    const success = position => {
      app.position = position.coords;
    }
  
    const error = err => {
      console.error(err);
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
  }  
}
