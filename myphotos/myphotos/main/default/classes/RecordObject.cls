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

    static Decimal VICINITY_RADIUS = 0.1;  // 100m

    @AuraEnabled
    public static Boolean addPlace(String name, String address, Decimal latitude, Decimal longitude){
        Boolean success = false;
        try {
            List<Place__c> places = [SELECT Name, Address__c, Geolocation__Latitude__s, Geolocation__Longitude__s
            FROM Place__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :VICINITY_RADIUS];
            if (places.size() == 0) {
                Place__c place = new Place__c();
                place.Name = name;
                place.Address__c = address;
                place.Geolocation__Latitude__s = latitude;
                place.Geolocation__Longitude__s = longitude;
                insert place;
                success = true;

                System.debug(place);
            }
            return success;
   
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string findPlace(Decimal latitude, Decimal longitude){
        String name = '';
        try {
            Place__c place = [SELECT Name
            FROM Place__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :VICINITY_RADIUS
            LIMIT 1];
            System.debug(place);
            if (place != null) {
                name = place.Name;
            }
            return name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}