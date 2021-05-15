import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;

const getTimeDifference = (timeFrom, timeTo) => {
  let minutes = timeTo.diff(timeFrom, 'm');
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);

  minutes = minutes - (hours * MINUTES_IN_HOUR);

  if (hours === 0) {
    return`${minutes}M`;
  }

  return `${hours}H ${minutes}M`;
};

const formatDateForEditPoint = (date) => {
  if (date !== null) {
    return dayjs(date).format('D/MM/YY HH:mm');
  } else {
    return '';
  }
};

const getTotalDate = (dateFrom, dateTo) => {
  return `${dayjs(dateFrom).format('MMM D')} - ${dayjs(dateTo).format('D')}`;
};

export {getTimeDifference, formatDateForEditPoint, getTotalDate};
