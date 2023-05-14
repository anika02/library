public inherited sharing class MessageService {
    public static Message__c insertMessage(Id reservationId, String text) {
        if (String.isBlank(reservationId) || String.isBlank(text)) {
            return null;
        }

        Message__c message = new Message__c(
            Message__c = text,
            Reservation__c = reservationId,
            Sender__c = UserInfo.getUserId(),
            Time__c = Datetime.now()
        );

        SecurityUtils.saveInsert(message);

        return message;
    }
}