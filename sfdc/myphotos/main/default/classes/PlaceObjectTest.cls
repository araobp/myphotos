@isTest
public with sharing class PlaceObjectTest {

    static String PLACE_NAME = 'Apita Yokohama Tsunashima test place 345';
    
    @TestSetup
    static void makeData(){
        Record__c record = new Record__c(
            Name = PLACE_NAME,
            Memo__c = 'Remote working now',
            Geolocation__Latitude__s = 35.54258299219887,
            Geolocation__Longitude__s = 139.64165440712304
        );
        insert record;
    }

    @isTest
    static void addPlaceTest() {
        Record__c record = [SELECT Id FROM Record__c WHERE Name = :PLACE_NAME];
        Boolean success = PlaceObject.addPlace(record.Id);
        System.assertEquals(true, success);

        record = [SELECT Id FROM Record__c WHERE Name = :PLACE_NAME];
        success = PlaceObject.addPlace(record.Id);
        System.assertEquals(false, success);
    }

    @isTest
    static void findPlaceTest() {

        Id userId = UserInfo.getUserId();
        Decimal latitude = 35.54258299;
        Decimal longitude = 139.64165449;
        UserObject.updateGeolocation(userId, latitude, longitude);

        Record__c record = [SELECT Id FROM Record__c WHERE Name = :PLACE_NAME];
        Boolean success = PlaceObject.addPlace(record.Id);

        String placeName = PlaceObject.findPlace();
        System.assertEquals(PLACE_NAME, placeName);
    }

}