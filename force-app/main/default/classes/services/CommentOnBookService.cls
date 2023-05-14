public inherited sharing class CommentOnBookService {
    public static Comment_On_Book__c insertCommentOnBook(Id bookId, String text) {
        if (String.isBlank(bookId) || String.isBlank(text)) {
            return null;
        }

        Comment_On_Book__c commentOnBook = new Comment_On_Book__c(
            Book__c = bookId,
            Time__c = Datetime.now(),
            Text__c = text
        );

        SecurityUtils.saveInsert(commentOnBook);

        return commentOnBook;
    }
}