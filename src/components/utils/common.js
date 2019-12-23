import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const take = (array, count, startPos = 0) => array.slice(startPos, startPos + count);
