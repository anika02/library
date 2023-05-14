public inherited sharing class CommentOnOwnerService {
    public static Comment_On_Owner__c insertCommentOnOwner(Id userId, String text) {
        if (String.isBlank(userId) || String.isBlank(text)) {
            return null;
        }

        Comment_On_Owner__c commentOnOwner = new Comment_On_Owner__c(
            User__c = userId,
            Time__c = Datetime.now(),
            Text__c = text
        );

        SecurityUtils.saveInsert(commentOnOwner);

        return commentOnOwner;
    }
}