public inherited sharing class BookSelector {
    public static BookSelector selector = new BookSelector();

    public List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm, List<String> categories) {
        String quote = '{quote}';
        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        String categoriesTerm = categories.size() > 0 ? (quote + String.join(categories, quote + ',' + quote) + quote) : '';

        String query = getQuery() + ' WHERE OwnerId = :ownerId';
        query += String.isNotBlank(searchTerm) ? ' AND (Name LIKE :searchTerm OR Author__c LIKE :searchTerm)' : '';
        query += String.isNotBlank(categoriesTerm) ? ' AND (Category__c INCLUDES(' + categoriesTerm + '))' : '';
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        return Database.query(query);
    }

    public List<Book__c> getOtherUserBooks(Id ownerId, String searchTerm, List<String> categories) {
        String quote = '{quote}';
        searchTerm = String.isNotBlank(searchTerm) ? '%' + searchTerm + '%' : searchTerm;

        String categoriesTerm = categories.size() > 0 ? (quote + String.join(categories, quote + ',' + quote) + quote) : '';

        String wishListQuery = '(SELECT Id FROM Wish_Lists__r WHERE CreatedById = :ownerId)';
        String favouriteQuery = '(SELECT Id FROM Favourites__r WHERE CreatedById = :ownerId)';
        String query = getQuery(new List<String>{ wishListQuery, favouriteQuery }) + ' WHERE OwnerId != :ownerId';
        query += String.isNotBlank(searchTerm) ? ' AND (Name LIKE :searchTerm OR Author__c LIKE :searchTerm)' : '';
        query += String.isNotBlank(categoriesTerm) ? ' AND (Category__c INCLUDES(' + categoriesTerm + '))' : '';
        query += ' WITH SECURITY_ENFORCED';

        query = String.escapeSingleQuotes(query).replace(quote, '\'');

        System.debug('query' + query);

        System.debug('result' + Database.query(query));
        return Database.query(query);
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
            'TYPEOF Owner WHEN User THEN City, Country END'
        };

        queryFields.addAll(additionalFields);
        String query = 'SELECT ' + String.join(queryFields, ',') + ' FROM Book__c';

        return query;
    }
}