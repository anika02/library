public inherited sharing class FavouriteSelector {
    public static FavouriteSelector selector = new FavouriteSelector();

    public List<Favourite__c> getByBookIds(List<Id> bookIds) {
        return [
            SELECT
                Id
            FROM Favourite__c
            WHERE Book__c IN :bookIds
            WITH SECURITY_ENFORCED
        ];
    }
}