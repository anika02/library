import {LightningElement} from 'lwc';

export default class UiPagination extends LightningElement {
    pages = [
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
}