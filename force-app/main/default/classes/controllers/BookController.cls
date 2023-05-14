public with sharing class BookController {
    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBooksByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getOtherUserBooks(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getOtherUserBooks(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByListNameAndOwnerId(Id ownerId, String listObjectName, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBooksByListNameAndOwnerId(ownerId, listObjectName, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBorrowedBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBorrowedBookReservationsByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getLentBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getLentBookReservationsByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Map<String, String>> getAllCategories() {
        List<Map<String, String>> categories = new List<Map<String, String>>();

        for (PicklistEntry item : Book__c.Category__c.getDescribe().getPicklistValues()) {
            categories.add(new Map<String, String> {
                'label' => item.label,
                'value' => item.value
            });
        }

        return categories;
    }

    @AuraEnabled
    public static Book__c upsertBook(String jsonString, String documentId) {
        return BookService.upsertBook(jsonString, documentId);
    }

    @AuraEnabled
    public static void deleteBook(Id bookId) {
        Integer bookReservationsCount = ReservationSelector.selector.getByBookIds(new List<Id>{ bookId }).size();
        if (bookReservationsCount > 0) {
            BookService.updateBook(new Book__c(
                Id = bookId,
                Disabled__c = true
            ));
            FavouriteService.deleteRecordsByBookIds(new List<Id>{ bookId });
            WishListService.deleteRecordsByBookIds(new List<Id>{ bookId });

        } else {
            Book__c book = BookSelector.selector.getByIds(new List<Id>{ bookId })[0];
            if (String.isNotBlank(book.Photo_Id__c)) {
                FileController.deleteDocumentByVersionId(book.Photo_Id__c);
            }
            BookService.deleteBook(bookId);
        }
    }
}