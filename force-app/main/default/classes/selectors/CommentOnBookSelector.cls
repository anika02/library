public inherited sharing class CommentOnBookSelector {
    public static CommentOnBookSelector selector = new CommentOnBookSelector();

    public List<Comment_On_Book__c> getCommentsByBookId(Id bookId) {
        return [
            SELECT
                CreatedBy.Name,
                Text__c,
                Time__c
            FROM Comment_On_Book__c
            WHERE Book__c = :bookId
            WITH SECURITY_ENFORCED
        ];
    }
}