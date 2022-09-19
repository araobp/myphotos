import jsforce from 'jsforce';

const conn = new jsforce.Connection();

const username = process.env.DEV_EDITION_USERNAME;
const password = process.env.DEV_EDITION_PASSWORD;
const securityToken = process.env.DEV_EDITION_SECURITY_TOKEN;

conn.login(username, password + securityToken, (err, res) => {
  if (err) { return console.error(err); }
  conn.query('SELECT Id, Name, uuid__c, Valid__c, Timestamp__c, Address__c, Geolocation__c, Memo__c, RecordTypeId FROM Record__c', (err, res) => {
    if (err) { return console.error(err); }
    console.log(res);
  });
});
