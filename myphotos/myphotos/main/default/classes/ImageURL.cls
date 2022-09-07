public with sharing class ImageURL {

    public class URL {
        @AuraEnabled public Boolean found = false;
        @AuraEnabled public String title;
        @AuraEnabled public String url;
    }

    @AuraEnabled(cacheable=true)
    public static URL getImageURL(Id recordId, Boolean thumbnail) {
        
        URL url = new URL();
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId from ContentDocumentLink where LinkedEntityId = :recordId];
        
        for (ContentDocumentLink link : contentDocumentLinks) {
            Id contentDocumentId = link.ContentDocumentId;
            ContentVersion contentVersion = [SELECT Id, Title FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId LIMIT 1];
            String title = contentVersion.Title;
            Boolean add = false;
            if (title.endsWith('_small') || title.endsWith('_small.jpeg')) {  // thumbnail image
                if (thumbnail == true) add = true;
            } else {
                if (thumbnail == false) add = true;
            }
            if (add) {
                Id contentVersionId = contentVersion.Id;
                url.found = true;
                url.title = title;
                url.url = '/sfc/servlet.shepherd/version/download/' + contentVersionId;
            }
        }
        System.debug(url);
        return url;
    }

}