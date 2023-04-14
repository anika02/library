public with sharing class BookController {
    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm, List<String> categories) {
        return BookSelector.selector.getBooksByOwnerId(ownerId, searchTerm, categories);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getOtherUserBooks(Id ownerId, String searchTerm, List<String> categories) {
        return BookSelector.selector.getOtherUserBooks(ownerId, searchTerm, categories);
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
        BookService.deleteBook(bookId);
    }
}