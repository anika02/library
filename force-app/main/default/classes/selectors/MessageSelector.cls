public inherited sharing class MessageSelector {
    public static MessageSelector selector = new MessageSelector();

    public List<Message__c> getMessagesByReservationId(Id reservationId) {
        return [
            SELECT
                Sender__c,
                Time__c,
                Message__c
            FROM Message__c
            WHERE Reservation__c = :reservationId
            WITH SECURITY_ENFORCED
            ORDER BY Time__c
        ];
    }
}