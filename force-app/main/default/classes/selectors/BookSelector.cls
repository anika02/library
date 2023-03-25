public inherited sharing class BookSelector {
    public static BookSelector selector = new BookSelector();

    public List<Book__c> getBooksByOwnerId(Id ownerId) {
        return [
                SELECT
                        Author__c,
                        Category__c,
                        Description__c,
                        Disabled__c,
                        Name,
                        Owner__c,
                        Owner__r.Email,
                        Owner__r.Instagram__c,
                        Owner__r.Name,
                        Owner__r.Phone,
                        Owner__r.Telegram_Phone__c,
                        Owner__r.Telegram_Username__c,
                        Owner__r.Viber__c,
                        Reservation_Limit__c
                FROM Book__c
                WHERE Owner__c = :ownerId
                WITH SECURITY_ENFORCED
        ];
    }
}