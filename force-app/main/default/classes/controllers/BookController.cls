public with sharing class  BookController {
    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByOwnerId(Id ownerId) {
        return BookSelector.selector.getBooksByOwnerId(ownerId);
    }
}