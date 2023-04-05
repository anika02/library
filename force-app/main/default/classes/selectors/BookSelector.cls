public inherited sharing class BookSelector {
    public static BookSelector selector = new BookSelector();

    public List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm) {
        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        String query = getQuery() + ' WHERE OwnerId = :ownerId';
        query += String.isNotBlank(searchTerm) ? ' AND (Name LIKE :searchTerm OR Author__c LIKE :searchTerm)' : '';
        query += ' WITH SECURITY_ENFORCED';

        System.debug(ownerId + ' - ' + searchTerm + ' - ' + query);


        return Database.query(String.escapeSingleQuotes(query));
    }

    private static String getQuery() {
        List<String> queryFields = new List<String>{
            'Author__c',
            'Category__c',
            'Description__c',
            'Disabled__c',
            'Name',
            'OwnerId',
            'TYPEOF Owner WHEN User THEN City, Country END',
            'Reservation_Limit__c'
        };

        String query = 'SELECT ' + String.join(queryFields, ',') + ' FROM Book__c';

        return query;
    }
}