public with sharing class ReservationController {
    @AuraEnabled(Cacheable = true)
    public static List<Reservation__c> getReservationDatesByBookId(Id bookId) {
        return ReservationSelector.selector.getReservationDatesByBookId(bookId);
    }

    @AuraEnabled
    public static Reservation__c insertReservation(String jsonString) {
        return ReservationService.insertReservation(jsonString);
    }

    @AuraEnabled
    public static Reservation__c updateReservation(String jsonString) {
        return ReservationService.updateReservation(jsonString);
    }

    @AuraEnabled
    public static Reservation__c upsertReservation(String jsonString) {
        Id reservationId = ReservationService.upsertReservation(jsonString).Id;
        return ReservationSelector.selector.getByIds(new List<Id>{ reservationId })[0];
    }

    @AuraEnabled
    public static Reservation__c updateReservationStatus(Id reservationId, String status) {
        return ReservationService.updateReservationStatus(reservationId, status);
    }

    @AuraEnabled
    public static Reservation__c finishReservationByOwner(Id reservationId, Map<String, String> comments) {
        List<Reservation__c> reservationList = ReservationSelector.selector.getByIds(new List<Id>{ reservationId });

        if (reservationList.size() != 1 ) {
            return null;
        }

        Reservation__c reservation = reservationList[0];

        if (comments.containsKey('ReservationComment') && String.isNotBlank(comments.get('ReservationComment'))) {
            reservation.Status_Comment__c = comments.get('ReservationComment');
        }

        if (comments.containsKey('ReaderComment') && String.isNotBlank(comments.get('ReaderComment'))) {
            CommentOnReaderController.insertCommentOnReader(reservation.CreatedById, comments.get('ReaderComment'));
        }

        if (reservation.Status__c == ReservationConstants.STATUS_FINISHED_BY_READER) {
            reservation.Status__c = ReservationConstants.STATUS_FINISHED;
        } else {
            reservation.Status__c = ReservationConstants.STATUS_FINISHED_BY_OWNER;
        }

        return ReservationService.updateReservation(reservation);
    }

    @AuraEnabled
    public static Reservation__c finishReservationByReader(Id reservationId, Map<String, String> comments) {
        List<Reservation__c> reservationList = ReservationSelector.selector.getByIds(new List<Id>{ reservationId });

        if (reservationList.size() != 1 ) {
            return null;
        }

        Reservation__c reservation = reservationList[0];

        if (comments.containsKey('BookComment') && String.isNotBlank(comments.get('BookComment'))) {
            CommentOnBookController.insertCommentOnBook(reservation.Book__c, comments.get('BookComment'));
        }

        if (comments.containsKey('OwnerComment') && String.isNotBlank(comments.get('OwnerComment'))) {
            CommentOnOwnerController.insertCommentOnOwner(reservation.Book__r.OwnerId, comments.get('OwnerComment'));
        }

        if (reservation.Status__c == ReservationConstants.STATUS_FINISHED_BY_OWNER) {
            reservation.Status__c = ReservationConstants.STATUS_FINISHED;
        } else {
            reservation.Status__c = ReservationConstants.STATUS_FINISHED_BY_READER;
        }

        return ReservationService.updateReservation(reservation);
    }
}