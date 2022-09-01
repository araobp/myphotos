public with sharing class RecordObject {
    
    @AuraEnabled(cacheable=false)
    public static Id createRecord(String name, String memo, String address, String timestampGmt, String uuid, Decimal latitude, Decimal longitude, String base64, String base64_small) {
  		Record__c r = new Record__c();
        r.Name = name;
        r.Memo__c = memo;
        r.Address__c = address;
        r.Timestamp__c = Datetime.valueOfGmt(timestampGmt);
        r.uuid__c = uuid;
        r.Geolocation__Latitude__s = latitude;
        r.Geolocation__Longitude__s = longitude;
        insert r;

        FileUploader.uploadFile(base64, uuid + '.jpeg', r.Id);
        FileUploader.uploadFile(base64_small, uuid + '_small.jpeg', r.Id);

        return r.Id;
    }
}