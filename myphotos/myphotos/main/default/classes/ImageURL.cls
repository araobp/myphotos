public with sharing class ImageURL {

    public class URL {
        @AuraEnabled public Boolean found = false;
        @AuraEnabled public String name;
        @AuraEnabled public String url;
    }

    @AuraEnabled(cacheable=true)
    public static URL getImageURL(Id recordId) {
        
        URL url = new URL();
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId from ContentDocumentLink where LinkedEntityId = :recordId];
        
        for (ContentDocumentLink link : contentDocumentLinks) {
            Id contentDocumentId = link.ContentDocumentId;
            ContentVersion contentVersion = [SELECT Id, Title FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId LIMIT 1];
            String title = contentVersion.Title;
            Id contentVersionId = contentVersion.Id;
            url.found = true;
            Record__c r = [SELECT Name FROM Record__c WHERE Id = :recordId LIMIT 1];
            url.name = r.Name;
            url.url = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
        }
        System.debug(url);
        return url;
    }

}