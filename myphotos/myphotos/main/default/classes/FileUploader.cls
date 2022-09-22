// [Reference] https://www.salesforcetroop.com/custom_file_upload_using_lwc
public with sharing class FileUploader {

	@AuraEnabled
  public static String uploadFile(String base64, String filename, String recordId) {
		try {
      ContentVersion cv = createContentVersion(base64, filename);
      ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
      if (cv == null || cdl == null) {
        return null;
      }

			ContentVersion[] contentVersions = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :cdl.contentDocumentId];
      return contentVersions[0].Id;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
  }

	@AuraEnabled
	public static Boolean deleteFile(String recordId){
		try {
			List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
			List<ContentDocument> contentDocuments = new List<ContentDocument>();
			for (ContentDocumentLink link: contentDocumentLinks) {
				ContentDocument contentDocument = [SELECT Id FROM ContentDocument WHERE Id = :link.ContentDocumentId LIMIT 1];
				if (contentDocument != null) {
					contentDocuments.add(contentDocument);
				}
			}
			Boolean deleted = false;
			if (contentDocuments.size() > 0) {
				delete contentDocuments;
				deleted = true;
			}
			return deleted;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	private static ContentVersion createContentVersion(String base64, String filename) {
		ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    try {
      insert cv;
      return cv;
    } catch(DMLException e) {
      System.debug(e);
      return null;
    }
  }

	private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
    if (contentVersionId == null || recordId == null) {
      return null;
    }
   	ContentDocumentLink cdl = new ContentDocumentLink();
   	cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
   	cdl.LinkedEntityId = recordId;
    // ShareType is either 'V', 'C', or 'I'
    // V = Viewer, C = Collaborator, I = Inferred
    cdl.ShareType = 'V';
    try {
      insert cdl;
      return cdl;
    } catch(DMLException e) {
  		System.debug(e);
      return null;
    }
	}

	// This method is for an operation & maintenance purpose only
	/*
	public static void updateImageField(Id id) {
		List<Record__c> records;
		if (id == null) {
			records = [SELECT Id, ImageURL__c, Timestamp__c FROM Record__c ORDER BY Id LIMIT 33];
		} else {
			records = [SELECT Id, ImageURL__c, Timestamp__c FROM Record__c WHERE Id > :id ORDER BY Id LIMIT 33];
		}
		Id lastId;
		for (Record__c r : records) {
			ContentDocumentLink link = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :r.Id LIMIT 1];
			ContentVersion version = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :link.ContentDocumentId LIMIT 1];
			r.ImageURL__c = '/sfc/servlet.shepherd/version/download/' + version.Id;
			lastId = r.Id;
		}
		update records;
		System.debug(lastId);
	}
	*/	
}