@isTest
public with sharing class PlaceCheckTest {

    @isTest
    static void isAlreadyRegisteredTest() {
        Place__c place = new Place__c(
            Name='Apita Yokohama Tsunashima test place 123',
            Geolocation__Latitude__s=35.54258299,
            Geolocation__Longitude__s=139.64165449
        );
        insert place;

        Record__c record = new Record__c(
            Name='Apita Yokohama Tsunashima test place 345',
            Memo__c='Remote working now',
            Geolocation__Latitude__s=35.54258299219887,
            Geolocation__Longitude__s=139.64165440712304
        );
        insert record;

        record = [SELECT Id FROM Record__c WHERE Name = 'Apita Yokohama Tsunashima test place 345'];
        
        Boolean isAlreadyRegistered = PlaceCheck.isAlreadyRegistered(record.Id);
        System.assertEquals(true, isAlreadyRegistered);        
    }
}