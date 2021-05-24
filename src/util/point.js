import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;

const getTimeDifference = (timeFrom, timeTo) => {
  let minutes = dayjs(timeTo).diff(dayjs(timeFrom), 'm');
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

const getWeightNullDate = (firstDate, secondDate) => {
  if (firstDate === null && secondDate === null) {
    return 0;
  }

  if (firstDate === null) {
    return 1;
  }

  if (secondDate === null) {
    return -1;
  }

  return null;
};

const sortDay = (firstPoint, secondPoint) => {
  const weight = getWeightNullDate(firstPoint.dateFrom, secondPoint.dateFrom);

  if (weight != null) {
    return weight;
  }

  return dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));
};

const sortEvent = (firstPoint, secondPoint) => {
  if (firstPoint.type > secondPoint.type) {
    return 1;
  }

  if (firstPoint.type < secondPoint.type) {
    return -1;
  }

  return 0;
};

const sortTime = (firstPoint, secondPoint) => {
  if ((dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom))) < (dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)))) {
    return 1;
  }

  if ((dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom))) > (dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)))) {
    return -1;
  }

  return 0;
};

const sortPrice = (firstPoint, secondPoint) => {
  if (firstPoint.basePrice < secondPoint.basePrice) {
    return 1;
  }

  if (firstPoint.basePrice > secondPoint.basePrice) {
    return -1;
  }

  return 0;
};

const sortOffers = (firstPoint, secondPoint) => {
  if (firstPoint.offers.length < secondPoint.offers.length) {
    return 1;
  }

  if (firstPoint.offers.length > secondPoint.offers.length) {
    return -1;
  }

  return 0;
};

export {
  getTimeDifference,
  formatDateForEditPoint,
  getTotalDate,
  getWeightNullDate,
  sortDay,
  sortEvent,
  sortTime,
  sortPrice,
  sortOffers
};
