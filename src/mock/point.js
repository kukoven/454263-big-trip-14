import {TYPES, TEST_TEXT, Sentence, CITIES, DAY_GAP, MINUTES_GAP, HOURS_GAP} from '../const.js';
import {getRandomInteger, getRandomIndex} from '../util.js';
import {offers} from './offers.js';
import dayjs from 'dayjs';

const getRandomTypePoint = () => {
  return TYPES[getRandomIndex(TYPES)];
};

const getRandomDescription = (text) => {
  //const sentence = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|');
  const sentence = text.slice(0, -1).split('. ');
  const sentenceCount = getRandomInteger(Sentence.min, Sentence.max);
  const randomIndex = getRandomIndex(sentence);

  return `${sentence.slice(randomIndex, randomIndex + sentenceCount).join('. ')}.`;
};

const generatePictures = () => {
  const pictures = [];

  for (let i = 0; i < getRandomInteger(1, 6); i++) {
    pictures.push(
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 1000)}`,
        destination: getRandomDescription(TEST_TEXT),
      },
    );
  }

  return pictures;
};

const generateDestination = () => {
  return {
    description: getRandomDescription(TEST_TEXT),
    name: CITIES[getRandomIndex(CITIES)],
    pictures: generatePictures(),
  };
};

const generateRandomDate = () => {
  return dayjs().add(getRandomInteger(-DAY_GAP, DAY_GAP), 'day').add(getRandomInteger(0, HOURS_GAP), 'hour').add(getRandomInteger(0, MINUTES_GAP), 'minute').format('YYYY-MM-DDTHH:mm');
};

const generatePoint = () => {
  const dateFrom = generateRandomDate();
  const dateTo = dayjs(dateFrom).add(getRandomInteger(0, getRandomInteger(0, HOURS_GAP)), 'hour').add(getRandomInteger(0, MINUTES_GAP), 'minute').format('YYYY-MM-DDTHH:mm');
  const randomTypePoint = getRandomTypePoint();

  const typeOffers = offers.find((currentValue) => {
    return currentValue.type === randomTypePoint;
  }).offers;

  return {
    type: randomTypePoint,
    destination: generateDestination(),
    dateFrom,
    dateTo,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(1, 1000),
    offers: typeOffers,
  };
};

export {generatePoint};
