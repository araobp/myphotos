@isTest
public with sharing class FileUploaderTest {

    static string name = 'Apita Yokohama Tsunashima test place 345';
    static String memo = 'Remote working now';
    static String address = '神奈川県横浜市港北区綱島東４丁目';
    static String timestampGmt = '2022-10-28 23:46:18';
    static String timestampTokyo = '2022-10-29 08:46:18';
    static String uuid = 'e008f820-9186-4f93-baf0-cf1c0b3e12fd';
    static Decimal latitude = 35.54258299219887;
    static Decimal longitude = 139.64165440712304;
    static String base64 = 'BASE64DATA';
    static String fileName = 'TestFile';

    @TestSetup
    static void makeData(){
        Record__c r = new Record__c();
        r.Name = name;
        r.Memo__c = memo;
        r.Address__c = address;
        r.Timestamp__c = Datetime.valueOfGmt(timestampGmt);
        r.uuid__c = uuid;
        r.Geolocation__Latitude__s = latitude;
        r.Geolocation__Longitude__s = longitude;
        insert r;        
    }

    @isTest
    static void uploadFileTest() {
        Record__c r = [SELECT Id FROM Record__c WHERE Name = :name];

        String id = FileUploader.uploadFile(base64, fileName, r.Id);

        List<ContentVersion> contentVersionIds = [SELECT Id FROM ContentVersion WHERE Title = :fileName LIMIT 1];
        System.assertEquals(contentVersionIds[0].Id, id);
    }

    @isTest
    static void deleteFileTest(){
        Record__c r = [SELECT Id FROM Record__c WHERE Name = :name];
        
        String id = FileUploader.uploadFile(base64, fileName, r.Id);
        FileUploader.deleteFile(r.Id);
        List<ContentVersion> contentVersionIds = [SELECT Id FROM ContentVersion WHERE Title = :fileName];
        System.assertEquals(0, contentVersionIds.size());
    }

}