public with sharing class MakeAllValid {
    public static void MakeAllValid() {
        List<Record__c> records = [SELECT Id, Valid__c FROM Record__c];
        for (Record__c r : records) {
            r.Valid__c = true;
        }
        update records;
    }
}