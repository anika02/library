export const helper = {
    mapData(data) {
        return data.map(item => {
            return {
                categories: item.Category__c.split(';'),
                ...item,
                Favourites__r: item.Favourites__r || null,
                Wish_Lists__r: item.Wish_Lists__r || null,
                Reservations__r: item.Reservations__r || null,
            };
        })
    },
};