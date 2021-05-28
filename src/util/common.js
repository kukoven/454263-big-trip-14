const regularExpression = new RegExp('^\\d+$');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));

  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));

};
const getRandomIndex = (array) => {
  return getRandomInteger(0, array.length - 1);

};
const isEscEvent = (evt) => {
  return evt.key === 'Esc' || evt.key === 'Escape';

};

const isNumber = (value) => {
  return regularExpression.test(value);
};

export {getRandomInteger, getRandomIndex, isEscEvent, isNumber};
