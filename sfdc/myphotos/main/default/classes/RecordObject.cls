@RestResource(urlMapping='/record/*')
global with sharing class RecordObject {
    
    global class RecordParams {
        global String name;
        global String memo;
        global String address;
        global String timestampGmt;
        global String uuid;
        global Decimal latitude;
        global Decimal longitude;
        global String base64;
    }

    @HttpPost
    global static Id postOperation(RecordParams p) {
        return createRecord(
            p.name,
            p.memo,
            p.address,
            p.timestampGmt,
            p.uuid,
            p.latitude,
            p.longitude,
            p.base64);
    }

    @AuraEnabled(cacheable=false)
    global static Id createRecord(String name, String memo, String address, String timestampGmt, String uuid, Decimal latitude, Decimal longitude, String base64) {
        try {
            Record__c r = new Record__c();
            r.Name = name;
            r.Memo__c = memo;
            r.Address__c = address;
            r.Timestamp__c = Datetime.valueOfGmt(timestampGmt);
            r.uuid__c = uuid;
            r.Geolocation__Latitude__s = latitude;
            r.Geolocation__Longitude__s = longitude;
            insert r;

            String contentVersionId = FileUploader.uploadFile(base64, uuid + '.jpeg', r.Id);
            r.ImageURL__c = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
            update r;

            return r.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @HttpDelete
    global static Boolean deleteOperation() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        Id recordId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        return deleteRecord(recordId);
    }

    @AuraEnabled
    global static Boolean deleteRecord(Id recordId){
        try {
            Boolean success = FileUploader.deleteFile(recordId);
            if (success) {
                List<Record__c> r = [SELECT Id FROM Record__c WHERE Id = :recordId LIMIT 1];
                if (r.size() >= 1) {
                    delete r;
                } else {
                    success = false;
                }
            }
            return success;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @HttpGet
    global static List<Record__c> getOperation() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String[] position = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1).split(',');
        Decimal latitude = decimal.valueOf(position[0]);
        Decimal longitude = decimal.valueOf(position[1]);
        Decimal radius = decimal.valueOf(position[2]);
        return selectRecordsByDistance(latitude, longitude, radius);
    }

    @AuraEnabled(cacheable=true)
    global static List<Record__c> selectRecordsByDistance(Decimal latitude, Decimal longitude, Decimal radius) {
        return [
            SELECT Id, uuid__c, Name, Memo__c, Timestamp__c, Geolocation__Latitude__s, Geolocation__Longitude__s, Image__c, ImageURL__c
            FROM Record__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :radius
            LIMIT 100
        ];
    }
}