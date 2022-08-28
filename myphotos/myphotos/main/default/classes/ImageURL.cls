public with sharing class ImageURL {

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getImageURLs(Id recordId) {
        Map<String, String> urlMap = new Map<String, String>();
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId from ContentDocumentLink where LinkedEntityId = :recordId];
        for (ContentDocumentLink link : contentDocumentLinks) {
            Id contentDocumentId = link.ContentDocumentId;
            ContentVersion contentVersion = [SELECT Id, Title FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId LIMIT 1];
            String title = contentVersion.Title;
            Id contentVersionId = contentVersion.Id;  
            String url = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
            urlMap.put(title, url);
        }
        System.debug(urlMap);
        return urlMap;
    }
}