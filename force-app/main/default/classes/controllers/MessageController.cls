public with sharing class MessageController {
    @AuraEnabled(Cacheable=true)
    public static List<Message__c> getMessagesByReservationId(Id reservationId) {
        return MessageSelector.selector.getMessagesByReservationId(reservationId);
    }

    @AuraEnabled
    public static Message__c insertMessage(Id reservationId, String text) {
        return MessageService.insertMessage(reservationId, text);
    }
}