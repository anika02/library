public class ReservationConstants {

    // Statuses
    public static final String STATUS_CREATED = 'created';
    public static final String STATUS_CANCELED = 'canceled';
    public static final String STATUS_CONFIRMED = 'confirmed';
    public static final String STATUS_REJECTED = 'rejected';
    public static final String STATUS_FINISHED_BY_OWNER = 'finished by owner';
    public static final String STATUS_FINISHED_BY_READER = 'finished by reader';
    public static final String STATUS_FINISHED = 'finished';

    public static final List<String> ACTIVE_RESERVATION_STATUSES = new List<String> { STATUS_CONFIRMED, STATUS_FINISHED_BY_OWNER, STATUS_FINISHED_BY_READER };
    public static final List<String> FINISHED_RESERVATION_STATUSES = new List<String> { STATUS_CANCELED, STATUS_REJECTED, STATUS_FINISHED };
}
