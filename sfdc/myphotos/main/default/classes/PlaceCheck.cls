public with sharing class PlaceCheck {

    @AuraEnabled
    public static Boolean isAlreadyRegistered(Id recordId){
        try {
            Record__c r = [
                SELECT Name, Address__c, Geolocation__Latitude__s, Geolocation__Longitude__s, Place__c
                FROM Record__c
                WHERE Id = :recordId
                LIMIT 1
            ];
            
            Decimal latitude = r.Geolocation__Latitude__s;
            Decimal longitude = r.Geolocation__Longitude__s;

            List<Place__c> places = [
                SELECT Name, Address__c, Geolocation__Latitude__s, Geolocation__Longitude__s
                FROM Place__c
                WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km')  < :PlaceObject.VICINITY_RADIUS
            ];
            return (places.size() != 0);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}