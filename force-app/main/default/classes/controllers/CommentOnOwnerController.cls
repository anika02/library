public with sharing class CommentOnOwnerController {
    @AuraEnabled
    public static Comment_On_Owner__c insertCommentOnOwner(Id userId, String text) {
        return CommentOnOwnerService.insertCommentOnOwner(userId, text);
    }
}