public with sharing class RecordObject {
    
    @AuraEnabled(cacheable=false)
    public static Id createRecord(String name, String memo, String address, String timestampGmt, String uuid, Decimal latitude, Decimal longitude, String base64) {
        try {
            Record__c r = new Record__c();
            r.Name = name;
            r.Memo__c = memo;
            r.Address__c = address;
            r.Timestamp__c = Datetime.valueOfGmt(timestampGmt);
            r.uuid__c = uuid;
            r.Geolocation__Latitude__s = latitude;
            r.Geolocation__Longitude__s = longitude;
            insert r;

            String contentVersionId = FileUploader.uploadFile(base64, uuid + '.jpeg', r.Id);
            r.ImageURL__c = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
            update r;

            return r.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Record__c> selectRecordsByDistance(Decimal latitude, Decimal longitude, Decimal radius) {
        return [
            SELECT Id, uuid__c, Name, Memo__c, Timestamp__c, Geolocation__Latitude__s, Geolocation__Longitude__s, Image__c, ImageURL__c
            FROM Record__c
            WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km') < :radius
            LIMIT 100
        ];
    }

    static Decimal VICINITY_RADIUS = 0.1;  // 100m

    @AuraEnabled
    public static Boolean addPlace(Id recordId) {
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
                WHERE DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'km')  < :VICINITY_RADIUS
            ];
            return (places.size() != 0);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string findPlace(){
        String name = '';
        try {
            Place__c place = [SELECT Name
            FROM Place__c
            WHERE Distance__c < :VICINITY_RADIUS
            LIMIT 1];
            System.debug(place);
            if (place != null) {
                name = place.Name;
            }
            return name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Task> findTasksNearby(Id recordId) {
        try {
            Place__c place = [
                SELECT Id, Name
                FROM Place__c
                WHERE Id = :recordId
                LIMIT 1
            ];
            return [
                    SELECT Id, Subject, Description
                    FROM Task
                    WHERE WhatId = :place.Id AND Status != 'Completed'
                ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void makeTasksCompleted(List<Id> recordIds) {
        try {
            List<Task> tasks = new List<Task>();
            for (Id recordId : recordIds) {
                Task task = [SELECT Id, Status FROM Task WHERE Id = :recordId];
                if (task != null) {
                    task.Status = 'Completed';
                    tasks.add(task);
                }
            }
            if (tasks.size() > 0) {
                update tasks;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}