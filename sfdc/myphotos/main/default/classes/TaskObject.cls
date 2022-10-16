public with sharing class TaskObject {
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
