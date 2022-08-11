public with sharing class SelectRecords {

    @AuraEnabled(cacheable=true)
    public static List<Record__c> selectRecordsByDistance(Decimal latitude, Decimal longitude, Decimal radius) {
        return [
            SELECT Id, uuid__c, Name, Memo__c, Timestamp__c, Geolocation__Latitude__s, Geolocation__Longitude__s
            FROM Record__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :radius
        ];
    }
}
