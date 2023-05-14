export const helper = {
  mapData(data) {
    const result = [];
    for (const book of data) {
      const categories = book.Category__c.split(';');
      const isFavourite = book.Favourites__r || null;
      const isWishList = book.Wish_Lists__r || null;

      for (const reservation of book.Reservations__r) {
        result.push({
          categories: categories,
          ...book,
          Favourites__r: isFavourite,
          Wish_Lists__r: isWishList,
          Reservations__r: [ reservation ],
        });
      }
    }
    result.sort((a, b) => this.compareDates(a.Reservations__r[0].Start_Date__c, b.Reservations__r[0].Start_Date__c));
    return result;
  },

  compareDates(date1, date2) {
    date1 = date1 instanceof Date ? date1 : new Date(date1);
    date2 = date2 instanceof Date ? date2 : new Date(date2);
    return date1 > date2
      ? -1
      : date1 < date2
        ? 1
        : 0;
  }
};