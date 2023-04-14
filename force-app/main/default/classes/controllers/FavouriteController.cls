public with sharing class FavouriteController {
    @AuraEnabled
    public static Favourite__c addToFavourite(Id bookId) {
        return FavouriteService.addToFavourite(bookId);
    }

    @AuraEnabled
    public static void removeFromFavourite(Id favouriteId) {
        FavouriteService.removeFromFavourite(favouriteId);
    }
}