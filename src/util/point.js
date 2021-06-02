import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

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

const getTimeDifferenceMs = (start, end) => {
  return dayjs(end).diff(dayjs(start));
};

const getTimeFormatted = (timeInMs) => {
  const time = {
    days: dayjs.duration(timeInMs).asDays() > 1 ? dayjs.duration(timeInMs).days() + 'D ' : '',
    hours: dayjs.duration(timeInMs).hours() > 0 ? dayjs.duration(timeInMs).hours() + 'H ' : '',
    minutes: dayjs.duration(timeInMs).minutes() > 0 ? dayjs.duration(timeInMs).minutes() + 'M' : '',
  };

  return time.days + time.hours + time.minutes;
};

const formatDateForEditPoint = (date) => {
  if (date !== null) {
    return dayjs(date).format('D/MM/YY HH:mm');
  }

  return '';
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

  if (weight !== null) {
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

const isPointFuture = (date) => {
  return dayjs(date).isSameOrAfter(dayjs());
};

const isPointPast = (date) => {
  return dayjs(date).isBefore(dayjs());
};


export {
  getTimeDifference,
  formatDateForEditPoint,
  getTotalDate,
  getWeightNullDate,
  sortDay,
  sortTime,
  sortPrice,
  isPointFuture,
  isPointPast,
  getTimeFormatted,
  getTimeDifferenceMs
};
