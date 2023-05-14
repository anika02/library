public with sharing class FileController {
    @AuraEnabled(Cacheable = true)
    public static Id getFileIdByDocumentId(String documentId) {

        List<ContentVersion> contentVersion = FileSelector.selector.getByDocumentId(new Set<Id>{ documentId });

        if (contentVersion.size() == 1) {
            return contentVersion[0].Id;
        }

        return null;
    }

    @AuraEnabled(Cacheable = true)
    public static Id getDocumentIdtByVersionId(String versionId) {

        List<ContentDocument> contentDocument = FileSelector.selector.getByVersionId(new Set<Id>{ versionId });

        if (contentDocument.size() == 1) {
            return contentDocument[0].Id;
        }

        return null;
    }

    @AuraEnabled
    public static void deleteDocumentById(Id documentId) {
        SecurityUtils.saveDelete(new ContentDocument(Id = documentId));
    }

    @AuraEnabled
    public static void deleteDocumentByVersionId(Id versionId) {
        Id documentId = getDocumentIdtByVersionId(versionId);
        SecurityUtils.saveDelete(new ContentDocument(Id = documentId));
    }
}