public inherited sharing class ReservationService {
    public static Reservation__c insertReservation(String jsonString) {
        Reservation__c reservation = (Reservation__c) JSON.deserialize(jsonString, Reservation__c.class);

        SecurityUtils.saveInsert(reservation);

        return reservation;
    }

    public static Reservation__c updateReservation(String jsonString) {
        Reservation__c reservation = (Reservation__c) JSON.deserialize(jsonString, Reservation__c.class);

        SecurityUtils.saveUpdate(reservation);

        return reservation;
    }

    public static Reservation__c updateReservation(Reservation__c reservation) {
        SecurityUtils.saveUpdate(reservation);

        return reservation;
    }

    public static Reservation__c upsertReservation(String jsonString) {
        Reservation__c reservation = (Reservation__c) JSON.deserialize(jsonString, Reservation__c.class);

        SecurityUtils.saveUpsert(reservation);

        return reservation;
    }

    public static Reservation__c updateReservationStatus(Id reservationId, String status) {
        Reservation__c reservation = new Reservation__c(
            Id = reservationId,
            Status__c = status
        );

        SecurityUtils.saveUpdate(reservation);

        return reservation;
    }
}