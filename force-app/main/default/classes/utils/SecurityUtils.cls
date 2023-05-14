public with sharing class SecurityUtils {
    private static void throwCustomException(String typeOfOperation, String objectName) {
        throw new LibraryException(String.format(LibraryException.OBJECT_ACCESS_RESTRICTED, new List<String> {typeOfOperation, objectName}));
    }

    public static void saveInsert(SObject record) {
        DescribeSObjectResult describeSObjectResult = record.getSObjectType().getDescribe();
        if (!describeSObjectResult.isCreateable()) {
            throwCustomException('create', describeSObjectResult.getName());
        }

        insert record;
    }

    public static void saveUpsert(SObject record) {
        if (record.Id == null) {
            saveInsert(record);
        } else {
            saveUpdate(record);
        }
    }

    public static void saveUpdate(SObject record) {
        DescribeSObjectResult describeSObjectResult = record.getSObjectType().getDescribe();
        if (!describeSObjectResult.isUpdateable()) {
            throwCustomException('update', describeSObjectResult.getName());
        }

        update record;
    }

    public static void saveDelete(SObject record) {
        DescribeSObjectResult describeSObjectResult = record.getSObjectType().getDescribe();
        if (!describeSObjectResult.isDeletable()) {
            throwCustomException('delete', describeSObjectResult.getName());
        }

        delete record;
    }

    public static void saveDelete(List<SObject> records) {
        if (records.isEmpty()) {
            return;
        }

        DescribeSObjectResult describeSObjectResult = records[0].getSObjectType().getDescribe();
        if (!describeSObjectResult.isDeletable()) {
            throwCustomException('delete', describeSObjectResult.getName());
        }

        delete records;
    }
}