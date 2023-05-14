public inherited sharing class ReservationSelector {
    public static ReservationSelector selector = new ReservationSelector();

    public List<Reservation__c> getReservationDatesByBookId(Id bookId) {
        return [
            SELECT
                Actual_End_Date__c,
                End_Date__c,
                Start_Date__c
            FROM Reservation__c
            WHERE
                Book__c = :bookId
                AND Actual_End_Date__c = NULL
                AND End_Date__c > TODAY
                AND Status__c IN :ReservationConstants.ACTIVE_RESERVATION_STATUSES
            WITH SECURITY_ENFORCED
            ORDER BY Start_Date__c
        ];
    }

    public List<Reservation__c> getByIds(List<Id> reservationIds) {
        return [
            SELECT
                Actual_End_Date__c,
                Book__c,
                Book__r.OwnerId,
                CreatedById,
                End_Date__c,
                Start_Date__c,
                Status__c,
                Status_Comment__c
            FROM Reservation__c
            WHERE Id IN :reservationIds
            WITH SECURITY_ENFORCED
        ];
    }

    public List<Reservation__c> getByBookIds(List<Id> bookIds) {
        return [
            SELECT
                Actual_End_Date__c,
                Book__c,
                Book__r.OwnerId,
                CreatedById,
                End_Date__c,
                Start_Date__c,
                Status__c,
                Status_Comment__c
            FROM Reservation__c
            WHERE Book__c IN :bookIds
            WITH SECURITY_ENFORCED
        ];
    }
}