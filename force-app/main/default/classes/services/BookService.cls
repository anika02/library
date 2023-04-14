public inherited sharing class BookService {
    public static Book__c upsertBook(String jsonString, String documentId) {
        Book__c book = (Book__c) JSON.deserialize(jsonString, Book__c.class);

        if (String.isNotBlank(documentId)) {
            book.Photo_Id__c = FileController.getFileIdByDocumentId(documentId);
        }

        SecurityUtils.saveUpsert(book);

        return book;
    }

    public static void deleteBook(Id bookId) {
        SecurityUtils.saveDelete(new Book__c(Id = bookId));
    }
}