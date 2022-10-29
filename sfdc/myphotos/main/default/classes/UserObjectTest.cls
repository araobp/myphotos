@isTest
public with sharing class UserObjectTest {

    @isTest
    static void updateGeolocationTest() {
        Id userId = UserInfo.getUserId();
        Decimal latitude = 35.54258299219887;
        Decimal longitude = 139.64165440712304;
        UserObject.updateGeolocation(userId, latitude, longitude);

        User user = [SELECT Id, Geolocation__Latitude__s, Geolocation__Longitude__s FROM User WHERE Id = :userId LIMIT 1];
        System.assertEquals(latitude, user.Geolocation__Latitude__s);
        System.assertEquals(longitude, user.Geolocation__Longitude__s);
    }
}
