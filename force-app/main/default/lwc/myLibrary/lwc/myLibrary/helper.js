export const helper = {
  mapData(data) {
    return data.map(item => {
      return {
        categories: item.Category__c.split(';'),
        photo: 'photo',
        address: 'Lviv, Ukraine',
        phone: item.Owner__r.Phone,
        email: item.Owner__r.Email,
        telegram: item.Owner__r.Telegram_Phone__c || item.Owner__r.Telegram_Username__c,
        viber: item.Owner__r.Viber__c,
        instagram: item.Owner__r.Instagram__c,
        shortDescription: 'Інтрига, навколо якої розгортаються події роману, пов’язана з одвічною загадкою людства: походження, особистість, родина Ісуса Христа. Відповіді на цю загадку активно, але з ризиком...',
        ...item
      };
    })
  },
};