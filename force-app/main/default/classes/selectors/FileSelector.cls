public virtual inherited sharing class FileSelector {

    public static FileSelector selector = new FileSelector();

    public virtual List<ContentVersion> getByDocumentId(Set<Id> ids) {
        return [
            SELECT Id, ContentDocumentId, VersionData, Title
            FROM ContentVersion
            WHERE Id IN (SELECT LatestPublishedVersionId FROM ContentDocument WHERE Id IN :ids)
            WITH SECURITY_ENFORCED
        ];
    }

    public virtual List<ContentDocument> getByVersionId(Set<Id> ids) {
        return [
            SELECT Id, LatestPublishedVersionId, Title
            FROM ContentDocument
            WHERE Id IN (SELECT ContentDocumentId FROM ContentVersion WHERE Id IN :ids)
            WITH SECURITY_ENFORCED
        ];
    }
}