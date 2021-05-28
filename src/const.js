const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const TEST_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
const Sentence = {
  MIN: 1,
  MAX: 5,
};
const CITIES = ['Moscow', 'Saint-Petersburg', 'New-York', 'San-Francisco', 'Tokyo', 'Sydney', 'Hong Kong', 'Bangkok', 'London', 'Paris', 'Istanbul'];
const DAY_GAP = 3;
const HOURS_GAP = 24;
const MINUTES_GAP = 60;

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const OFFERS = [
  {
    type: 'Taxi',
    offers: [
      {title: 'Switch to comfort', price: 80},
      {title: 'Wi-Fi', price: 10},
    ],
  },
  {
    type: 'Bus',
    offers: [
      {title: 'Add meal', price: 50},
    ],
  },
  {
    type: 'Train',
    offers: [
      {title: 'Add meal', price: 50},
      {title: 'Switch to comfort', price: 80},
    ],
  },
  {
    type: 'Ship',
    offers: [
      {title: 'Switch ship', price: 1000},
      {title: 'Upgrade to comfort', price: 120},
      {title: 'Upgrade meal', price: 50},
      {title: 'Add luggage', price: 100},
      {title: 'Add surprise', price: 20},
    ],
  },
  {
    type: 'Transport',
    offers: [
      {title: 'Wi-Fi', price: 10},
    ],
  },
  {
    type: 'Drive',
    offers: [
      {title: 'Upgrade car', price: 120},
      {title: 'Add insurance', price: 100},
      {title: 'Add driver', price: 150},
    ],
  },
  {
    type: 'Flight',
    offers: [
      {title: 'Upgrade to a business class', price: 120},
      {title: 'Add luggage', price: 100},
      {title: 'Add meal', price: 15},
      {title: 'Choose seats', price: 5},
    ],
  },
  {
    type: 'Check-in',
    offers: [],
  },
  {
    type: 'Sightseeing',
    offers: [
      {title: 'Add meal', price: 15},
    ],
  },
  {
    type: 'Restaurant',
    offers: [],
  },
];

const DEFAULT_TIME_DIFFERENCE = 1;

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export {
  TYPES,
  TEST_TEXT,
  Sentence,
  CITIES,
  DAY_GAP,
  HOURS_GAP,
  MINUTES_GAP,
  SortType,
  OFFERS,
  DEFAULT_TIME_DIFFERENCE,
  UserAction,
  UpdateType,
  FilterType
};
