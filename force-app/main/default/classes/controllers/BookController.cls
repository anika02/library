public with sharing class BookController {
    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBooksByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getOtherUserBooks(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
//        List<ReaderBook> readerBooks = new List<ReaderBook>();
//        for (Book__c book : BookSelector.selector.getOtherUserBooks(ownerId, searchTerm, filteredItems)) {
//            System.debug(new ReaderBook(book));
//            readerBooks.add(new ReaderBook(book));
//        }

        return BookSelector.selector.getOtherUserBooks(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooksByListNameAndOwnerId(Id ownerId, String listObjectName, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBooksByListNameAndOwnerId(ownerId, listObjectName, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBorrowedBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getBorrowedBookReservationsByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getLentBookReservationsByOwnerId(Id ownerId, String searchTerm, Map<String, List<String>> filteredItems) {
        return BookSelector.selector.getLentBookReservationsByOwnerId(ownerId, searchTerm, filteredItems);
    }

    @AuraEnabled(Cacheable = true)
    public static List<Map<String, String>> getAllCategories() {
        List<Map<String, String>> categories = new List<Map<String, String>>();

        for (PicklistEntry item : Book__c.Category__c.getDescribe().getPicklistValues()) {
            categories.add(new Map<String, String> {
                'label' => item.label,
                'value' => item.value
            });
        }

        return categories;
    }

    @AuraEnabled
    public static Book__c upsertBook(String jsonString, String documentId) {
        return BookService.upsertBook(jsonString, documentId);
    }

    @AuraEnabled
    public static void deleteBook(Id bookId) {
        Integer bookReservationsCount = ReservationSelector.selector.getByBookIds(new List<Id>{ bookId }).size();
        if (bookReservationsCount > 0) {
            BookService.updateBook(new Book__c(
                Id = bookId,
                Disabled__c = true
            ));
            FavouriteService.deleteRecordsByBookIds(new List<Id>{ bookId });
            WishListService.deleteRecordsByBookIds(new List<Id>{ bookId });

        } else {
            Book__c book = BookSelector.selector.getByIds(new List<Id>{ bookId })[0];
            if (String.isNotBlank(book.Photo_Id__c)) {
                FileController.deleteDocumentByVersionId(book.Photo_Id__c);
            }
            BookService.deleteBook(bookId);
        }
    }

//    public class ReaderBook extends Book {
//        @AuraEnabled public List<Wish_List__c> wishLists { get; set; }
//        @AuraEnabled public List<Favourite__c> favourites { get; set; }
//        @AuraEnabled public Datetime availableFrom { get; set; }
//
//        public ReaderBook(Book__c book) {
//            this.wishLists = book.Wish_Lists__r;
//            this.favourites = book.Favourites__r;
//        }
//    }


    public abstract class Book {
        @AuraEnabled public String author { get; set; }
        @AuraEnabled public String category { get; set; }
        @AuraEnabled public String description { get; set; }
        @AuraEnabled public Boolean disabled { get; set; }
        @AuraEnabled public String language { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public Id ownerId { get; set; }
        @AuraEnabled public String photoId { get; set; }
        @AuraEnabled public String photoURL { get; set; }
        @AuraEnabled public Integer publicationYear { get; set; }
        @AuraEnabled public String publishingHouse { get; set; }
        @AuraEnabled public User owner;

        @AuraEnabled public List<Reservation__c> reservations = new List<Reservation__c>();

        public Book(Book__c book) {
            this.author = book.Author__c;
            this.category = book.Category__c;
            this.description = book.Description__c;
            this.disabled = book.Disabled__c;
            this.language = book.Language__c;
            this.name = book.Name;
            this.ownerId = book.OwnerId;
            this.photoId = book.Photo_Id__c;
            this.photoURL = book.Photo_URL__c;
            this.publicationYear = (Integer) book.Publication_Year__c;
            this.publishingHouse = book.Publishing_House__c;
            this.owner = book.Owner;

            this.reservations = book.Reservations__r;
        }
    }
}

//this.availableFrom = Datetime.now();
//for (Reservation__c reservation: book.Reservations__r) {
//    if (this.availableFrom >= reservation.Start_Date__c) {
//        this.availableFrom = reservation.End_Date__c;
//    } else {
//        break;
//    }
//}

//this.availableFrom = Datetime.now();
//for (Reservation__c reservation: book.Reservations__r) {
//    if (this.availableFrom >= reservation.Start_Date__c) {
//        this.availableFrom = reservation.End_Date__c;
//    } else {
//        break;
//    }
//}
//
//for (Reservation__c reservation: book.Reservations__r) {
//    if (reservation.CreatedById == UserInfo.getUserId()) {
//        this.reservations.add(reservation);
//    }
//}