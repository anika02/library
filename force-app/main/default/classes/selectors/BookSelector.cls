public inherited sharing class BookSelector {
    public static BookSelector selector = new BookSelector();

    private static final List<String> availableListObjects = new List<String>{
        'Favourite__c',
        'Wish_List__c'
    };

    private static final List<String> finishedStatuses = ReservationConstants.FINISHED_RESERVATION_STATUSES;

    public List<Book__c> getByIds(List<Id> bookIds) {
        String query = getQuery() + ' WHERE Id IN :bookIds';
        query += ' WITH SECURITY_ENFORCED';

        return Database.query(String.escapeSingleQuotes(query));
    }

    public List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        String quote = '{quote}';
        List<String> bookFilters = new List<String>();
        if (filteredItems.containsKey('categories') && filteredItems.get('categories').size() > 0) {
            bookFilters.add(getCategoriesQueryFilter(filteredItems.get('categories'), quote));
        }

        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        String query = getQuery() + ' WHERE OwnerId = :ownerId';
        query += getNotDisabledQueryFilter();
        query += getSearchTermQueryFilter(searchTerm);
        query += String.join(bookFilters, '');
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    public List<Book__c> getOtherUserBooks(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        String quote = '{quote}';
        List<String> bookFilters = new List<String>();
        if (filteredItems.containsKey('categories') && filteredItems.get('categories').size() > 0) {
            bookFilters.add(getCategoriesQueryFilter(filteredItems.get('categories'), quote));
        }

        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        List<String> additionalFields = new List<String> {
            getWishListQueryField(),
            getFavouriteQueryField(),
            getNotFinishedReservationByOwnerIdQueryField()
        };

        String query = getQuery(additionalFields) + ' WHERE OwnerId != :ownerId';
        query += getNotDisabledQueryFilter();
        query += getSearchTermQueryFilter(searchTerm);
        query += String.join(bookFilters, '');
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    public List<Book__c> getBooksByListNameAndOwnerId(Id ownerId, String listObjectName, String searchTerm, Map<String, List<String>> filteredItems) {
        if (!availableListObjects.contains(listObjectName)) {
            return null;
        }

        String quote = '{quote}';
        List<String> bookFilters = new List<String>();
        if (filteredItems.containsKey('categories') && filteredItems.get('categories').size() > 0) {
            bookFilters.add(getCategoriesQueryFilter(filteredItems.get('categories'), quote));
        }

        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        String filteredIdsQuery = 'SELECT Book__c FROM ' + listObjectName + ' WHERE CreatedById = :ownerId';
        List<String> additionalFields = new List<String> {
            getWishListQueryField(),
            getFavouriteQueryField(),
            getNotFinishedReservationByOwnerIdQueryField()
        };

        String query = getQuery(additionalFields) + ' WHERE (Id IN (' + filteredIdsQuery + '))';
        query += getNotDisabledQueryFilter();
        query += getSearchTermQueryFilter(searchTerm);
        query += String.join(bookFilters, '');
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    public List<Book__c> getBorrowedBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        String quote = '{quote}';
        List<String> bookFilters = new List<String>();
        if (filteredItems.containsKey('categories') && filteredItems.get('categories').size() > 0) {
            bookFilters.add(getCategoriesQueryFilter(filteredItems.get('categories'), quote));
        }

        List<String> statuses = new List<String>();
        if (filteredItems.containsKey('reservationStatuses')) {
            statuses.addAll(filteredItems.get('reservationStatuses'));
        }

        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;
        List<String> additionalFields = new List<String> {
            getWishListQueryField(),
            getFavouriteQueryField(),
            getReservationsByOwnerIdQueryField(statuses)
        };

        String query = getQuery(additionalFields);
        query += ' WHERE (Id IN (' + getFilteredBorrowedBookIdsQuery(statuses) + '))';
        query += getSearchTermQueryFilter(searchTerm);
        query += String.join(bookFilters, '');
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    public List<Book__c> getLentBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        String quote = '{quote}';
        List<String> bookFilters = new List<String>();
        if (filteredItems.containsKey('categories') && filteredItems.get('categories').size() > 0) {
            bookFilters.add(getCategoriesQueryFilter(filteredItems.get('categories'), quote));
        }

        List<String> statuses = new List<String>();
        if (filteredItems.containsKey('reservationStatuses')) {
            statuses.addAll(filteredItems.get('reservationStatuses'));
        }

        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;
        List<String> additionalFields = new List<String> {
            getReservationsQueryField(statuses)
        };

        String query = getQuery(additionalFields);
        query += ' WHERE (Id IN (' + getFilteredLentBookIdsQuery(statuses) + '))';
        query += getSearchTermQueryFilter(searchTerm);
        query += String.join(bookFilters, '');
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    private static String getWishListQueryField() {
        return '(SELECT Id FROM Wish_Lists__r WHERE CreatedById = :ownerId)';
    }

    private static String getFavouriteQueryField() {
        return '(SELECT Id FROM Favourites__r WHERE CreatedById = :ownerId)';
    }

    private static String getNotFinishedReservationByOwnerIdQueryField() {
        return '(' + getReservationQueryFields() +
            ' WHERE CreatedById = :ownerId' +
            ' AND Status__c NOT IN :finishedStatuses)';
    }

    private static String getReservationsQueryField(List<String> statuses) {
        String filterStatus = statuses.size() > 0 ? ' WHERE Status__c IN :statuses' : '';
        return '(' + getReservationQueryFields() + filterStatus + ')';
    }

    private static String getReservationsByOwnerIdQueryField(List<String> statuses) {
        String filterStatus = statuses.size() > 0 ? ' AND Status__c IN :statuses' : '';
        return '(' + getReservationQueryFields() +
            ' WHERE CreatedById = :ownerId' + filterStatus + ')';
    }

    private static String getFilteredBorrowedBookIdsQuery(List<String> statuses) {
        String filterStatus = statuses.size() > 0 ? ' AND Status__c IN :statuses' : '';
        return 'SELECT Book__c FROM Reservation__c' +
            ' WHERE CreatedById = :ownerId' + filterStatus;
    }

    private static String getFilteredLentBookIdsQuery(List<String> statuses) {
        String filterStatus = statuses.size() > 0 ? ' AND Status__c IN :statuses' : '';
        return 'SELECT Book__c FROM Reservation__c' +
            ' WHERE Book__r.OwnerId = :ownerId' + filterStatus;
    }

    private static String getNotDisabledQueryFilter() {
        return ' AND (Disabled__c = FALSE)';
    }

    private static String getSearchTermQueryFilter(String searchTerm) {
        return String.isNotBlank(searchTerm) ? ' AND (Name LIKE :searchTerm OR Author__c LIKE :searchTerm)' : '';
    }

    private static String getCategoriesQueryFilter(List<String> categories, String quote) {
        String categoriesTerm = categories.size() > 0 ? (quote + String.join(categories, quote + ',' + quote) + quote) : '';
        return String.isNotBlank(categoriesTerm) ? ' AND (Category__c INCLUDES(' + categoriesTerm + '))' : '';
    }

    private static String getReservationQueryFields() {
        List<String> queryFields = new List<String>{
            'Id',
            'Start_Date__c',
            'End_Date__c',
            'Status__c',
            'CreatedById',
            'CreatedBy.Name',
            'CreatedBy.City',
            'CreatedBy.Country'
        };

        String query = 'SELECT ' + String.join(queryFields, ',') + ' FROM Reservations__r';

        return query;
    }

    private static String getQuery() {
        return getQuery(new List<String>());
    }

    private static String getQuery(List<String> additionalFields) {
        List<String> queryFields = new List<String>{
            'Author__c',
            'Category__c',
            'Description__c',
            'Disabled__c',
            'Language__c',
            'Name',
            'OwnerId',
            'Photo_Id__c',
            'Photo_URL__c',
            'Publication_Year__c',
            'Publishing_House__c',
            'TYPEOF Owner WHEN User THEN Name, City, Country END'
        };

        queryFields.addAll(additionalFields);
        String query = 'SELECT ' + String.join(queryFields, ',') + ' FROM Book__c';

        return query;
    }
}