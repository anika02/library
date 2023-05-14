import { STATUS_CREATED } from 'c/utils';

export const helper = {
  mapData(data) {
    const result = [];
    for (const book of data) {
      let counter = 0;
      const bookReservations = [];
      const activeBookReservations = [];
      const createdBookReservations = [];
      const categories = book.Category__c.split(';');

      for (const reservation of book.Reservations__r) {
        bookReservations.push({
          categories: categories,
          ...book,
          Start_Date__c: new Date(book.Start_Date__c),
          End_Date__c: new Date(book.End_Date__c),
          Reservations__r: [ reservation ],
          isAllowed: true
        });

        if (reservation.Status__c === STATUS_CREATED) {
          createdBookReservations.push([ reservation, counter ]);
        } else {
          activeBookReservations.push(reservation);
        }

        counter++;
      }

      for (const [ createdBook, index ] of createdBookReservations) {
        for (const activeBook of activeBookReservations) {
          if (this.isCrossedActiveAndCreatedReservations(activeBook, createdBook)) {
            bookReservations[index].isAllowed = false;
          }
        }
      }

      result.push( ...bookReservations );
    }

    return result;
  },

  isCrossedActiveAndCreatedReservations(active, created) {
    return !((created.End_Date__c < active.Start_Date__c) || (active.End_Date__c < created.Start_Date__c));
  },
};