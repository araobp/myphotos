public with sharing class RecordObject {
    
    @AuraEnabled(cacheable=false)
    public static Id createRecord(String name, String memo, String address, String timestampGmt, String uuid, Decimal latitude, Decimal longitude, String base64) {
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

    @AuraEnabled
    public static Boolean deleteRecord(Id recordId){
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

    @AuraEnabled(cacheable=true)
    public static List<Record__c> selectRecordsByDistance(Decimal latitude, Decimal longitude, Decimal radius) {
        return [
            SELECT Id, uuid__c, Name, Memo__c, Timestamp__c, Geolocation__Latitude__s, Geolocation__Longitude__s, Image__c, ImageURL__c
            FROM Record__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :radius
            LIMIT 100
        ];
    }
}