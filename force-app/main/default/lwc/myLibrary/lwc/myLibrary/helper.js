export const helper = {
  mapData(data) {
    return data.map(item => {
      return {
        categories: item.Category__c.split(';'),
        ...item
      };
    })
  },
};