@isTest
public with sharing class RecordObjectTest {

    static string name = 'Apita Yokohama Tsunashima test place 345';
    static String memo = 'Remote working now';
    static String address = '神奈川県横浜市港北区綱島東４丁目';
    static String timestampGmt = '2022-10-28 23:46:18';
    static String timestampTokyo = '2022-10-29 08:46:18';
    static String uuid = 'e008f820-9186-4f93-baf0-cf1c0b3e12fd';
    static Decimal latitude = 35.54258299219887;
    static Decimal longitude = 139.64165440712304;
    static String base64 = 'BASE64DATA';

    static Decimal latitudeTsunashimaStation = 35.53720461909316;
    static Decimal longitudeTsunashimaStation = 139.63448726875527;

    @isTest static void createRecordTest() {

        Id recordId = RecordObject.createRecord(name, memo, address, timestampGmt, uuid, latitude, longitude, base64);

        Record__c record = [
                SELECT Name, Memo__c, Address__c, Timestamp__c, uuid__c,
                Geolocation__Latitude__s, Geolocation__Longitude__s,
                ImageURL__c, Image__c
                FROM Record__c
                WHERE Name = :name
                ];
        
        System.assertEquals(name, record.name);
        System.assertEquals(memo, record.Memo__c);
        System.assertEquals(address, record.Address__c);
        System.assertEquals(timestampTokyo, record.Timestamp__c.format('yyyy-MM-dd HH:mm:ss', 'Asia/Tokyo'));
        System.assertEquals(uuid, record.uuid__c);
        System.assertEquals(latitude, record.Geolocation__Latitude__s);
        System.assertEquals(longitude, record.Geolocation__Longitude__s);
        System.assertEquals(true, record.ImageURL__c.startsWith('/sfc/servlet.shepherd/version/download'));
        System.assertEquals(true, record.Image__c.startsWith('<img src='));
    }

    @isTest
    static void deleteRecordTest(){
        Id recordId = RecordObject.createRecord(name, memo, address, timestampGmt, uuid, latitude, longitude, base64);

        Boolean success = RecordObject.deleteRecord(recordId);
        System.assertEquals(true, success);
    }

    @isTest
    static void selectRecordsByDistanceTest(){

        RecordObject.createRecord(name, memo, address, timestampGmt, uuid, latitude, longitude, base64);

        List<Record__c> records = RecordObject.selectRecordsByDistance(latitudeTsunashimaStation, longitudeTsunashimaStation, 3.0);
        Boolean found = false;
        for (Record__c r: records) {
            if (r.Name == name) {
                found = true;
                break;
            }
        }
        System.assertEquals(true, found);
    }

}