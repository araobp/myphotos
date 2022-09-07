public with sharing class SelectRecords {

    public class RecordAndThumbnail {
        @AuraEnabled public Record__c record;
        @AuraEnabled public String url;
    }

    @AuraEnabled(cacheable=true)
    public static List<RecordAndThumbnail> selectRecordsByDistance(Decimal latitude, Decimal longitude, Decimal radius) {
        List<Record__c> records = [
            SELECT Id, uuid__c, Name, Memo__c, Timestamp__c, Geolocation__Latitude__s, Geolocation__Longitude__s
            FROM Record__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :radius
            LIMIT 100
        ];

        List<RecordAndThumbnail> rts = new List<RecordAndThumbnail>();
        
        for (Record__c r : records) {
            ImageURL.URL url = ImageURL.getImageURL(r.Id, true);
            RecordAndThumbnail rt = new RecordAndThumbnail();
            rt.record = r;
            rt.url = url.url;
            rts.add(rt);
        }
        
        return rts;
    }
}