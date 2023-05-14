public with sharing class CommentOnBookController {
    @AuraEnabled(Cacheable = true)
    public static List<Comment_On_Book__c> getCommentsByBookId(Id bookId) {
        return CommentOnBookSelector.selector.getCommentsByBookId(bookId);
    }

    @AuraEnabled
    public static Comment_On_Book__c insertCommentOnBook(Id bookId, String text) {
        return CommentOnBookService.insertCommentOnBook(bookId, text);
    }
}