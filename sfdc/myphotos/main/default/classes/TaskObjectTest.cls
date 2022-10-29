@isTest
public with sharing class TaskObjectTest {

    static String PLACE_NAME = 'Apita Yokohama Tsunashima test place 345';

    @TestSetup
    static void makeData(){
        Place__c place = new Place__c();
        place.Name = PLACE_NAME;
        place.Address__c = '神奈川県横浜市港北区綱島東４丁目';
        place.Geolocation__Latitude__s = 35.54258299219887;
        place.Geolocation__Longitude__s = 139.64165440712304;
        insert place;

        place = [SELECT Id FROM Place__c where NAME = :PLACE_NAME LIMIT 1];
        Task task = new Task(Subject = 'Do it now!', WhatId = place.Id, Status='Not Started');
        insert task;
        task = new Task(Subject = 'Do it right!', WhatId = place.Id, Status='Not Started');
        insert task;
    }

    @isTest
    static void findTasksNearbyTest() {

        Place__c place = [SELECT Id FROM Place__c where NAME = :PLACE_NAME LIMIT 1];
        List<Task> tasks = TaskObject.findTasksNearby(place.Id);
        Integer count = 2;
        for (Task t: tasks) {
            if (t.Subject == 'Do it now!') {
                count--;
            } else if (t.Subject == 'Do it right!') {
                count--;
            }
        }
        System.assertEquals(0, count);
    }

    @isTest
    static void makeTasksCompleted(){
        Place__c place = [SELECT Id FROM Place__c where NAME = :PLACE_NAME LIMIT 1];
        List<Task> tasks = [SELECT Id FROM Task WHERE WhatId =: place.Id];
        List<Id> recordIds = new List<Id>();
        for (Task t: tasks) {
            recordIds.add(t.Id);
        }
        TaskObject.makeTasksCompleted(recordIds);
        tasks = [SELECT Id, Status FROM Task WHERE WhatId =: place.Id];
        Integer count = 2;
        for (Task t: tasks) {
            if (t.Status == 'Completed') {
                count--;
            }
        }
        System.assertEquals(0, count);
    }
}