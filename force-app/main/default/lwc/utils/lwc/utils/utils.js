import { NavigationMixin } from "lightning/navigation";
import BOOK from '@salesforce/schema/Book__c';

export const CORE_NAMESPACE = BOOK.objectApiName.replace('Book__c', '');

export const STATUS_CREATED = 'created';
export const STATUS_CANCELED = 'canceled';
export const STATUS_CONFIRMED = 'confirmed';
export const STATUS_REJECTED = 'rejected';
export const STATUS_FINISHED_BY_OWNER = 'finished by owner';
export const STATUS_FINISHED_BY_READER = 'finished by reader';
export const STATUS_FINISHED = 'finished';

export const STATUS_OPTIONS = [{
  label: 'Wait for confirmation',
  value: 'created',
},{
  label: 'Reading',
  value: 'confirmed',
},{
  label: 'Canceled by reader',
  value: 'canceled',
},{
  label: 'Rejected by owner',
  value: 'rejected',
},{
  label: 'Finished by Owner',
  value: 'finished by owner',
},{
  label: 'Finished by Reader',
  value: 'finished by reader',
},{
  label: 'Finished',
  value: 'finished',
}];

export function getStatusLabel(value) {
  const labelByStatus = {
    created: 'Wait for confirmation',
    confirmed: 'Reading',
    canceled: 'Canceled by reader',
    rejected: 'Rejected by owner',
    'finished by owner': 'Finished by Owner',
    'finished by reader': 'Finished by Reader',
    finished: 'Finished',
  };

  return value ? labelByStatus[value] : '';
}


// 12 Dec 2024
export const formatDate = value => {
  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date)) {
    return '';
  }

  return [
    date.toLocaleString('en', { day: '2-digit' }),
    date.toLocaleString('en', { month: 'short' }),
    date.toLocaleString('en', { year: 'numeric' }),
  ].join(' ');
}



//03:23
export const formatTime = value => {
  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleString('en', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

export const navigateTo = (cmpContext, type, params, isNewTab) => {

  const pageRef = {
    type: type,
    ...params,
  };

  if (!isNewTab) {
    cmpContext[NavigationMixin.Navigate](pageRef);

    return;
  }

  cmpContext[NavigationMixin.GenerateUrl](pageRef).then(url => {
    if (isNewTab) {
      window.open(url);
    } else {
      window.location.href = url;
    }
  });
};

export const navigateToAppPage = (cmpContext, appName, state, isNewTab) => {
  const attr = {
    attributes: {
      apiName: appName,
    },
    state: state,
  };

  navigateTo(cmpContext, 'standard__navItemPage', attr, isNewTab);
};



export const clearInput = s => {
  return (s + '').replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#039;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />');
}