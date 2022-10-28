global with sharing class PlaceObject {

    global static Decimal VICINITY_RADIUS = 0.1;  // 100m

    @AuraEnabled
    global static Boolean addPlace(Id recordId) {
        Boolean success = false;
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
                WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km')  < :VICINITY_RADIUS
            ];
            if (places.size() == 0) {
                Place__c place = new Place__c();
                place.Name = r.Name;
                place.Address__c = r.Address__c;
                place.Geolocation__Latitude__s = latitude;
                place.Geolocation__Longitude__s = longitude;
                insert place;

                r.Place__c = place.Id;
                update r;

                success = true;
                System.debug(place);
            } else {
                r.Place__c = places[0].Id;
                update r;
            }
            return success;
   
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    global static String findPlace(){
        String name = '';
        try {
            List<Place__c> place = [
                SELECT Name
                FROM Place__c
                WHERE Distance__c < :VICINITY_RADIUS
                LIMIT 1
            ];
            System.debug(place);
            if (place.size() != 0) {
                name = place[0].Name;
            }
            return name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}