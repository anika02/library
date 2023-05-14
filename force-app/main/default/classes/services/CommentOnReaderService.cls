public inherited sharing class CommentOnReaderService {
    public static Comment_On_Reader__c insertCommentOnReader(Id userId, String text) {
        if (String.isBlank(userId) || String.isBlank(text)) {
            return null;
        }

        Comment_On_Reader__c commentOnReader = new Comment_On_Reader__c(
            User__c = userId,
            Time__c = Datetime.now(),
            Text__c = text
        );

        SecurityUtils.saveInsert(commentOnReader);

        return commentOnReader;
    }
}