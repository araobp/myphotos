public with sharing class UserObject {

    @AuraEnabled
    public static void updateGeolocation(Id userId, Decimal latitude, Decimal longitude) {
        User user = [SELECT Geolocation__c FROM User WHERE Id = :userId];
        user.Geolocation__Latitude__s = latitude;
        user.Geolocation__Longitude__s = longitude;       
        update user;
    }

    @AuraEnabled
    public static void setGeolocationToDefault(){
        Decimal latitude = 35.54258299219887;
        Decimal longitude = 139.64165440712304;
    
        try {
            Id userId = UserInfo.getUserId();
            updateGeolocation(userId, latitude, longitude);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}