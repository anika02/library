public inherited sharing class WishListSelector {
    public static WishListSelector selector = new WishListSelector();

    public List<Wish_List__c> getByBookIds(List<Id> bookIds) {
        return [
            SELECT
                Id
            FROM Wish_List__c
            WHERE Book__c IN :bookIds
            WITH SECURITY_ENFORCED
        ];
    }
}