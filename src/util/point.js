import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

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
  return `${dayjs(dateFrom).format('MMM D')} - ${dayjs(dateTo).format('MMM D')}`;
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

const findOffersType = (offers, type) => {
  return offers.find((currentValue) => currentValue.type.toLowerCase() === type.toLowerCase()).offers;
};

function isPointFuture(date) {
  return dayjs(date).isSameOrAfter(dayjs());
}

function isPointPast(date) {
  return dayjs(date).isBefore(dayjs());
}

export {
  getTimeDifference,
  formatDateForEditPoint,
  getTotalDate,
  getWeightNullDate,
  sortDay,
  sortTime,
  sortPrice,
  findOffersType,
  isPointFuture,
  isPointPast
};
