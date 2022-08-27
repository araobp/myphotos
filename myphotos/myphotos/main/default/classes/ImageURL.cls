public with sharing class ImageURL {

    @AuraEnabled(cacheable=true)
    public static String getImageURL(Id recordId) {
        ContentDocumentLink contentDocumentLink = [SELECT ContentDocumentId from ContentDocumentLink where LinkedEntityId = :recordId LIMIT 1];
        Id contentDocumentId = contentDocumentLink.ContentDocumentId;
        ContentVersion contentVersion = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId LIMIT 1];
        Id contentVersionId = contentVersion.Id;
        String url = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
        return url;
    }
}