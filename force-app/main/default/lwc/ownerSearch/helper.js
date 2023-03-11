const record = {
    name: 'Код да Вінчі',
    author: 'Ден Браун',
    photo: 'photo',
    owner: 'Batman',
    address: 'Lviv, Ukraine',
    phone: '(067) 322 77 22',
    email: 'test@example.com',
    telegram: '(067) 322 77 22',
    viber: '(067) 322 77 22',
    instagram: 'instagram_link',
    shortDescription: 'Інтрига, навколо якої розгортаються події роману, пов’язана з одвічною загадкою людства: походження, особистість, родина Ісуса Христа. Відповіді на цю загадку активно, але з ризиком...',
    description: 'Інтрига, навколо якої розгортаються події роману, пов’язана з одвічною загадкою людства: походження, особистість, родина Ісуса Христа. Відповіді на цю загадку активно, але з ризиком для власного життя шукають герої книги — гарвардський учений Роберт Ленґдон та його несподівана супутниця, криптограф Софі. Дивні, часом неймовірні відкриття чекають героїв на їхньому небезпечному шляху до істини. Але дійти до істини чи й пощастить аж майбутнім дітям героїв, які можуть виявитися нащадками Ісуса Христа.',
};

const recordWithStatus = {
    ...record,
    status: 'WAIT FOR CONFIRMATION',
    date: '12.03.2023 - 26.03.2024',
};

export const defaultRecords = [
    record, recordWithStatus, record,
    record, recordWithStatus, record,
];

export const pages = [
    {
        value: 1,
        isCurrent: false,
        isDots: false,
        variant: 'secondary',
    },
    {
        isCurrent: false,
        isDots: true,
    },
    {
        value: 4,
        isCurrent: false,
        isDots: false,
        variant: 'secondary',
    },
    {
        value: 5,
        isCurrent: true,
        isDots: false,
        variant: 'primary',
    },
    {
        value: 6,
        isCurrent: false,
        isDots: false,
        variant: 'secondary',
    },
    {
        isCurrent: false,
        isDots: true,
    },
    {
        value: 10,
        isCurrent: false,
        isDots: false,
        variant: 'secondary',
    },
];