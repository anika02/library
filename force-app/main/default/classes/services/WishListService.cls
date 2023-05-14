public inherited sharing class WishListService {
    public static Wish_List__c addToWishList(Id bookId) {
        if (String.isBlank(bookId)) {
            return null;
        }

        Wish_List__c wishList = new Wish_List__c(Book__c = bookId);
        SecurityUtils.saveInsert(wishList);

        return wishList;
    }

    public static void deleteRecordsByBookIds(List<Id> bookIds) {
        SecurityUtils.saveDelete(WishListSelector.selector.getByBookIds(bookIds));
    }

    public static void removeFromWishList(Id wishListId) {
        SecurityUtils.saveDelete(new Wish_List__c(Id = wishListId));
    }
}