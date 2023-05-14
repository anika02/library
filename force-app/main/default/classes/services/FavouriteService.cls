public inherited sharing class FavouriteService {
    public static Favourite__c addToFavourite(Id bookId) {
        if (String.isBlank(bookId)) {
            return null;
        }

        Favourite__c favourite = new Favourite__c(Book__c = bookId);
        SecurityUtils.saveInsert(favourite);

        return favourite;
    }

    public static void deleteRecordsByBookIds(List<Id> bookIds) {
        SecurityUtils.saveDelete(FavouriteSelector.selector.getByBookIds(bookIds));
    }

    public static void removeFromFavourite(Id favouriteId) {
        SecurityUtils.saveDelete(new Favourite__c(Id = favouriteId));
    }
}