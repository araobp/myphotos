@RestResource(urlMapping='/user/*')
global with sharing class UserObject {

    global class UserParams {
        global Id userId;
        global Decimal latitude;
        global Decimal longitude;
    }

    @HttpPatch
    global static void patchOperation(UserParams u) {
        updateGeolocation(u.userId, u.latitude, u.longitude);
    }

    @AuraEnabled
    global static void updateGeolocation(Id userId, Decimal latitude, Decimal longitude) {
        User user = [SELECT Geolocation__c FROM User WHERE Id = :userId];
        user.Geolocation__Latitude__s = latitude;
        user.Geolocation__Longitude__s = longitude;       
        update user;
    }
}