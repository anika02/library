public with sharing class WishListController {
    @AuraEnabled
    public static Wish_List__c addToWishList(Id bookId) {
        return WishListService.addToWishList(bookId);
    }

    @AuraEnabled
    public static void removeFromWishList(Id wishListId) {
        WishListService.removeFromWishList(wishListId);
    }
}