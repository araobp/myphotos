public with sharing class UserData {

    @AuraEnabled
    public static void updateGeolocation(Id userId, Decimal latitude, Decimal longitude) {
        User user = [SELECT Geolocation__c FROM User WHERE Id = :userId];
        user.Geolocation__Latitude__s = latitude;
        user.Geolocation__Longitude__s = longitude;       
        update user;
    }
}