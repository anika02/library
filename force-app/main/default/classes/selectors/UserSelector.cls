public inherited sharing class UserSelector {
    public static UserSelector selector = new UserSelector();

    public User getUserInfo(Id userId) {
        return [
            SELECT
                City,
                Country,
                Email,
                Instagram__c,
                Name,
                Phone,
                Telegram_Phone__c,
                Telegram_Username__c,
                Viber__c
            FROM User
            WHERE Id =: userId
            WITH SECURITY_ENFORCED
        ];
    }
}