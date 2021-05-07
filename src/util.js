import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;
const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomIndex = (array) => {
  return getRandomInteger(0, array.length - 1);
};

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

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {
  getRandomInteger,
  getRandomIndex,
  getTimeDifference,
  formatDateForEditPoint,
  getTotalDate,
  RenderPosition,
  render,
  createElement
};
