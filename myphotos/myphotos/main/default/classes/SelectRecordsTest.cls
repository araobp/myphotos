@isTest
private class SelectRecordsTest {

    @isTest
    private static void TestSelectRecordsByDistance() {
        
        // Test records
        List<Record__c> records = new List<Record__c>();
        Record__c r0 = new Record__c(Geolocation__latitude__s = 35.6372172, Geolocation__longitude__s = 139.7405733);  // Takanawa Gateway
        Record__c r1 = new Record__c(Geolocation__latitude__s = 35.59950474, Geolocation__longitude__s = 139.61154283);  // Mizonokuchi
        Record__c r2 = new Record__c(Geolocation__latitude__s = 35.6832452, Geolocation__longitude__s = 139.765727);  // Oazo
        records.add(r0);
        records.add(r1);
        records.add(r2);
        insert records;

        // Current position: Ino Tadataka
        Decimal currentLatitude = 35.655374507921415;
        Decimal currentLongitude = 139.74793551451094;

        List<Record__c> selection0 = SelectRecords.selectRecordsByDistance(currentLatitude, currentLongitude, 3);
        List<Record__c> selection1 = SelectRecords.selectRecordsByDistance(currentLatitude, currentLongitude, 8);
        List<Record__c> selection2 = SelectRecords.selectRecordsByDistance(currentLatitude, currentLongitude, 15);

        System.debug(selection0);
        System.debug(selection1);
        System.debug(selection2);
        
        System.assertEquals(selection0.size(), 1);
        System.assertEquals(selection1.size(), 2);
        System.assertEquals(selection2.size(), 3);        
    }
}