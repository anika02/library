public with sharing class CommentOnReaderController {
    @AuraEnabled
    public static Comment_On_Reader__c insertCommentOnReader(Id userId, String text) {
        return CommentOnReaderService.insertCommentOnReader(userId, text);
    }
}